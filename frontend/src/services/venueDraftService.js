import api from "../api/axios";

export const getOwnerVenues = async (params = {}) => {
  const response = await api.get("/owner/venues/", { params });

  return response.data;
};

export const createVenueDraft = async () => {
  const response = await api.post("/owner/venues/");

  return response.data;
};

export const getVenueDraft = async (venueId) => {
  const response = await api.get(`/owner/venues/${venueId}/`);

  return response.data;
};

export const deleteVenueDraft = async (venueId) => {
  await api.delete(`/owner/venues/${venueId}/`);
};

export const getVenueDraftProgress = async (venueId) => {
  const response = await api.get(`/owner/venues/${venueId}/progress/`);

  return response.data;
};

export const updateVenueBasicInfo = async (venueId, data) => {
  const response = await api.patch(
    `/owner/venues/${venueId}/basic-info/`,
    data
  );

  return response.data;
};

export const uploadVenueImages = async (venueId, files, onProgress) => {
  const formData = new FormData();

  files.forEach((file) => formData.append("images", file));

  const response = await api.post(
    `/owner/venues/${venueId}/images/`,
    formData,
    {
      // The shared axios instance defaults Content-Type to
      // application/json for every request - overriding it here to
      // undefined lets the browser set it itself (multipart/form-data
      // with the required boundary). Leaving the json default in place
      // sends the multipart body under the wrong content type, so
      // Django never parses request.FILES and the upload silently fails.
      headers: { "Content-Type": undefined },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    }
  );

  return response.data;
};

export const deleteVenueImage = async (venueId, imageId) => {
  await api.delete(`/owner/venues/${venueId}/images/${imageId}/`);
};

export const reorderVenueImages = async (venueId, orderedImageIds) => {
  const response = await api.patch(
    `/owner/venues/${venueId}/images/reorder/`,
    { ordered_image_ids: orderedImageIds }
  );

  return response.data;
};

export const setPrimaryVenueImage = async (venueId, imageId) => {
  const response = await api.patch(
    `/owner/venues/${venueId}/images/${imageId}/set-primary/`
  );

  return response.data;
};

export const updateVenueAmenities = async (venueId, amenityIds) => {
  const response = await api.put(`/owner/venues/${venueId}/amenities/`, {
    amenity_ids: amenityIds,
  });

  return response.data;
};

export const updateVenuePolicies = async (venueId, policies) => {
  const response = await api.put(`/owner/venues/${venueId}/policies/`, {
    policies,
  });

  return response.data;
};

export const createVenueTimeSlot = async (venueId, data) => {
  const response = await api.post(
    `/owner/venues/${venueId}/time-slots/`,
    data
  );

  return response.data;
};

export const updateVenueTimeSlot = async (venueId, slotId, data) => {
  const response = await api.patch(
    `/owner/venues/${venueId}/time-slots/${slotId}/`,
    data
  );

  return response.data;
};

export const deleteVenueTimeSlot = async (venueId, slotId) => {
  await api.delete(`/owner/venues/${venueId}/time-slots/${slotId}/`);
};

export const submitVenueForApproval = async (venueId) => {
  const response = await api.post(`/owner/venues/${venueId}/submit/`);

  return response.data;
};
