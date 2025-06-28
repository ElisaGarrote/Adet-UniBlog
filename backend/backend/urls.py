from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .media_views import serve_media

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Backend is running"})

def debug_media(request):
    import os
    media_files = []
    media_root = settings.MEDIA_ROOT
    
    try:
        for root, dirs, files in os.walk(media_root):
            for file in files:
                rel_path = os.path.relpath(os.path.join(root, file), media_root)
                media_files.append(rel_path)
    except Exception as e:
        media_files = [f"Error: {str(e)}"]
    
    return JsonResponse({
        "media_root": str(media_root),
        "media_files": media_files,
        "media_url": settings.MEDIA_URL
    })

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
    path("debug/media/", debug_media, name="debug_media"),
    path("admin/", admin.site.urls),
    # JWT
    path("auth/", include("authenticator.urls")),
    # User CRUD
    path("users/", include("users.urls")),
    path('blogs/', include('blogs.urls')),
    
    # Media files serving for production
    re_path(r'^media/(?P<path>.*)$', serve_media, name='media'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)