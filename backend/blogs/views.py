from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Blog, Tag, SavedBlog, ReportedBlog, BlogView, ReadingHistory
from .serializers import BlogSerializer, TagSerializer, SavedBlogSerializer, ReportedBlogSerializer, BlogViewSerializer, ReadingHistorySerializer

class BlogViewSet(viewsets.ModelViewSet):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Blog.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_client_ip(self, request):
        """Get the client's IP address from the request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, pk=None):
        """Increment view count for a blog, ensuring unique views per user/IP"""
        try:
            blog = self.get_object()
            user = request.user if request.user.is_authenticated else None
            ip_address = self.get_client_ip(request)
            
            with transaction.atomic():
                # Check if this user/IP has already viewed this blog
                if user:
                    # For authenticated users, check by user
                    view_exists = BlogView.objects.filter(user=user, blog=blog).exists()
                else:
                    # For anonymous users, check by IP address
                    view_exists = BlogView.objects.filter(ip_address=ip_address, blog=blog, user__isnull=True).exists()
                
                if not view_exists:
                    # Create a new view record
                    BlogView.objects.create(
                        user=user,
                        blog=blog,
                        ip_address=ip_address
                    )
                    
                    # Increment the blog's view count
                    blog.views_count += 1
                    blog.save(update_fields=['views_count'])
                    
                    # For authenticated readers, also create reading history
                    if user and hasattr(user, 'role') and user.role == 'reader':
                        ReadingHistory.objects.get_or_create(user=user, blog=blog)
                    
                    return Response({
                        'message': 'View count incremented',
                        'views_count': blog.views_count
                    })
                else:
                    return Response({
                        'message': 'View already counted for this user/IP',
                        'views_count': blog.views_count
                    })
                    
        except Exception as e:
            return Response(
                {'error': f'Failed to increment view count: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def recommendations(self, request):
        """Get blog recommendations based on user's reading history"""
        from .recommendation_service import get_recommendations
        
        try:
            user_id = request.user.id
            recommendations = get_recommendations(user_id)
            serializer = self.get_serializer(recommendations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Failed to get recommendations: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TagViewSet(
    mixins.ListModelMixin,     # GET /tags/
    mixins.RetrieveModelMixin, # GET /tags/<id>/
    mixins.CreateModelMixin,   # POST /tags/
    mixins.UpdateModelMixin,   # PUT/PATCH
    mixins.DestroyModelMixin,  # DELETE
    viewsets.GenericViewSet
):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]             # ✅ Anyone can read
        return [permissions.IsAdminUser()]

class SavedBlogViewSet(viewsets.ModelViewSet):
    serializer_class = SavedBlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedBlog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if blog is already saved by this user
        blog_id = serializer.validated_data['blog'].id
        if SavedBlog.objects.filter(user=self.request.user, blog_id=blog_id).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You have already saved this blog.")
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_by_blog(self, request):
        """Remove a saved blog by blog ID"""
        blog_id = request.data.get('blog')
        if not blog_id:
            return Response({'error': 'Blog ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            saved_blog = SavedBlog.objects.get(user=request.user, blog_id=blog_id)
            saved_blog.delete()
            return Response({'message': 'Blog removed from saved list'}, status=status.HTTP_204_NO_CONTENT)
        except SavedBlog.DoesNotExist:
            return Response({'error': 'Saved blog not found'}, status=status.HTTP_404_NOT_FOUND)

class ReportedBlogViewSet(viewsets.ModelViewSet):
    serializer_class = ReportedBlogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin can see all reported blogs, users can see only their own reports
        if self.request.user.is_staff:
            return ReportedBlog.objects.all()
        return ReportedBlog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
