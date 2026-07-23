from django.contrib.auth.hashers import make_password

from apps.accounts.models import EmailOTP, User
from apps.accounts.tasks import send_otp_email_task

from api.v1.accounts.utils import generate_otp


class OTPService:
    """Issues one-time-passcodes and dispatches the delivery email."""

    @staticmethod
    def issue(email, purpose):
        EmailOTP.objects.filter(
            email=email,
            purpose=purpose,
            is_verified=False,
        ).delete()

        otp = EmailOTP.objects.create(
            email=email,
            otp=generate_otp(),
            purpose=purpose,
            expires_at=EmailOTP.default_expiry(),
        )

        send_otp_email_task.delay(
            email=email,
            otp=otp.otp,
            purpose=purpose,
        )

        return otp


class AccountService:
    """Account mutations triggered by a verified OTP."""

    @staticmethod
    def activate_user(temp_user, otp_obj):
        user = User.objects.create_user(
            email=temp_user.email,
            password=None,
            first_name=temp_user.first_name,
            last_name=temp_user.last_name,
            phone_number=temp_user.phone_number,
            role=User.Role.USER,
            is_venue_owner=temp_user.wants_venue_owner,
            is_email_verified=True,
            is_active=True,
        )

        user.password = temp_user.password
        user.save(update_fields=["password"])

        otp_obj.is_verified = True
        otp_obj.save(update_fields=["is_verified"])

        temp_user.is_verified = True
        temp_user.save(update_fields=["is_verified"])

        EmailOTP.objects.filter(
            email=user.email,
            purpose=EmailOTP.Purpose.SIGNUP,
        ).exclude(id=otp_obj.id).delete()

        return user

    @staticmethod
    def reset_password(email, raw_password):
        user = User.objects.get(email=email)
        user.password = make_password(raw_password)
        user.save(update_fields=["password"])

        EmailOTP.objects.filter(
            email=email,
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
        ).delete()

        return user
