from django.contrib import admin
from django.urls import path, include
from authenticator.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView ,TokenRefreshView


urlpatterns = [
        path("admin/", admin.site.urls),
    # JWT
    path("auth/", include("authenticator.urls")),
    # User CRUD
    path("users/", include("users.urls")),

]