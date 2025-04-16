import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./homeSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
  },
  // Lấy getDefaultMiddleware từ callback mà không cần import trực tiếp
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["home.selectedServer.icon"],
      },
    }),
});
