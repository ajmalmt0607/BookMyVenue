import api from "../api/axios";
import { getAccessToken } from "../utils/tokenStorage";

export const getVenues = async (params = {}) => {
  const response = await api.get(
    "/venues/venues/",
    {
      params,
    }
  );

  return response.data;
};


export const getVenueDetail = async (
  slug
) => {
  const response = await api.get(
    `/venues/venues/${slug}/`
  );

  return response.data;
};

export const getVenueAvailability =
  async (slug, date) => {

    const response =
      await api.get(
        `/venues/${slug}/availability/`,
        {
          params: { date },
        }
      );

    return response.data;
};

export const getBookingQuote = async (
  venueId,
  slotIds
) => {

  const response = await api.get(
    "/venues/bookings/quote/",
    {
      params: {
        venue_id: venueId,
        slot_ids: slotIds.join(","),
      },
    }
  );

  return response.data;
};

export const confirmBooking = async (data) => {

  const response = await api.post(
    "/venues/bookings/confirm/",
    data
  );

  return response.data;
};

export const getBookingSummary = async (
  bookingId
) => {

  const response = await api.get(
    `/venues/bookings/${bookingId}/`
  );

  return response.data;
};

export const getPaymentIntent = async (
  bookingId
) => {

  const response =
    await api.post(
      `/venues/bookings/${bookingId}/payment/intent/`
    );

  return response.data;

};

export const confirmPaymentStatus = async (
  bookingId
) => {

  const response =
    await api.post(
      `/venues/bookings/${bookingId}/payment/confirm/`
    );

  return response.data;

};

// Releases a held reservation the moment the customer backs out of the
// Payment page. Uses `fetch(..., { keepalive: true })` rather than the
// shared axios instance: axios's XHR adapter has no keepalive support,
// so a request fired from a `pagehide` handler during tab close/refresh
// would otherwise be aborted before the browser sends it.
export const cancelBooking = (bookingId) => {

  const token = getAccessToken();

  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}/venues/bookings/${bookingId}/cancel/`,
    {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

};