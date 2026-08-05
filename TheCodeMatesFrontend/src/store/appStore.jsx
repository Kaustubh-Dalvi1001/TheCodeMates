import { configureStore } from "@reduxjs/toolkit";
import userReucer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import receivedRequestReducer from "./receivedRequestSlice";
import sentRequestReducer from "./sentRequestSlice";

const appstore = configureStore({
  reducer: {
    userReucer,
    feedReducer,
    connectionReducer,
    receivedRequestReducer,
    sentRequestReducer,
  },
});

export default appstore;
