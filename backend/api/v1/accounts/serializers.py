from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

from rest_framework import serializers

from apps.accounts.models import EmailOTP, TempUser, User, UserRole

from api.v1.accounts.services import AccountService, OTPService
from api.v1.accounts.utils import normalize_email


class SignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=[
            (User.Role.USER, User.Role.USER.label),
            (UserRole.VENUE_OWNER, "Venue Owner"),
        ],
        required=False,
        default=User.Role.USER,
    )

    def validate_email(self, value):
        email = normalize_email(value)

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("This email is already registered.")

        return email

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        return attrs

    def create(self, validated_data):
        email = validated_data["email"]

        temp_user, _ = TempUser.objects.update_or_create(
            email=email,
            defaults={
                "first_name": validated_data["first_name"],
                "last_name": validated_data.get("last_name", ""),
                "phone_number": validated_data.get("phone_number", ""),
                "password": make_password(validated_data["password"]),
                "wants_venue_owner": validated_data.get("role") == UserRole.VENUE_OWNER,
                "is_verified": False,
            },
        )

        OTPService.issue(email, EmailOTP.Purpose.SIGNUP)

        return temp_user


class VerifySignupOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate_email(self, value):
        return normalize_email(value)

    def validate(self, attrs):
        email = attrs["email"]
        otp = attrs["otp"]

        try:
            temp_user = TempUser.objects.get(email=email, is_verified=False)
        except TempUser.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Signup request not found. Please signup again."}
            )

        otp_obj = (
            EmailOTP.objects.filter(
                email=email,
                purpose=EmailOTP.Purpose.SIGNUP,
                is_verified=False,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_obj:
            raise serializers.ValidationError(
                {"otp": "OTP not found. Please request a new OTP."}
            )

        if otp_obj.is_expired():
            raise serializers.ValidationError(
                {"otp": "OTP expired. Please request a new OTP."}
            )

        if otp_obj.attempts >= 5:
            raise serializers.ValidationError(
                {"otp": "Too many wrong attempts. Please request a new OTP."}
            )

        if otp_obj.otp != otp:
            otp_obj.attempts += 1
            otp_obj.save(update_fields=["attempts"])

            raise serializers.ValidationError({"otp": "Invalid OTP."})

        attrs["temp_user"] = temp_user
        attrs["otp_obj"] = otp_obj

        return attrs

    def create(self, validated_data):
        return AccountService.activate_user(
            temp_user=validated_data["temp_user"],
            otp_obj=validated_data["otp_obj"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return normalize_email(value)

    def validate(self, attrs):
        email = attrs["email"]
        password = attrs["password"]

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password."}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Your account is inactive."}
            )

        if not user.is_email_verified:
            raise serializers.ValidationError(
                {"detail": "Please verify your email before login."}
            )

        attrs["user"] = user

        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = normalize_email(value)

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("No account found with this email.")

        return email

    def create(self, validated_data):
        return OTPService.issue(
            validated_data["email"], EmailOTP.Purpose.FORGOT_PASSWORD
        )


class VerifyForgotPasswordOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        otp_instance = EmailOTP.objects.filter(
            email=attrs["email"],
            otp=attrs["otp"],
            purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
            is_verified=False,
        ).first()

        if not otp_instance:
            raise serializers.ValidationError({"otp": "Invalid OTP."})

        if otp_instance.is_expired():
            raise serializers.ValidationError({"otp": "OTP expired."})

        attrs["otp_instance"] = otp_instance

        return attrs

    def create(self, validated_data):
        otp_instance = validated_data["otp_instance"]

        otp_instance.is_verified = True
        otp_instance.save(update_fields=["is_verified"])

        return otp_instance


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        otp_verified = (
            EmailOTP.objects.filter(
                email=attrs["email"],
                purpose=EmailOTP.Purpose.FORGOT_PASSWORD,
                is_verified=True,
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_verified:
            raise serializers.ValidationError(
                {"email": "OTP verification required."}
            )

        attrs["otp_verified"] = otp_verified

        return attrs

    def create(self, validated_data):
        return AccountService.reset_password(
            email=validated_data["email"],
            raw_password=validated_data["password"],
        )


class UserBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    roles = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "role",
            "is_venue_owner",
            "is_email_verified",
            "roles",
        ]
