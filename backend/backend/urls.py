from django.contrib import admin
from django.urls import path, include
from authenticator.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView ,TokenRefreshView



#urlpatterns = [
#    path('admin/', admin.site.urls),
#    path("authenticator/user/register/", CreateUserView.as_view(), name = "register"),
#    path("authenticator/token/", TokenObtainPairView.as_view(), name = " get_token"),
#    path("authenticator/token/refresh/", TokenRefreshView.as_view(), name = "refresh"),
#]

urlpatterns = [
        path("admin/", admin.site.urls),
    # JWT
    path("auth/", include("authenticator.urls")),
    # User CRUD
    path("users/", include("users.urls")),

]