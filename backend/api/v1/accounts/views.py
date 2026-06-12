from apps.accounts.models import EmailOTP, User
from apps.accounts.tasks import send_otp_email_task
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password

from api.v1.accounts.serializers import (
    CurrentUserSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    ResetPasswordSerializer,
    SignupSerializer,
    UserBasicSerializer,
    VerifyForgotPasswordOTPSerializer,
    VerifySignupOTPSerializer,
)
from api.v1.accounts.utils import generate_otp, get_tokens_for_user


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Signup started successfully. Please verify OTP sent to your email."
            },
            status=status.HTTP_201_CREATED,
        )


class VerifySignupOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifySignupOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = get_tokens_for_user(user)
        # user_data = UserBasicSerializer(user).data

        return Response(
            {
                "message": "Email verified successfully.",
                # "user": user_data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )
    

class ForgotPasswordAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]

        EmailOTP.objects.filter(
            email=email,
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
            is_verified=False,
        ).delete()

        otp = generate_otp()

        EmailOTP.objects.create(
            email=email,
            otp=otp,
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
            expires_at=EmailOTP.default_expiry(),
        )

        send_otp_email_task.delay(
            email=email,
            otp=otp,
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
        )

        return Response(
            {
                "message":
                "Password reset OTP sent successfully."
            },
            status=status.HTTP_200_OK,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)
        # user_data = UserBasicSerializer(user).data

        return Response(
            {
                "message": "Login successful.",
                # "user": user_data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )
    

class VerifyForgotPasswordOTPAPIView(
    APIView
):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = (
            VerifyForgotPasswordOTPSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        otp_instance = (
            serializer.validated_data[
                "otp_instance"
            ]
        )

        otp_instance.is_verified = True

        otp_instance.save(
            update_fields=[
                "is_verified"
            ]
        )

        return Response(
            {
                "message":
                "OTP verified successfully."
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordAPIView(
    APIView
):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data[
            "email"
        ]

        user = User.objects.get(
            email=email
        )

        user.password = make_password(
            serializer.validated_data[
                "password"
            ]
        )

        user.save(
            update_fields=[
                "password"
            ]
        )

        EmailOTP.objects.filter(
            email=email,
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
        ).delete()

        return Response(
            {
                "message":
                "Password reset successful."
            },
            status=status.HTTP_200_OK,
        )
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,):
        serializer = (CurrentUserSerializer(request.user))

        return Response(
            serializer.data
        )