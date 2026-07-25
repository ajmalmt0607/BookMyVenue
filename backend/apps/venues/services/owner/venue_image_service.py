from django.db import transaction
from django.db.models import Max

from apps.venues.models import VenueImage


class VenueImageService:

    @staticmethod
    def add_images(venue, images):
        has_primary = venue.images.filter(is_primary=True).exists()
        next_order = (
            venue.images.aggregate(Max("display_order"))["display_order__max"] or 0
        )

        created = []

        for offset, image_file in enumerate(images, start=1):
            image = VenueImage.objects.create(
                venue=venue,
                image=image_file,
                is_primary=not has_primary and offset == 1,
                display_order=next_order + offset,
            )
            created.append(image)

        return created

    @staticmethod
    @transaction.atomic
    def delete_image(venue, image):
        was_primary = image.is_primary
        file_to_delete = image.image

        image.delete()

        if file_to_delete:
            file_to_delete.delete(save=False)

        if was_primary:
            next_image = venue.images.order_by("display_order").first()

            if next_image:
                next_image.is_primary = True
                next_image.save(update_fields=["is_primary"])

    @staticmethod
    def reorder_images(venue, ordered_image_ids):
        images = {str(image.id): image for image in venue.images.all()}

        for position, image_id in enumerate(ordered_image_ids, start=1):
            image = images[image_id]

            if image.display_order != position:
                image.display_order = position
                image.save(update_fields=["display_order"])

        return list(venue.images.order_by("display_order"))

    @staticmethod
    @transaction.atomic
    def set_primary_image(venue, image):
        venue.images.exclude(id=image.id).update(is_primary=False)

        image.is_primary = True
        image.save(update_fields=["is_primary"])

        return image
