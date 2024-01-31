from django.urls import path
from .views import SignUpView, UpdateView, CustomTokenObtainPairView, ProfileAPI
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', SignUpView.as_view(), name="sign_up"),
    path('api/update/<int:pk>', UpdateView.as_view(), name="update_profile"),
    path('api/<int:pk>/profile', ProfileAPI.as_view(), name="update_profile"),
]
