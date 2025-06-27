from rest_framework import serializers
from .models import Blog, Tag, SavedBlog, ReportedBlog

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, write_only=True, required=False)
    
    # Frontend expects these field names
    title = serializers.CharField(source='blog_title')
    image = serializers.ImageField(source='blog_img')
    viewCount = serializers.IntegerField(source='views_count', read_only=True)
    saveCount = serializers.SerializerMethodField(source='get_saves_count')
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = ['id', 'author', 'title', 'image', 'blog_desc', 'tags', 'tag_ids', 'is_draft', 'viewCount', 'saveCount', 'updatedAt', 'status', 'created_at']

    def get_saveCount(self, obj):
        return obj.savedblog_set.count()
    
    def get_status(self, obj):
        return 'draft' if obj.is_draft else 'published' 

    def create(self, validated_data):
        tags = validated_data.pop('tag_ids', [])
        blog = Blog.objects.create(**validated_data)
        blog.tags.set(tags)
        return blog

    def update(self, instance, validated_data):
        tags = validated_data.pop('tag_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if tags is not None:
            instance.tags.set(tags)
        instance.save()
        return instance

class SavedBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedBlog
        fields = ['id', 'user', 'blog', 'saved_at']
        read_only_fields = ['saved_at', 'user']  # Make user read-only since it's set in the view

class ReportedBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportedBlog
        fields = ['id', 'user', 'blog', 'reason', 'reported_at']
        read_only_fields = ['reported_at']
