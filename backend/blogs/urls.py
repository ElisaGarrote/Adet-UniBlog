from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, TagViewSet

router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blogs')     # /blogs/
router.register(r'tags', TagViewSet, basename='tags')        # /tags/

urlpatterns = [
    path('', include(router.urls)),  # includes /blogs/ and /tags/
]
