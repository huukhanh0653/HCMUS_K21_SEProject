import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./homeSlice";

export const store = configureStore({
  reducer: {
    home: homeReducer,
  },
  // Lấy getDefaultMiddleware từ callback mà không cần import trực tiếp
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["home.selectedServer.icon"],
      },
    }),
});
