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


urlpatterns = [
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("verify-signup-otp/", VerifySignupOTPAPIView.as_view(), name="verify_signup_otp"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("forgot-password/", ForgotPasswordAPIView.as_view()),
    path("verify-forgot-password-otp/", VerifyForgotPasswordOTPAPIView.as_view()),
    path("reset-password/", ResetPasswordAPIView.as_view()),
]
