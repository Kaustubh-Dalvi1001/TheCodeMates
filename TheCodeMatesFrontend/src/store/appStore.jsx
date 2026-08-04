import { configureStore } from "@reduxjs/toolkit";
import userReucer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";

const appstore = configureStore({
  reducer: {
    userReucer,
    feedReducer,
    connectionReducer,
  },
});

export default appstore;
