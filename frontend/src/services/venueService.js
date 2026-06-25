import api from "../api/axios";

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

export const reserveBooking = async (data) => {

  const response = await api.post(
    "/venues/bookings/reserve/",
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