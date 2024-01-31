from django.contrib.auth.models import User
from django.db import models
from django.db.models import SET_NULL
from django.utils.timezone import now


# Create your models here.

class Diet(models.Model):
    name = models.CharField(null=False, blank=False, max_length=100)


class Cuisine(models.Model):
    name = models.CharField(null=False, blank=False, max_length=100)


class Recipe(models.Model):
    base_recipe = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(null=False, blank=False, max_length=100)
    cuisine = models.ForeignKey(to=Cuisine, related_name='recipe', null=False,
                                blank=False, on_delete=models.CASCADE, default=1)
    total_prep_hour = models.PositiveIntegerField(null=True, blank=True)
    total_prep_min = models.PositiveIntegerField(null=False, blank=False)
    total_cook_hour = models.PositiveIntegerField(null=True, blank=True)
    total_cook_min = models.PositiveIntegerField(null=False, blank=False)
    user = models.ForeignKey(to=User, related_name='recipe', null=False,
                             blank=False, on_delete=models.CASCADE)
    diets = models.ManyToManyField(Diet)
    servings = models.PositiveIntegerField(null=False, blank=False, default=1)


class Step(models.Model):
    type = models.BooleanField(null=False, blank=False) # false means prep
    step_num = models.PositiveIntegerField(null=False, blank=False)
    hour = models.PositiveIntegerField(null=True, blank=True)
    min = models.PositiveIntegerField(null=False, blank=False)
    description = models.CharField(null=False, blank=False, max_length=500)
    recipe = models.ForeignKey(to=Recipe, related_name='steps', null=False,
                               blank=False, on_delete=models.CASCADE)


class BaseIngredient(models.Model):
    name = models.CharField(null=False, blank=False, max_length=100, unique=True)
    unit = models.CharField(null=False, blank=False, max_length=100)


class Ingredient(models.Model):
    baseIngredient = models.ForeignKey(to=BaseIngredient, related_name='bi_ingredients',
                                       null=False, blank=False, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(null=False, blank=False)
    # servings = models.PositiveIntegerField(null=False, blank=False)
    recipe = models.ForeignKey(to=Recipe, related_name='ingredients',
                               null=False,
                               blank=False, on_delete=models.CASCADE)




class Comment(models.Model):
    recipe = models.ForeignKey(to=Recipe, related_name='recipeComments',
                               on_delete=models.CASCADE, null=False,
                               blank=False)
    user = models.ForeignKey(to=User, related_name='userComments',
                             on_delete=models.CASCADE, null=False,
                             blank=False)
    datetime = models.DateTimeField(default=now, editable=False)
    text = models.CharField(max_length=500, null=False, blank=False)

    def __str__(self):
        return f"{self.pk} - {self.recipe.name} - {self.text}"


class Like(models.Model):
    recipe = models.ForeignKey(to=Recipe, related_name='recipeLikes',
                               on_delete=models.CASCADE, null=False,
                               blank=False)
    user = models.ForeignKey(to=User, related_name='userLikes',
                             on_delete=models.CASCADE, null=False,
                             blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['recipe', 'user'],
                                    name="unique_like")
        ]

class Favorite(models.Model):
    recipe = models.ForeignKey(to=Recipe, related_name='recipeFavorites',
                               on_delete=models.CASCADE, null=False,
                               blank=False)
    user = models.ForeignKey(to=User, related_name='userFavorites',
                             on_delete=models.CASCADE, null=False,
                             blank=False)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['recipe', 'user'],
                                    name="unique_favorite")
        ]

class Rating(models.Model):
    recipe = models.ForeignKey(to=Recipe, related_name='recipeRatings',
                               on_delete=models.CASCADE, null=False,
                               blank=False)
    user = models.ForeignKey(to=User, related_name='userRatings',
                             on_delete=models.CASCADE, null=False,
                             blank=False)
    stars = models.PositiveIntegerField(null=False, blank=False)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['recipe', 'user'],
                                    name="unique_rating")
        ]


class RecipeFile(models.Model):
    file = models.FileField(upload_to='files/recipe/')
    mainImage = models.BooleanField(null=True, blank=True)
    recipe = models.ForeignKey(to=Recipe, related_name='recipeFiles',
                               on_delete=models.CASCADE, null=False,
                               blank=False)


class StepFile(models.Model):
    file = models.FileField(upload_to='files/step/')
    step = models.ForeignKey(to=Step, related_name='stepFiles',
                             on_delete=models.CASCADE, null=False,
                             blank=False)


class CommentFile(models.Model):
    file = models.FileField(upload_to='files/comment/')
    comment = models.ForeignKey(to=Comment, related_name='commentFiles', on_delete=models.CASCADE, null=False,
                               blank=False)

class ShoppingListRecipe(models.Model):
    user = models.ForeignKey(to=User, related_name="userShoppingListRecipes",
                             on_delete=models.CASCADE, null=False,
                             blank=False)
    recipe = models.ForeignKey(to=Recipe,
                               related_name='recipeShoppingListRecipes',
                               on_delete=models.CASCADE, null=False,
                               blank=False)
    servingSize = models.PositiveIntegerField(null=False, blank=False)
