from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CreateUserView,
    RequestPasswordResetEmail,
    PasswordTokenCheckAPI,
    SetNewPasswordAPIView,
    ChangePasswordView,
    CustomTokenObtainPairView,
)

urlpatterns = [
   
    path("register/", CreateUserView.as_view(), name="register"),   
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

        # Password‑reset flow
    path("password-reset/", RequestPasswordResetEmail.as_view(),
         name="request-password-reset"),
    path("password-reset/<uidb64>/<token>/",
         PasswordTokenCheckAPI.as_view(), name="password-reset-confirm"),
    path("password-reset/complete/",
         SetNewPasswordAPIView.as_view(), name="password-reset-complete"),

    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

]