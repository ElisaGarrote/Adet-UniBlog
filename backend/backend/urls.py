from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
        path("admin/", admin.site.urls),
    # JWT
    path("auth/", include("authenticator.urls")),
    # User CRUD
    path("users/", include("users.urls")),
    path('blogs/', include('blogs.urls')),
    


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)