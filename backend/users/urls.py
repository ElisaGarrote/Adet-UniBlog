from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PasswordResetRequestView, PasswordResetConfirmView, MeView
router = DefaultRouter()
router.register("list", UserViewSet, basename="user-list") 

urlpatterns = [
    path("", include(router.urls)),
    path("password-reset/", PasswordResetRequestView.as_view(),
         name="password-reset-request"),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view(),
         name="password-reset-confirm"),
    path("me/", MeView.as_view(), name="user-me"),
]
