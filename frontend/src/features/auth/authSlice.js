import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchCurrentUser } from "../../services/authService";

// Route guards need to know a logged-in user's roles to gate owner-only
// pages. Roles only exist in Redux, which resets on refresh - so guards must
// wait for this thunk to settle before making a decision, rather than
// trusting stale state.
export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async () => {
    const user = await fetchCurrentUser();

    return user;
  }
);

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (
      state,
      action
    ) => {
      state.isAuthenticated =
        true;

      state.accessToken =
        action.payload.accessToken;

      state.refreshToken =
        action.payload.refreshToken;

      if (action.payload.user) {
        state.user =
          action.payload.user;

        state.status =
          "succeeded";
      }
    },

    logout: (state) => {
      state.isAuthenticated =
        false;

      state.accessToken = null;

      state.refreshToken =
        null;

      state.user = null;

      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectRoles = (state) => state.auth.user?.roles ?? [];

export default authSlice.reducer;