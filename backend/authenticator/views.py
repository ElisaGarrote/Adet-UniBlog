from django.shortcuts import render
from django.contrib.auth import get_user_model 
from rest_framework import generics, status
from .serializers import UserSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import BasePermission

from django.utils.encoding import smart_str,force_str, smart_bytes, DjangoUnicodeDecodeError
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db.models import Q          # add

from rest_framework.views import APIView


User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class RequestPasswordResetEmail(generics.GenericAPIView):
    permission_classes = []
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()

        # look for the address in *either* username or email
        user_qs = User.objects.filter(Q(username=email) | Q(email=email))

        if user_qs.exists():
            user   = user_qs.first()
            uidb64 = urlsafe_base64_encode(smart_bytes(user.pk))
            token  = PasswordResetTokenGenerator().make_token(user)
            reset_link = f"{settings.FRONTEND_RESET_URL}?uid={uidb64}&token={token}"

            try:
                EmailMessage(
                    subject="UniBlog – reset your password",
                    body=(
                        f"Hello {user.first_name or 'there'},\n\n"
                        f"Click the link to set a new password:\n{reset_link}\n\n"
                        "If you didn’t request this, please ignore."
                    ),
                    to=[email],
                ).send(fail_silently=False)
            except Exception as e:
                # log the real error but DON’T expose it to the client
                print("EMAIL ERROR:", e)

        # Always return 200 to avoid user enumeration
        return Response(
            {"detail": "If the e‑mail exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )

class PasswordTokenCheckAPI(generics.GenericAPIView):
    permission_classes = []            # public

    def get(self, request, uidb64, token):
        try:
            uid  = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValueError()
        except Exception:
            return Response({"valid": False}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"valid": True}, status=status.HTTP_200_OK)


class SetNewPasswordAPIView(generics.GenericAPIView):
    permission_classes = []            # public
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK,
        )
    # for changing password
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)