import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";

import GuestDetailsForm from "../../components/booking/GuestDetailsForm";
import BookingSummaryCard from "../../components/booking/BookingSummaryCard";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";

import {
  confirmBooking,
  getBookingQuote,
  getVenueDetail,
} from "../../services/venueService";

const FORM_ID = "guest-details-form";

const ConfirmBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const venueSlug = searchParams.get("venue");
  const bookingDate = searchParams.get("date");
  const slotIds = useMemo(
    () => (searchParams.get("slots") || "").split(",").filter(Boolean),
    [searchParams]
  );
  const guestCount = Number(searchParams.get("guests") || 1);

  const [venue, setVenue] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isSelectionValid = Boolean(venueSlug && bookingDate && slotIds.length);

  useEffect(() => {
    if (!isSelectionValid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const venueResponse = await getVenueDetail(venueSlug);

        if (cancelled) return;

        const quoteResponse = await getBookingQuote(
          venueResponse.id,
          slotIds
        );

        if (cancelled) return;

        setVenue(venueResponse);
        setQuote(quoteResponse.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [venueSlug, bookingDate, slotIds, isSelectionValid]);

  const summaryBooking = useMemo(() => {
    if (!venue || !quote) return null;

    return {
      venue_primary_image: venue.images?.[0]?.image,
      venue_name: venue.name,
      venue_city: venue.city,
      venue_type: venue.venue_type,
      rating: venue.rating,
      booking_date: bookingDate,
      guest_count: guestCount,
      slots: quote.slots.map((slot) => ({
        id: slot.id,
        slot_name: slot.name,
        start_time: slot.start_time,
        end_time: slot.end_time,
        price: slot.price,
      })),
      venue_amount: quote.venue_amount,
      platform_fee: quote.platform_fee,
      gst_amount: quote.gst_amount,
      discount_amount: quote.discount_amount,
      total_amount: quote.total_amount,
    };
  }, [venue, quote, bookingDate, guestCount]);

  const handleSubmit = async (formData) => {
    setSubmitError("");

    try {
      setSubmitting(true);

      const response = await confirmBooking({
        venue_id: venue.id,
        booking_date: bookingDate,
        slot_ids: slotIds,
        guest_count: guestCount,
        ...formData,
      });

      navigate(`/booking/${response.booking_id}/payment`, { replace: true });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        setSubmitError(
          err.response.data?.message ||
            "One or more selected slots were just booked. Please go back and choose another."
        );
      } else {
        setSubmitError(
          err.response?.data?.message ||
            "Something went wrong while confirming your booking. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSelectionValid) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState
          title="Nothing to confirm yet"
          description="Select a date and time slot on a venue page to start a booking."
        />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
            <div className="h-40 animate-pulse rounded-3xl bg-gray-100" />
          </div>
          <div className="h-[560px] animate-pulse rounded-3xl bg-gray-100" />
        </div>
      </section>
    );
  }

  if (loadError || !summaryBooking) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <EmptyState
          title="Unable to load booking details"
          description="We couldn't load this venue's availability. Please go back and try again."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Review &amp; Confirm Your Booking
          </h1>
          <p className="mt-2 mb-8 text-gray-500">
            Nothing is reserved yet - your slot is held only after you
            confirm below.
          </p>

          <GuestDetailsForm formId={FORM_ID} onSubmit={handleSubmit} />

          {/* Booking Information recap */}
          <div className="mt-8 rounded-3xl border border-gray-100 bg-gray-50/60 p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Booking Information
            </h3>

            <dl className="mt-4 grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-gray-500">Venue</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {venue.name}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Date</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {bookingDate}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Guest Count</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {guestCount}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Venue Type</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {venue.venue_type}
                </dd>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <dt className="text-gray-500">Selected Time Slots</dt>
                <dd className="mt-1 font-semibold text-gray-900">
                  {summaryBooking.slots
                    .map(
                      (slot) =>
                        `${slot.slot_name} (${slot.start_time.slice(
                          0,
                          5
                        )} - ${slot.end_time.slice(0, 5)})`
                    )
                    .join(", ")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} className="text-green-600" />
            Your details are only used to prepare the venue for your event.
          </div>

          {submitError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            form={FORM_ID}
            disabled={submitting}
            className="
              mt-6 flex w-full items-center justify-center gap-2 rounded-2xl
              bg-red-600 py-4 text-base font-semibold text-white
              transition-all hover:bg-red-700 disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {submitting ? "Confirming..." : "Confirm & Continue to Payment"}
            {!submitting && <ArrowRight size={18} />}
          </Button>
        </div>

        {/* Right */}
        <BookingSummaryCard
          booking={summaryBooking}
          note="Booking expires after reservation starts. No payment is taken on this step."
        />
      </div>
    </section>
  );
};

export default ConfirmBookingPage;
