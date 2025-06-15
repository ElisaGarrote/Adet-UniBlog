from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    
    username = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True)



    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "created_at",
            "user_role",
            "organization",   
            "department",     
        ]
        read_only_fields = ["id","user_role","created_at"]

    # hash password on create / update
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
