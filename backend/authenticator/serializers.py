from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str,force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode 
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, min_length=8)
    profilepic = serializers.ImageField(required=False, allow_null=True)

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
            "profilepic",          
        ]
        extra_kwargs = {"password": {"write_only": True}}

    first_name   = serializers.CharField(
        required=False, default="Registered")
    last_name    = serializers.CharField(
        required=False, default="User")
    user_role = serializers.ChoiceField(
    choices=User.ROLE_CHOICES,
    required=False,
    default="reader"
)
    organization = serializers.CharField(
        required=False, allow_blank=True, allow_null=True, default="")
    department   = serializers.CharField(
        required=False, allow_blank=True, allow_null=True, default="")

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

 # for tokens
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Return tokens + a ‘user’ object so the frontend
    gets first_name, role, etc. right after login."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # You can also embed extra fields *inside* the token here:
        token["user_role"] = user.user_role
        token["user_id"] = user.id
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)           # tokens
        data["user"] = UserSerializer(self.user).data
        return data
    
# for resetpassword email request 
class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        try:
            email = attrs.get('email', '')
            if User.objects.filter(username=email).exists():  # <-- use username here
                user = User.objects.get(username=email)
                uid64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                # You can email here or handle in the view
            return attrs
        except Exception:
            pass
        return super().validate(attrs)


# for setting new password (from reset pass)
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=8, write_only=True
    )
    token   = serializers.CharField(write_only=True)
    uidb64  = serializers.CharField(write_only=True)

    def validate_password(self, value):
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Need at least 1 capital letter")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Need at least 1 number")
        if not re.search(r"[^\w\s]", value):
            raise serializers.ValidationError("Need at least 1 special character")
        return value

    def validate(self, attrs):
        try:
            uid     = force_str(urlsafe_base64_decode(attrs["uidb64"]))
            user    = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise AuthenticationFailed("Invalid link – user not found")

        token   = attrs["token"]
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise AuthenticationFailed("Invalid or expired token")

        user.set_password(attrs["password"])
        user.save()
        return user
    
    # for changing password
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_new_password(self, value):
        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Need at least 1 capital letter")
        if not re.search(r"\d", value):
            raise serializers.ValidationError("Need at least 1 number")
        if not re.search(r"[^\w\s]", value):
            raise serializers.ValidationError("Need at least 1 special character")
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({"old_password": "Incorrect old password"})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user