from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, TagViewSet, SavedBlogViewSet, ReportedBlogViewSet

router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blogs')           # /blogs/
router.register(r'tags', TagViewSet, basename='tags')              # /tags/
router.register(r'saved-blogs', SavedBlogViewSet, basename='saved-blogs')  # /saved-blogs/
router.register(r'reported-blogs', ReportedBlogViewSet, basename='reported-blogs')  # /reported-blogs/

urlpatterns = [
    path('', include(router.urls)),  # includes /blogs/ and /tags/
]
