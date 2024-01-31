from rest_framework import serializers
from django.shortcuts import get_object_or_404
from rest_framework.validators import UniqueTogetherValidator
from django.http import Http404, HttpResponse, JsonResponse
from rest_framework.exceptions import ValidationError, ParseError
from recipes.models import *

class LikeSerializer(serializers.ModelSerializer):
    recipe_name = serializers.CharField(source='recipe.name', read_only=True)

    class Meta:
        model = Like
        fields = ['recipe', 'recipe_name', 'user']
        validators = [
            UniqueTogetherValidator(
                queryset=Like.objects.all(),
                fields=['recipe', 'user']
            )
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    recipe_name = serializers.CharField(source='recipe.name', read_only=True)

    class Meta:
        model = Favorite
        fields = ['recipe', 'recipe_name', 'user']
        validators = [
            UniqueTogetherValidator(
                queryset=Favorite.objects.all(),
                fields=['recipe', 'user']
            )
        ]

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ['id', 'name']

class BaseIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseIngredient
        fields = ['id', 'name', 'unit']
        
    def create(self, validated_data):
        name = validated_data['name'].lower()
        unit = validated_data['unit'].lower()
        try:
            base_ingredient_exist = BaseIngredient.objects.get(name=name)
            raise ValidationError("base ingredient with this name already exists.")
        except BaseIngredient.DoesNotExist:
            base_ingredient = BaseIngredient.objects.create(
                name=name,
                unit=unit
            )
            base_ingredient.save()
            return base_ingredient


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    # recipe = serializers.PrimaryKeyRelatedField
    name = serializers.CharField(allow_null=False, allow_blank=False, write_only=True)
    unit = serializers.CharField(allow_null=True, allow_blank=True, write_only=True)
    baseIngredient_name = serializers.CharField(source='baseIngredient.name', allow_null=False, allow_blank=False,
                                                read_only=True)
    baseIngredient_unit = serializers.CharField(source='baseIngredient.unit', allow_null=True, allow_blank=True,
                                                read_only=True)
    baseIngredient_id = serializers.CharField(source='baseIngredient.id', allow_null=True, allow_blank=True,
                                              read_only=True)

    class Meta:
        model = Ingredient
        fields = ['name', 'baseIngredient_id', 'baseIngredient_name', 'baseIngredient_unit', 'unit', 'amount', 'recipe']
        read_only_fields = ('recipe', )


class StepSerializer(serializers.ModelSerializer):

    class Meta:
        model = Step
        fields = ['type', 'step_num', 'hour', 'min', 'description', 'recipe']
        read_only_fields = ('recipe',)


class RecipeSerializer(serializers.ModelSerializer):
    base_recipe_name = serializers.CharField(source='base_recipe.name',
                                             allow_null=True, required=False)
    diets = serializers.PrimaryKeyRelatedField(many=True, required=False,
                                               queryset=Diet.objects.all())
    # diets = DietSerializer(many=True, required=False)
    ingredients = IngredientSerializer(many=True,
                                       required=False)
    steps = StepSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = ['id', 'base_recipe', 'base_recipe_name', 'name', 'cuisine',
                  'total_prep_hour', 'total_prep_min', 'steps',
                  'total_cook_hour', 'total_cook_min', 'user', 'servings',
                  'diets', 'ingredients']
        read_only_fields = ('user',)

    def create(self, validated_data):
        
        for key, value in validated_data.items():
            print(key, value)

        base_recipe = validated_data.get('base_recipe')
        name = validated_data.get('name')
        cuisine = validated_data.get('cuisine')
        total_prep_hour = validated_data.get('total_prep_hour')
        total_prep_min = validated_data.get('total_prep_min')
        total_cook_hour = validated_data.get('total_cook_hour')
        total_cook_min = validated_data.get('total_cook_min')
        user = self.context['request'].user
        servings = validated_data.get('servings')
        diets = validated_data.get('diets')
        ingredients = validated_data.get('ingredients')
        recipeFiles = validated_data.get('recipeImage')

        recipe = Recipe.objects.create(
            base_recipe=base_recipe,
            name=name,
            cuisine=cuisine,
            total_prep_hour=total_prep_hour,
            total_prep_min=total_prep_min,
            total_cook_hour=total_cook_hour,
            total_cook_min=total_cook_min,
            user=user,
            servings=servings
        )

        if diets:
            for diet in diets:
                d = get_object_or_404(Diet, id=diet.id)
                recipe.diets.add(d)

        if ingredients:
            ingredient_creation_list = []
            for i in ingredients:
                name = i.get("name")
                unit = i.get("unit")
                amount = i.get("amount")
                if base_ingredient := BaseIngredient.objects.filter(name=name).first():
                    ingredient_creation_list.append(
                        Ingredient(
                            baseIngredient=base_ingredient,
                            amount=amount,
                            recipe=recipe
                        )
                    )
                else:
                    base_ingredient = BaseIngredient.objects.create(
                        name=name,
                        unit=unit
                    )

                    ingredient_creation_list.append(
                        Ingredient(
                            baseIngredient=base_ingredient,
                            amount=amount,
                            recipe=recipe
                        )
                    )

            # ingredient_creation_list = [
            #     # Ingredient(name=i.get('name'),
            #     #            unit=i.get('unit'),
            #     #            amount=i.get('amount'),
            #     #            recipe=recipe)
            #     Ingredient(baseIngredient=i.get('baseIngredient'),
            #                amount=i.get('amount'),
            #                recipe=recipe)
            #
            #     for i in ingredients
            # ]
            Ingredient.objects.bulk_create(ingredient_creation_list)

        try:
            recipeFiles = self.context['request'].data.getlist('recipeImage')
        except KeyError:
            recipeFiles = []

        if recipeFiles:
            first_file = False
            recipeFiles_creation_list = []
            if isinstance(recipeFiles, list):
                for f in recipeFiles:
                    main_img = False
                    if not first_file:
                        first_file = True
                        main_img = True
                    recipeFiles_creation_list.append(
                        RecipeFile(
                            file=f,
                            mainImage=main_img,
                            recipe=recipe
                        )
                    )
            else:
                recipeFiles_creation_list.append(
                    RecipeFile(
                        file=recipeFiles,
                        mainImage=True,
                        recipe=recipe
                    )
                )
            RecipeFile.objects.bulk_create(recipeFiles_creation_list)


        print(self.context['request'].data)

        try:
            steps_type = self.context['request'].data.getlist('steps.type')
        except KeyError:
            steps_type = []

        if steps_type:
            steps_step_num = self.context['request'].data.getlist('steps.step_num')
            steps_hour = self.context['request'].data.getlist('steps.hour')
            steps_min = self.context['request'].data.getlist('steps.min')
            steps_description = self.context['request'].data.getlist('steps.description')
            steps_file1 = self.context['request'].data.getlist('steps.file1')
            steps_file2 = self.context['request'].data.getlist('steps.file2')
        
        if steps_type:

            # check if steps are in order
            # prep_steps = list(filter(lambda x: not x['type'], list(steps)))
            # cook_steps = list(filter(lambda x: x['type'], list(steps)))
            # prep_steps.sort(key=lambda x: x['step_num'])
            # cook_steps.sort(key=lambda x: x['step_num'])

            # for i in range(len(prep_steps)):
            #     if prep_steps[i]['step_num'] != i + 1:
            #         raise serializers.ValidationError("Invalid step number", 400)

            # for i in range(len(cook_steps)):
            #     if cook_steps[i]['step_num'] != i + 1:
            #         raise serializers.ValidationError("Invalid step number", 400)

            # Add steps to db
            print(len(steps_type))
            for i in range(len(steps_type)):
                
                str_bool = steps_type[i]
                final = False
                if str_bool.lower() != "false":
                    final=True

                step = Step.objects.create(
                    type=final,
                    step_num=steps_step_num[i],
                    hour=steps_hour[i],
                    min=steps_min[i],
                    description=steps_description[i],
                    recipe=recipe
                )
                
                if steps_file1[i] != "null":
                    StepFile.objects.create(
                        file=steps_file1[i],
                        step=step
                    )

                if steps_file2[i] != "null":
                    StepFile.objects.create(
                        file=steps_file2[i],
                        step=step
                    )

        recipe.save()
        return recipe

    def update(self, instance, validated_data):
        logged_in_user = self.context['request'].user
        user = instance.user

        if logged_in_user.id != user.id:
            raise serializers.ValidationError({
                                                  "authorize": "You do not have permission to update this user."})

        base_recipe = validated_data.get('base_recipe')
        name = validated_data.get('name')
        cuisine = validated_data.get('cuisine')
        total_prep_hour = validated_data.get('total_prep_hour')
        total_prep_min = validated_data.get('total_prep_min')
        total_cook_hour = validated_data.get('total_cook_hour')
        total_cook_min = validated_data.get('total_cook_min')
        servings = validated_data.get('servings')
        diets = validated_data.get('diets')
        ingredients = validated_data.get('ingredients')
        steps = validated_data.get('steps')

        # print("instance", instance)

        if base_recipe is not None and base_recipe != instance.base_recipe:
            instance.base_recipe = base_recipe

        if name is not None and name != instance.name:
            instance.name = name

        if cuisine is not None and cuisine != instance.cuisine:
            instance.cuisine = cuisine

        if total_prep_hour is not None and total_prep_hour != instance.total_prep_hour:
            instance.total_prep_hour = total_prep_hour

        if total_prep_min is not None and total_prep_min != instance.total_prep_min:
            instance.total_prep_min = total_prep_min

        if total_cook_hour is not None and total_cook_hour != instance.total_cook_hour:
            instance.total_cook_hour = total_cook_hour

        if total_cook_min is not None and total_cook_min != instance.total_cook_min:
            instance.total_cook_min = total_cook_min

        if servings is not None and servings != instance.servings:
            instance.servings = servings

        if diets is not None and diets != instance.diets:
            instance.diets.set(diets)

        if ingredients is not None and ingredients != instance.ingredients:
            # print("instance ingredient: ", instance.id)
            Ingredient.objects.filter(recipe=instance).delete()

            if ingredients:
                ingredient_creation_list = []
                recipe = get_object_or_404(Recipe, id=instance.id)
                for i in ingredients:
                    name = i.get("name")
                    unit = i.get("unit")
                    amount = i.get("amount")
                    if base_ingredient := BaseIngredient.objects.filter(
                            name=name).first():
                        ingredient_creation_list.append(
                            Ingredient(
                                baseIngredient=base_ingredient,
                                amount=amount,
                                recipe=recipe
                            )
                        )
                    else:
                        base_ingredient = BaseIngredient.objects.create(
                            name=name,
                            unit=unit
                        )

                        ingredient_creation_list.append(
                            Ingredient(
                                baseIngredient=base_ingredient,
                                amount=amount,
                                recipe=recipe
                            )
                        )

                Ingredient.objects.bulk_create(ingredient_creation_list)

        if steps is not None and steps != instance.steps:

            # check if steps are in order
            prep_steps = list(filter(lambda x: not x['type'], list(steps)))
            cook_steps = list(filter(lambda x: x['type'], list(steps)))
            prep_steps.sort(key=lambda x: x['step_num'])
            cook_steps.sort(key=lambda x: x['step_num'])

            for i in range(len(prep_steps)):
                if prep_steps[i]['step_num'] != i + 1:
                    raise serializers.ValidationError("Invalid step number",
                                                      400)

            for i in range(len(cook_steps)):
                if cook_steps[i]['step_num'] != i + 1:
                    raise serializers.ValidationError("Invalid step number",
                                                      400)

            Step.objects.filter(recipe=instance).delete()

            if steps:
                step_creation_list = [
                    Step(
                        type=s.get('type'),
                        step_num=s.get('step_num'),
                        hour=s.get('hour'),
                        min=s.get('min'),
                        description=s.get('description'),
                        recipe=get_object_or_404(Recipe, id=instance.id)
                    )
                    for s in steps
                ]
                Step.objects.bulk_create(step_creation_list)

        instance.save()

        return instance

class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListRecipe
        fields = ['id', 'recipe', 'user', 'servingSize']
        validators = [
            UniqueTogetherValidator(
                queryset=ShoppingListRecipe.objects.all(),
                fields=['recipe', 'user', 'servingSize']
            )
        ]

    def validate(self, data):
        if data['user'] != self.context['request'].user:
            raise serializers.ValidationError('User not logged in')
        return data

    def update(self, instance, validated_data):
        instance.servingSize = validated_data['servingSize']
        instance.save()

        return instance


class RatingSerializer(serializers.ModelSerializer):
    recipe_name = serializers.CharField(source='recipe.name', read_only=True)

    class Meta:
        model = Rating
        fields = ['recipe', 'recipe_name', 'user', 'stars']
        validators = [
            UniqueTogetherValidator(
                queryset=Rating.objects.all(),
                fields=['recipe', 'user']
            )
        ]


class CommentSerializer(serializers.ModelSerializer):
    recipe_name = serializers.CharField(source='recipe.name', read_only=True)
    comment_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Comment
        fields = ['comment_id', 'recipe', 'recipe_name', 'user', 'datetime', 'text', 'commentFiles']

    def create(self, validated_data):
        # print(self.context)
        logged_in_user = self.context['request'].user
        recipe_id = self.context['id']
        text = validated_data['text']
        try:
            recipe = Recipe.objects.get(id=recipe_id)
        except Recipe.DoesNotExist:
            raise Http404("Recipe does not exist")
        comment = Comment.objects.create(user=logged_in_user,
                                         recipe = recipe,
                                         text = text)
        comment.save()
        try:
            files = self.context['request'].data.getlist('file')
        except KeyError:
            files = []
        print(files)
        for file in files:
            file = CommentFile.objects.create(file=file, comment=comment)
        return comment

    def update(self, instance, validated_data):
        instance.text = validated_data['text']
        instance.save()
        return instance



class CommentFileSerializer(serializers.ModelSerializer):
    comment_id = serializers.CharField(source='comment.id', read_only=True)

    class Meta:
        model = CommentFile
        fields = ['id', 'comment_id', 'comment', 'file']


class RecipeCardSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()
    name = serializers.CharField(read_only=True)
    likes = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    numRatings = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'img', 'name', 'likes', 'rating', 'numRatings', 'duration']

    def get_img(self, obj):
        main = obj.recipeFiles.filter(mainImage=True).first()
        if main:
            print(main.file)
            return "http://localhost:8000" + main.file.url
        return main
    
    def get_likes(self, obj):
        return len(obj.recipeLikes.all())
    
    def get_rating(self, obj):
        ratings = obj.recipeRatings.all()
        num = 0
        total = 0
        for rating in ratings:
            total += rating.stars
            num += 1
        if num > 0:
            return round(total/num, 1)
        else:
            return 0
        
    def get_numRatings(self, obj):
        return obj.recipeRatings.all().count()

    def get_duration(self, obj):
        prep_hour = obj.total_prep_hour if obj.total_prep_hour else 0
        prep_min = obj.total_prep_min if obj.total_prep_min else 0
        cook_hour = obj.total_cook_hour if obj.total_cook_hour else 0
        cook_min = obj.total_cook_min if obj.total_cook_min else 0
        
        return round(prep_hour + prep_min/60 + cook_hour + cook_min/60, 1)
    

class RecipeDetailedSerializer(serializers.ModelSerializer):
    base_recipe_name = serializers.CharField(source='base_recipe.name',
                                             allow_null=True, required=False)
    cuisine_name = serializers.CharField(source='cuisine.name',
                                          allow_null=True, required=False)
    diets_detailed = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    num_ratings = serializers.SerializerMethodField()
    num_likes = serializers.SerializerMethodField()
    num_favorites = serializers.SerializerMethodField()
    recipe_images = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    prep_steps = serializers.SerializerMethodField()
    cook_steps = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id',
                  'base_recipe',
                  'base_recipe_name',
                  'name',
                  'cuisine',
                  "cuisine_name",
                  'avg_rating',
                  'num_ratings',
                  "num_likes",
                  "num_favorites",
                  'cuisine_name',
                  'total_prep_hour',
                  'total_prep_min',
                  'total_cook_hour',
                  'total_cook_min',
                  'user',
                  'diets',
                  'diets_detailed',
                  'servings',
                  'recipe_images',
                  'ingredients',
                  'prep_steps',
                  "cook_steps",
                  ]
        
    def get_diets_detailed(self, obj):
        diets = obj.diets.all()
        ret = []
        for diet in diets:
            ret.append([diet.id, diet.name])
        return ret
    
    def get_avg_rating(self, obj):
        ratings = obj.recipeRatings.all()
        num = 0
        total = 0
        for rating in ratings:
            total += rating.stars
            num += 1
        if num > 0:
            return round(total/num, 1)
        else:
            return 0
        
    def get_num_ratings(self, obj):
        return obj.recipeRatings.all().count()
    
    def get_num_likes(self, obj):
        return obj.recipeLikes.all().count()
    
    def get_num_favorites(self, obj):
        return obj.recipeFavorites.all().count()
    
    def get_recipe_images(self, obj):
        imgs = obj.recipeFiles.all()
        acc = []
        for i in imgs:
            acc.append("http://localhost:8000" + i.file.url)
        return acc
    
    def get_ingredients(self, obj):
        ingrs = obj.ingredients.all()
        acc = []
        
        for i in ingrs:
            bi = i.baseIngredient
            acc.append([bi.name, bi.unit, i.amount])

        return acc
    

    def get_prep_steps(self, obj):
        stps = obj.steps.all()
        acc = []

        for s in stps:
            print(s)
            if not s.type:
                s_files = s.stepFiles.all()
                file_acc = []
                for sf in s_files:
                    file_acc.append("http://localhost:8000" + sf.file.url)
                
                acc.append([
                    s.step_num,
                    s.hour,
                    s.min,
                    s.description,
                    file_acc
                ])
        return acc
    
    def get_cook_steps(self, obj):
        stps = obj.steps.all()
        acc = []

        for s in stps:
            print(s)
            if s.type:
                s_files = s.stepFiles.all()
                file_acc = []
                for sf in s_files:
                    file_acc.append("http://localhost:8000" + sf.file.url)
                
                acc.append([
                    s.step_num,
                    s.hour,
                    s.min,
                    s.description,
                    file_acc
                ])
        return acc
        