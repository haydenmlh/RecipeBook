from django.urls import path
from recipes.views import *

urlpatterns = [
    # Likes
    path('user/likes/', UserLikesView.as_view()),
    path('<int:id>/like/', UserRecipeLikeView.as_view()),
    path('<int:id>/likes/', RecipeGetNumLikesView.as_view()),
    # Favorites
    path('user/favorites/', UserFavoritesView.as_view()),
    path('<int:id>/favorite/', UserRecipeFavoriteView.as_view()),
    path('<int:id>/favorites/', RecipeGetNumFavoritesView.as_view()),

    # Ingredients
    path('baseIngredients/add/', AddBaseIngredientView.as_view()),
    path('baseIngredients/', GetBaseIngredientByNameView.as_view()),
    path('baseIngredients/getbyname/', GetBaseIngredientByNameView.as_view()), 


    # Cuisine, Diet
    path('cuisine/add/', AddCuisineView.as_view()),
    path('cuisine/all/', GetAllCuisineView.as_view()),
    path('diet/add/', AddDietView.as_view()),
    path('diet/all/', GetAllDietView.as_view()),
    # Recipes
    path('create/', CreateRecipeView.as_view()),
    path('details/<int:id>/', GetRecipeView.as_view()),
    path('long-details/<int:id>/', GetDetailedRecipeView.as_view()),
    path('delete/<int:id>/', DeleteRecipeView.as_view()),
    path('update/<int:pk>/', UpdateRecipeView.as_view()),
    path('getbyname/', GetRecipeByName.as_view()),
    # Shopping List
    path('shoppingList/<int:pk>/', ShoppingListView.as_view()),
    path('shoppingList/info/', ShoppingListInfoView.as_view()),
    path('api/', SearchRecipesByNameOrCreator.as_view()),
    path('api/cuisine/', FilterRecipesByCuisine.as_view()),
    path('api/diet/', FilterRecipesByDiets.as_view()),
    # Ratings
    path('user/ratings/', UserRatingsView.as_view()),
    path('<int:id>/rating/', UserRecipeRatingView.as_view()),
    path('<int:id>/ratings/', RecipeGetNumRatingsView.as_view()),
    # Comments
    path('user/comments/', UserCommentsView.as_view()),
    path('<int:id>/comment/', UserRecipeCommentCreateView.as_view()),
    path('comment/<int:id>/', UserRecipeCommentEditDeleteView.as_view()),
    path('<int:id>/comments/', RecipeGetAllCommentsView.as_view()),
    # Comment File
    path('commentFile/<int:id>/', UserRecipeCommentFileDeleteView.as_view()),
    #path('my-recipes/', MyRecipesView.as_view()),

    # Popular Recipes
    path('popular-recipes/', PopularRecipeCardView.as_view()),
    path("search/", SearchRecipesView.as_view()),
    # My Recipes
    path('my-recipes/', MyRecipeCardView.as_view()),
    path('my-fav-recipes/', MyFavRecipeCardView.as_view()),
    path('my-com-recipes/', MyCommentsRecipeCardView.as_view()),
    path('my-rate-recipes/', MyRatingsRecipeCardView.as_view()),

]
