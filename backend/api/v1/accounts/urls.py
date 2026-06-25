from django.urls import path

from api.v1.accounts.views import (
    CurrentUserView,
    ForgotPasswordAPIView,
    LoginAPIView,
    ResetPasswordAPIView,
    SignupAPIView,
    VerifyForgotPasswordOTPAPIView,
    VerifySignupOTPAPIView,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("verify-signup-otp/", VerifySignupOTPAPIView.as_view(), name="verify_signup_otp"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("forgot-password/", ForgotPasswordAPIView.as_view()),
    path("verify-forgot-password-otp/", VerifyForgotPasswordOTPAPIView.as_view()),
    path("reset-password/", ResetPasswordAPIView.as_view()),
]
