from django.shortcuts import render

from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer
from .permissions import IsAdminOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by("-created_at")
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]
