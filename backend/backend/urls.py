from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Backend is running"})

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'message': 'Welcome to UniBlog API',
        'status': 'running',
        'debug': settings.DEBUG,
        'endpoints': {
            'admin': request.build_absolute_uri('/admin/'),
            'health': request.build_absolute_uri('/health/'),
            'auth': {
                'register': request.build_absolute_uri('/auth/register/'),
                'login': request.build_absolute_uri('/auth/token/'),
                'refresh': request.build_absolute_uri('/auth/token/refresh/'),
            },
            'users': {
                'list': request.build_absolute_uri('/users/list/'),
                'me': request.build_absolute_uri('/users/me/'),
            },
            'blogs': {
                'list': request.build_absolute_uri('/blogs/blogs/'),
                'tags': request.build_absolute_uri('/blogs/tags/'),
                'saved': request.build_absolute_uri('/blogs/saved-blogs/'),
                'recommendations': request.build_absolute_uri('/blogs/blogs/recommendations/'),
            },
        }
    })

urlpatterns = [
    path("", api_root, name="api_root"),
    path("health/", health_check, name="health_check"),
    path("admin/", admin.site.urls),
    # JWT
    path("auth/", include("authenticator.urls")),
    # User CRUD
    path("users/", include("users.urls")),
    path('blogs/', include('blogs.urls')),
]

# Serve media files in both development and production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # For production, also serve media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)