from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import re
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "username",        
            "password",
            "first_name",
            "last_name",
            "user_role",      
            "organization",    
            "department",     
        ]
        extra_kwargs = {"password": {"write_only": True}}



    def validate_password(self, value):
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("need at least 1 capital letter")
        if not re.search(r"\d", value):
                 raise serializers.ValidationError("need at least 1 number")
        if not re.search(r"[^\w\s]", value):
            raise serializers.ValidationError("need at least 1 special character")
        return value


    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

