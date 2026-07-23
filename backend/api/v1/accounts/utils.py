import random

from django.conf import settings

import resend
from rest_framework_simplejwt.tokens import RefreshToken


def generate_otp():
    return str(random.randint(100000, 999999))


def normalize_email(value):
    return value.lower().strip()


def send_otp_email(email, otp, purpose):
    subject_map = {
        "SIGNUP": "Verify your BookMyVenue account",
        "FORGOT_PASSWORD": "Reset your BookMyVenue password",
    }

    subject = subject_map.get(purpose, "Your BookMyVenue verification code")

    html_content = f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>BookMyVenue Verification Code</h2>
            <p>Hello,</p>
            <p>Your BookMyVenue verification code is:</p>
            <h1 style="letter-spacing: 4px;">{otp}</h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <br>
            <p>Regards,<br>BookMyVenue Team</p>
        </div>
    """

    text_content = (
        f"Hello,\n\n"
        f"Your BookMyVenue verification code is: {otp}\n\n"
        f"This code will expire in 10 minutes.\n\n"
        f"If you did not request this code, please ignore this email.\n\n"
        f"Regards,\n"
        f"BookMyVenue Team"
    )

    return resend.Emails.send(
        {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [email],
            "subject": subject,
            "html": html_content,
            "text": text_content,
        }
    )


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }