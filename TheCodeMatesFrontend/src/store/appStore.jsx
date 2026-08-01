import { configureStore } from "@reduxjs/toolkit";
import userReucer from "./userSlice";
import feedReducer from "./feedSlice";

const appstore = configureStore({
  reducer: {
    userReucer,
    feedReducer,
  },
});

export default appstore;
