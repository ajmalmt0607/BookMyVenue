import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import CustomerDetailsForm from "../../components/booking/CustomerDetailsForm";
import CustomerDetailsSidebar from "../../components/booking/CustomerDetailsSidebar";

import {
  getBookingSummary,
  updateCustomerDetails,
} from "../../services/venueService";

const CustomerDetailsPage = () => {

  const navigate =
    useNavigate();

  const { bookingId } =
    useParams();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    fetchBooking();

  }, [bookingId]);

  const fetchBooking =
    async () => {

      try {

        const response =
          await getBookingSummary(
            bookingId
          );

        setBooking(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const handleSubmit =
    async (
      formData,
      setErrors
    ) => {

      try {

        setSaving(true);

        await updateCustomerDetails(
          bookingId,
          formData
        );

        navigate(
          `/booking/${bookingId}/payment`
        );

      } catch (error) {

        console.error(error);

        if (
          error.response?.status === 400
        ) {

          setErrors(
            error.response.data
          );

          return;

        }

      } finally {

        setSaving(false);

      }

    };

  if (loading) {

    return (

      <div
        className="
          py-24
          text-center
        "
      >
        Loading...
      </div>

    );

  }

  return (

    <section
      className="
        max-w-7xl
        mx-auto
        px-5
        py-10
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[1fr_380px]
          gap-8
          items-start
        "
      >

        {/* Left */}

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Your Details
          </h1>

          <p
            className="
              text-gray-500
              mt-2
              mb-8
            "
          >
            Please provide your details
            to continue with your booking.
          </p>

          <CustomerDetailsForm
            booking={booking}
            loading={saving}
            onSubmit={
              handleSubmit
            }
          />

          {/* Buttons */}

          <div
            className="
              flex
              justify-between
              mt-6
            "
          >

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              disabled={saving}
              className="
                border
                border-gray-200
                px-5
                py-3
                rounded-xl
                flex
                items-center
                gap-2
                hover:bg-gray-50
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              <ArrowLeft
                size={16}
              />

              Back

            </button>

            <button
              type="submit"
              form="customer-details-form"
              disabled={saving}
              className={`
                px-6
                py-3
                rounded-xl
                font-semibold
                flex
                items-center
                gap-2
                transition-all

                ${
                  saving
                    ? `
                      bg-gray-300
                      text-gray-600
                      cursor-not-allowed
                    `
                    : `
                      bg-red-600
                      hover:bg-red-700
                      text-white
                    `
                }
              `}
            >

              {saving
                ? "Saving..."
                : "Continue"}

              <ArrowRight
                size={16}
              />

            </button>

          </div>

        </div>

        {/* Right */}

        <CustomerDetailsSidebar
          booking={booking}
        />

      </div>

    </section>

  );

};

export default CustomerDetailsPage;