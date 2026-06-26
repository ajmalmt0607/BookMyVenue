from decimal import Decimal


class PricingService:

    PLATFORM_FEE = Decimal("500.00")

    GST_PERCENTAGE = Decimal("18")

    @classmethod
    def calculate(cls, venue_amount):

        platform_fee = cls.PLATFORM_FEE

        gst_amount = (
            (venue_amount + platform_fee)
            * cls.GST_PERCENTAGE
            / Decimal("100")
        ).quantize(
            Decimal("0.01")
        )

        total_amount = (
            venue_amount
            + platform_fee
            + gst_amount
        )

        return {
            "venue_amount": venue_amount,
            "platform_fee": platform_fee,
            "gst_amount": gst_amount,
            "total_amount": total_amount,
        }