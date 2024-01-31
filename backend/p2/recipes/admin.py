from django.contrib import admin
from recipes.models import *

# Register your models here.
admin.site.register(Cuisine)
admin.site.register(Recipe)
admin.site.register(Step)
admin.site.register(Ingredient)
admin.site.register(Diet)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Favorite)
admin.site.register(Rating)
admin.site.register(RecipeFile)
admin.site.register(StepFile)
admin.site.register(CommentFile)
admin.site.register(ShoppingListRecipe)
admin.site.register(BaseIngredient)
