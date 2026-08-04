import { createSlice } from "@reduxjs/toolkit";

const receivedRequestSlice = createSlice({
  name: "receivedRequestSlice",
  initialState: null,
  reducers: {
    addReceivedRequests: (state, action) => {
      return action.payload;
    },
    removeReceivedRequests: (state, action) => {
      return null;
    },
  },
});

export const { addReceivedRequests, removeReceivedRequests } = receivedRequestSlice.actions;
export default receivedRequestSlice.reducer;
