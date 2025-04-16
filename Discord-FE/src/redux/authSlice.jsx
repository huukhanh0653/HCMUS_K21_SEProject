import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../services/UserService";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserId: (state) => {
      state.userId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload;
      })
      .addCase(saveUserId.rejected, (state, action) => {
        state.loading = false;
        state.userId = null;
        state.error = action.error.message;
      });
  },
});

export const saveUserId = createAsyncThunk("auth/saveUserId", async () => {
  try {
    const user = await UserService.getUserByEmail(
      localStorage.getItem("email")
    );
    return user._id;
  } catch (error) {
    console.error("Error to save user id:", error);
    return null;
  }
});

export const { clearUserId } = authSlice.actions;
export default authSlice.reducer;
