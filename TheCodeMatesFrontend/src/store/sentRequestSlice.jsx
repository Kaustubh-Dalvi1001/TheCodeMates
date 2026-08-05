import { createSlice } from "@reduxjs/toolkit";

const sentRequestSlice = createSlice({
  name: "sentRequestSlice",
  initialState: null,
  reducers: {
    addSentRequests: (state, action) => {
      return action.payload;
    },
    removeSentRequests: (state, action) => {
      return null;
    },
  },
});

export const { addSentRequests, removeSentRequests } = sentRequestSlice.actions;
export default sentRequestSlice.reducer;
