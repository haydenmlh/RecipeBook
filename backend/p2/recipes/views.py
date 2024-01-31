from django.shortcuts import render, get_object_or_404
from django.views import View
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from django.http import Http404, HttpResponse, JsonResponse
from accounts.models import Profile
from rest_framework import filters
from django.core.serializers import serialize
import json
from django.db.models import Avg, Count

from recipes.models import *
from recipes.serializers import *
from rest_framework.mixins import ListModelMixin
from rest_framework.generics import GenericAPIView

from recipes.permissions import IsObjectOwner
# Create your views here.


class ShoppingListView(CreateAPIView, DestroyAPIView, UpdateAPIView):
    queryset = ShoppingListRecipe.objects.all()
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        to_delete = self.get_object()
        logged_in = request.user
        owner = ShoppingListRecipe.objects.filter(pk=self.kwargs['pk']).first().user
        if owner != logged_in:
            return Response(data={'message': "Not allowed to delete record"})
        self.perform_destroy(to_delete)
        return Response(status=HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        logged_in = request.user
        owner = ShoppingListRecipe.objects.filter(pk=self.kwargs['pk']).first().user
        if owner != logged_in:
            return Response(data={'message': "Not allowed to update record"})
        return self.update(request, *args, **kwargs)


class ShoppingListInfoView(APIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logged_in = request.user
        shopping_list_recipes = ShoppingListRecipe.objects.filter(user=logged_in).all()
        all_ingredients = {}
        all_recipes = []
        all_shopping_list_objects = []
        for shopping_list_recipe in shopping_list_recipes:
            all_shopping_list_objects.append(ShoppingListSerializer(shopping_list_recipe).data)
            all_recipes.append(RecipeCardSerializer(shopping_list_recipe.recipe).data)
            ingredients_in_recipe = shopping_list_recipe.recipe.ingredients.all()
            for ingredient_in_recipe in ingredients_in_recipe:
                ingredient_name = ingredient_in_recipe.baseIngredient.name
                serving_in_recipe = shopping_list_recipe.recipe.servings
                serving_in_shopping_list = shopping_list_recipe.servingSize
                if ingredient_name in all_ingredients:
                    amount = all_ingredients[ingredient_name]["amount"] + ((ingredient_in_recipe.amount / serving_in_recipe) *
                                                       serving_in_shopping_list)
                    unit = ingredient_in_recipe.baseIngredient.unit
                    all_ingredients[ingredient_name] = {"amount": amount, "unit": unit}
                else:
                    amount = ((ingredient_in_recipe.amount / serving_in_recipe) * serving_in_shopping_list)
                    unit = ingredient_in_recipe.baseIngredient.unit
                    all_ingredients[ingredient_name] = {"amount": amount, "unit": unit}

        ingredients = []
        for key,value in all_ingredients.items():
            ingredients.append([key, value['amount'], value['unit']])

        response = {
            "shopping_list_objects": all_shopping_list_objects,
            "recipes": all_recipes, 
            "shopping_list": ingredients
        }
        return JsonResponse(response)


class SearchRecipesByNameOrCreator(ListAPIView):
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    paginate_by = 100
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'user__username', 'user__first_name', 'user__last_name']


class FilterRecipesByCuisine(ListAPIView):
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    paginate_by = 100
    filter_backends = [filters.SearchFilter]
    search_fields = ['=cuisine__name']


class FilterRecipesByDiets(ListAPIView):
    queryset = Recipe.objects.all().order_by()
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    paginate_by = 100
    filter_backends = [filters.SearchFilter]
    search_fields = ['=diets__name']


class FilterRecipesByCookingTime(ListAPIView):
    queryset = Recipe.objects.all().order_by()
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    paginate_by = 100
    filter_backends = [filters.SearchFilter]
    search_fields = ['=diets__name']


class AddBaseIngredientView(CreateAPIView):
    serializer_class = BaseIngredientSerializer


class GetBaseIngredientByNameView(ListAPIView):
    serializer_class = BaseIngredientSerializer
    def get_queryset(self):
        name = self.request.query_params['name'].lower()
        ingredients = BaseIngredient.objects.filter(name__startswith=name)
        return ingredients


class AddCuisineView(CreateAPIView):    #remove later
    serializer_class = CuisineSerializer


class AddDietView(CreateAPIView):    #remove later
    serializer_class = DietSerializer


class GetAllCuisineView(ListAPIView):
    serializer_class = CuisineSerializer

    def get_queryset(self):
        # print(self.request.user.id)
        # return Profile.objects.all()
        return Cuisine.objects.all()


class GetAllDietView(ListAPIView):
    serializer_class = DietSerializer

    def get_queryset(self):
        return Diet.objects.all()


class CreateRecipeView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer


class GetRecipeView(RetrieveAPIView):
    serializer_class = RecipeSerializer

    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['id'])


class GetRecipeByName(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        name = self.request.query_params['name']
        return Recipe.objects.filter(name__startswith=name)


class DeleteRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        rid = self.kwargs['id']
        recipe = Recipe.objects.filter(id=rid)
        recipe.delete()
        return HttpResponse(status=204)


class UpdateRecipeView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()


# View to get currently logged in user's liked recipes
class UserLikesView(ListAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            cur_user = self.request.user
            print(cur_user.id)
            likes = cur_user.userLikes.all()
            return likes
        except Like.DoesNotExist:
            raise Http404("No Likes by current user.")


class UserRecipeLikeView(CreateAPIView, RetrieveAPIView, DestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated, IsObjectOwner]

    def get_object(self):
        try:
            cur_recipe = Recipe.objects.get(pk=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist")
        return get_object_or_404(Like, recipe=cur_recipe, user=self.request.user)

    def perform_create(self, serializer):
        try:
            cur_recipe = Recipe.objects.get(pk=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist")
        try:
            Recipe.objects.get(user=self.request.user, recipe=cur_recipe)
            raise Http404("Liked already")
        except Recipe.DoesNotExist:
            serializer.save(user=self.request.user, recipe=cur_recipe)



class RecipeGetNumLikesView(APIView):

    def get(self, request, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(pk=kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe has no likes.")

        num_likes = len(recipe.recipeLikes.all())
        return JsonResponse({"num_likes": num_likes})


# Favorites related views

# View to get currently logged in user's favorited recipes
class UserFavoritesView(ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            cur_user = self.request.user
            favorites = cur_user.userFavorites.all()
            return favorites
        except Favorite.DoesNotExist:
            raise Http404("No Favorites by current user.")

# Create/Retrieve/Delete a Favorite

class UserRecipeFavoriteView(CreateAPIView, RetrieveAPIView, DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            cur_recipe = Recipe.objects.get(pk=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist")
        return get_object_or_404(Favorite, recipe=cur_recipe, user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Get number of Favorites for a recipe

class RecipeGetNumFavoritesView(APIView):

    def get(self, request, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(pk=kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe has no favorites.")

        num_favorites = len(recipe.recipeFavorites.all())
        return JsonResponse({"num_favorites": num_favorites})


# Rating related views

# View to get currently logged in user's rated recipes
class UserRatingsView(ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            cur_user = self.request.user
            ratings = cur_user.userRatings.all()
            return ratings
        except Rating.DoesNotExist:
            raise Http404("No Ratings by current user.")

# Create/Retrieve/Delete a Rating

class UserRecipeRatingView(CreateAPIView, UpdateAPIView, RetrieveAPIView, DestroyAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated, IsObjectOwner]

    def get_object(self):
        try:
            cur_recipe = Recipe.objects.get(pk=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist")
        return get_object_or_404(Rating, recipe=cur_recipe, user=self.request.user)
    

# Get number of Ratings for a recipe

class RecipeGetNumRatingsView(APIView):

    def get(self, request, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(pk=kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe has no Ratings.")
        all_ratings = recipe.recipeRatings.all()
        num_ratings = len(all_ratings)
        total_stars = 0
        for rating in all_ratings:
            total_stars += rating.stars
        return JsonResponse({"num_Ratings": num_ratings, "average_rating": total_stars/num_ratings})

        num_likes = len(recipe.recipeFavorites.all())
        return JsonResponse({"num_likes": num_likes})




## Comment related views

# Create Comment
# Edit Comment
# Delete Comment

class UserRecipeCommentCreateView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"id": self.kwargs['id'], 'request': self.request}

    def get_object(self):
        try:
            cur_recipe = Recipe.objects.get(pk=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist")
        return get_object_or_404(Comment, recipe=cur_recipe, user=self.request.user)

class UserRecipeCommentEditDeleteView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"id": self.kwargs['id'], 'request': self.request}

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs['id'])


# Get all comments for currently logged in user
class UserCommentsView(ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            cur_user = self.request.user
            return cur_user.userComments.all()
        except Comment.DoesNotExist:
            raise Http404("No Comments by current user.")


# Get all comments for a recipe
class RecipeGetAllCommentsView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(id=self.kwargs['id'])
        except Recipe.DoesNotExist:
            raise Http404("This recipe does not exist.")
        return recipe.recipeComments.all()



#Delete Comment Photo
class UserRecipeCommentFileDeleteView(DestroyAPIView):
    serializer_class = CommentFileSerializer

    def get_object(self):
        return get_object_or_404(CommentFile, id=self.kwargs['id'])


# class CreatedRecipesView(ListAPIView):
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self, *args, **kwargs):
#         cur = self.request.user
#         return cur.recipes.all()

# class FavoritedRecipesView(ListAPIView):
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self, *args, **kwargs):
#         cur = self.request.user
#         favorites = cur.userFavorites
#         fav_recipes = []
#         for fav in favorites:
#             fav.recipes.append(fav.recipe)
#         return fav_recipes

# class InteractedRecipesView(ListAPIView):


class MyRecipesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        cur_user = self.request.user
        recipes_created_qset = cur_user.recipe.all()
        recipes_created = []
        for recipe in recipes_created_qset:
            recipes_created.append(RecipeSerializer(recipe).data)


        favorites = cur_user.userFavorites.all()
        recipes_favorited = []
        for fav in favorites:
            recipes_favorited.append(RecipeSerializer(fav.recipe).data)


        ratings = cur_user.userRatings.all()
        recipes_rated = []
        for rating in ratings:
            recipes_rated.append(RecipeSerializer(rating.recipe).data)


        comments = cur_user.userComments.all()
        recipes_commented = []
        for comment in comments:
            recipes_commented.append(RecipeSerializer(comment.recipe).data)

        recipes_interacted = recipes_created + recipes_favorited + recipes_rated + recipes_commented


        return Response({'recipes_created': recipes_created, 'recipes_favorited': recipes_favorited, 'recipes_interacted': recipes_interacted})


class PopularRecipeCardView(ListAPIView):
    serializer_class = RecipeCardSerializer

    def get_queryset(self, *args, **kwargs):
        r = Recipe.objects.annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        return r.order_by("-avg_rating", "-likes")

class MyRecipeCardView(ListAPIView):
    serializer_class = RecipeCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        logged_in = self.request.user
        recipes = Recipe.objects.filter(user=logged_in).annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        return recipes.order_by("-avg_rating", "-likes")

class MyFavRecipeCardView(ListAPIView):
    serializer_class = RecipeCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        logged_in = self.request.user
        favorites = logged_in.userLikes.all()
        recipes = Recipe.objects.filter(id__in=favorites).all().annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        return recipes.order_by("-avg_rating", "-likes")

class MyCommentsRecipeCardView(ListAPIView):
    serializer_class = RecipeCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        logged_in = self.request.user
        comments = logged_in.userComments.all()
        recipes = Recipe.objects.filter(id__in=comments).all().annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        return recipes.order_by("-avg_rating", "-likes") 
    
class MyRatingsRecipeCardView(ListAPIView):
    serializer_class = RecipeCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, *args, **kwargs):
        logged_in = self.request.user
        ratings = logged_in.userRatings.all()
        recipes = Recipe.objects.filter(id__in=ratings).all().annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        return recipes.order_by("-avg_rating", "-likes") 

class GetDetailedRecipeView(RetrieveAPIView):
    serializer_class = RecipeDetailedSerializer

    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['id'])
    

class SearchRecipesView(ListAPIView):
    serializer_class = RecipeCardSerializer

    def get_queryset(self, *args, **kwargs):
        print(self.kwargs)
        r = Recipe.objects.annotate(avg_rating=Avg("recipeRatings__stars"), likes=Count("recipeLikes"))
        if q := self.request.query_params.get("query"):
            r = r.filter(name=q)
        return r.order_by("-avg_rating", "-likes")