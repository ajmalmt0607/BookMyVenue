from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from apps.common.functions import generate_slug
from apps.common.models import BaseModel


class VenueType(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        db_table = "venues_venue_type"
        ordering = ["-created_at"]
        verbose_name = "Venue Type"
        verbose_name_plural = "Venue Types"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class Amenity(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venues_amenity"
        ordering = ["-created_at"]
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name
    

class Venue(BaseModel):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    EDITABLE_STATUSES = [Status.DRAFT, Status.REJECTED]
    
    OWNER_EDITABLE_STATUSES = [
        Status.DRAFT,
        Status.PENDING,
        Status.APPROVED,
        Status.REJECTED,
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="venues")
    venue_type = models.ForeignKey(
        VenueType, on_delete=models.PROTECT, related_name="venues", null=True, blank=True
    )
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="venues")
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    # Manual Address
    venue_address = models.TextField(blank=True)
    location_name = models.CharField(max_length=255, db_index=True, blank=True)
    city = models.CharField(max_length=100, db_index=True, blank=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default="India")
    # From Google/OpenStreetMap
    location_address = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True)
    min_capacity = models.PositiveIntegerField(blank=True, null=True)
    max_capacity = models.PositiveIntegerField(blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, blank=True)
    amenities_completed = models.BooleanField(default=False)
    policies_completed = models.BooleanField(default=False)

    class Meta:
        db_table = "venues_venue"
        indexes = [
            models.Index(fields=["city"]),
            models.Index(fields=["location_name"]),
            models.Index(fields=["status"]),
            models.Index(fields=["price_per_day"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_slug(self.name or "venue")

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name or f"Draft venue ({self.id})"


class VenueImage(BaseModel):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="venues/images/")
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "venues_venue_image"
        ordering = ["-created_at"]
        verbose_name = "venues_venue_image"
        verbose_name_plural = "venues_venue_images"

    def __str__(self):
        return f"{self.venue.name} Image"
    

class VenueTimeSlot(BaseModel):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="time_slots")
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    max_guests = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venues_time_slot"
        ordering = ["start_time"]
        verbose_name = "Venue Time Slot"
        verbose_name_plural = "Venue Time Slots"

    def __str__(self):
        return f"{self.venue.name} - {self.name}"
    

class Booking(BaseModel):
    class Status(models.TextChoices):
        RESERVED = "RESERVED", "Reserved"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"

    ACTIVE_HOLD_STATUSES = [Status.RESERVED, Status.CONFIRMED]

    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="bookings")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    full_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    alternate_phone_number = models.CharField(max_length=20, blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    arrival_notes = models.TextField(blank=True, null=True)
    event_notes = models.TextField(blank=True, null=True)
    guest_count = models.PositiveIntegerField(default=1)
    booking_date = models.DateField()
    venue_amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RESERVED)
    notes = models.TextField(blank=True, null=True)
    reserved_until = models.DateTimeField(blank=True, null=True)
    terms_accepted_at = models.DateTimeField(blank=True, null=True)
    payment_started_at = models.DateTimeField(blank=True, null=True)
    payment_completed_at = models.DateTimeField(blank=True, null=True)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        db_table = "venues_bookings"
        ordering = ["-created_at"]
        verbose_name = "Venue Booking"
        verbose_name_plural = "Venue Bookings"

        indexes = [
            models.Index(fields=["booking_date"]),
            models.Index(fields=["status", "reserved_until"]),
        ]

    def __str__(self):
        return (
            f"{self.customer.email} - "
            f"{self.venue.name} - "
            f"{self.booking_date}"
        )


class BookingSlot(BaseModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="slots")
    slot = models.ForeignKey(VenueTimeSlot, on_delete=models.PROTECT, related_name="booking_slots")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    class Meta:
        db_table = "venues_booking_slots"
        verbose_name = "Booking Slot"
        verbose_name_plural = "Booking Slots"

        indexes = [
            models.Index(fields=["slot"]),
        ]

    def __str__(self):
        return (f"{self.booking.venue.name} - "f"{self.slot.name}")


class Payment(BaseModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"

    class Provider(models.TextChoices):
        STRIPE = "STRIPE", "Stripe"

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="payment")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_provider = models.CharField(max_length=50, choices=Provider.choices, default=Provider.STRIPE)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    stripe_charge_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        db_table = "venues_payments"
        verbose_name = "Venue Payment"
        verbose_name_plural = "Venue Payments"


class Review(BaseModel):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    is_verified_booking = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venues_review"
        ordering = ["-created_at"]
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

        indexes = [
            models.Index(fields=["venue", "is_active", "-created_at"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["venue", "user"],
                name="unique_review_per_user_per_venue",
            ),
        ]

    def __str__(self):
        return f"{self.venue.name} - {self.rating}★ by {self.user.email}"


class PolicyType(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venues_policy_type"
        ordering = ["name"]
        verbose_name = "Policy Type"
        verbose_name_plural = "Policy Types"

    def __str__(self):
        return self.name


class VenuePolicy(BaseModel):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="policies")
    policy_type = models.ForeignKey(PolicyType, on_delete=models.PROTECT, related_name="venue_policies")
    content = models.TextField()
    display_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venues_venue_policy"
        ordering = ["display_order"]
        verbose_name = "Venue Policy"
        verbose_name_plural = "Venue Policies"

        indexes = [
            models.Index(fields=["venue", "is_active"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["venue", "policy_type"],
                name="unique_policy_per_venue",
            ),
        ]

    def __str__(self):
        return f"{self.venue.name} - {self.policy_type.name}"