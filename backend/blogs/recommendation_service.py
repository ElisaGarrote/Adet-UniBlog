import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from collections import Counter
from django.db.models import Count, Q
from .models import Blog, ReadingHistory, SavedBlog, BlogView

def get_recommendations(user_id, limit=10):
    """
    Get AI-powered recommendations based on user's reading history and tags
    Uses scikit-learn and scipy for tag-based similarity
    """
    try:
        print(f"Getting recommendations for user {user_id}")
        
        # Get user's reading history, saved blogs, and viewed blogs
        user_reads = ReadingHistory.objects.filter(user_id=user_id).select_related('blog')
        user_saves = SavedBlog.objects.filter(user_id=user_id).select_related('blog')
        user_views = BlogView.objects.filter(user_id=user_id).select_related('blog')
        
        read_blog_ids = set(user_reads.values_list('blog_id', flat=True))
        saved_blog_ids = set(user_saves.values_list('blog_id', flat=True))
        viewed_blog_ids = set(user_views.values_list('blog_id', flat=True))
        interacted_blog_ids = read_blog_ids.union(saved_blog_ids).union(viewed_blog_ids)
        
        print(f"User has interacted with {len(interacted_blog_ids)} blogs")
        
        if not interacted_blog_ids:
            # No reading history - return popular blogs
            return get_popular_blogs(limit)
        
        # Get all blogs the user has interacted with
        user_blogs = Blog.objects.filter(
            id__in=interacted_blog_ids,
            is_draft=False
        ).prefetch_related('tags')
        
        # Extract tags from user's reading history
        user_tags = []
        for blog in user_blogs:
            blog_tags = [tag.name.lower() for tag in blog.tags.all()]
            user_tags.extend(blog_tags)
        
        if not user_tags:
            return get_popular_blogs(limit)
        
        # Count tag frequencies to build user preference profile
        tag_frequencies = Counter(user_tags)
        user_preferred_tags = set(tag_frequencies.keys())
        
        print(f"User's preferred tags: {list(user_preferred_tags)[:10]}")  # Show first 10
        
        # Get all available blogs (excluding ones user has already interacted with)
        candidate_blogs = Blog.objects.filter(
            is_draft=False
        ).exclude(
            id__in=interacted_blog_ids
        ).prefetch_related('tags')
        
        if not candidate_blogs.exists():
            return Blog.objects.none()
        
        # Use scikit-learn for tag-based similarity
        return calculate_tag_similarity(
            user_preferred_tags, 
            tag_frequencies, 
            candidate_blogs, 
            limit
        )
        
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return get_popular_blogs(limit)

def calculate_tag_similarity(user_tags, tag_frequencies, candidate_blogs, limit):
    """
    Calculate similarity using TF-IDF and cosine similarity from scikit-learn
    """
    try:
        # Prepare blog data and create tag vectors
        blog_data = []
        blog_objects = []
        
        for blog in candidate_blogs:
            blog_tags = [tag.name.lower() for tag in blog.tags.all()]
            if blog_tags:  # Only include blogs with tags
                # Create tag string for TF-IDF
                tag_string = ' '.join(blog_tags)
                blog_data.append(tag_string)
                blog_objects.append(blog)
        
        if not blog_data:
            return get_popular_blogs(limit)
        
        # Create user profile tag string (weighted by frequency)
        user_tag_string = ' '.join([
            ' '.join([tag] * min(freq, 5))  # Limit repetition to avoid over-weighting
            for tag, freq in tag_frequencies.items()
        ])
        
        # Add user profile to the corpus
        all_documents = [user_tag_string] + blog_data
        
        # Create TF-IDF vectors using scikit-learn
        vectorizer = TfidfVectorizer(
            lowercase=True,
            token_pattern=r'\b\w+\b',
            min_df=1,
            max_df=0.95
        )
        
        tfidf_matrix = vectorizer.fit_transform(all_documents)
        user_vector = tfidf_matrix[0]  # First document is user profile
        blog_vectors = tfidf_matrix[1:]  # Rest are blog vectors
        
        # Calculate cosine similarity using scikit-learn
        similarities = cosine_similarity(user_vector, blog_vectors).flatten()
        
        # Create blog-similarity pairs and sort by similarity
        blog_similarities = list(zip(blog_objects, similarities))
        blog_similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Filter out blogs with very low similarity (threshold)
        min_similarity = 0.01
        relevant_blogs = [
            blog for blog, sim in blog_similarities 
            if sim > min_similarity
        ]
        
        print(f"Found {len(relevant_blogs)} relevant blogs based on tag similarity")
        
        # Return top recommendations
        return Blog.objects.filter(
            id__in=[blog.id for blog in relevant_blogs[:limit]]
        ).prefetch_related('tags', 'author')
        
    except Exception as e:
        print(f"Error in calculate_tag_similarity: {e}")
        return get_popular_blogs(limit)

def get_popular_blogs(limit=10):
    """
    Fallback: Get popular blogs (most viewed) for new users
    """
    try:
        return Blog.objects.filter(
            is_draft=False
        ).order_by('-views_count', '-created_at').prefetch_related('tags', 'author')[:limit]
    except Exception as e:
        print(f"Error in get_popular_blogs: {e}")
        return Blog.objects.none()
