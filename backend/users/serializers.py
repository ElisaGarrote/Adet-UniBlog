from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_bytes, smart_str, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    
    username = serializers.EmailField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True)
    profilepic = serializers.ImageField(required=False, allow_null=True)

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
            "profilepic",      
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

class PasswordResetRequestSerializer(serializers.Serializer):
    username = serializers.EmailField()        # username == email in your system

    def validate_username(self, value):
        # case‑insensitive lookup for safety
        if not CustomUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("No user with that email.")
        return value

    def save(self, **kwargs):
        user = CustomUser.objects.get(username__iexact=self.validated_data["username"])

        uidb64  = urlsafe_base64_encode(smart_bytes(user.pk))
        token   = PasswordResetTokenGenerator().make_token(user)

        reset_link = (
            f"{settings.FRONTEND_RESET_URL}?uid={uidb64}&token={token}"
            # e.g. http://localhost:5173/reset-password
        )

        send_mail(
            subject="Reset your UniBlog password",
            message=f"Hi {user.first_name or 'there'},\n\n"
                    f"Click the link below to choose a new password:\n\n{reset_link}\n\n"
                    "If you didn’t request this, you can ignore this email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )


class SetNewPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def validate_new_password(self, value):
        # reuse the same strong‑password checks you already have
        from authenticator.serializers import UserSerializer
        return UserSerializer().validate_password(value)

    def validate(self, attrs):
        try:
            uid = smart_str(urlsafe_base64_decode(attrs["uid"]))
            self.user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise serializers.ValidationError("Invalid link")

        if not PasswordResetTokenGenerator().check_token(self.user, attrs["token"]):
            raise serializers.ValidationError("Link expired or already used")
        return attrs

    def save(self, **kwargs):
        self.user.set_password(self.validated_data["new_password"])
        self.user.save()