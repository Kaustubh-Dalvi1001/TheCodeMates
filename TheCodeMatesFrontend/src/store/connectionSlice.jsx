import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connectionSlice",
  initialState: null,
  reducers: {
    addConnections: (state, action) => {
      return action.payload;
    },
    removeConnections: (state, actions) => {
      return null;
    },
  },
});

export const { addConnections, removeConnections } = connectionSlice.actions;

export default connectionSlice.reducer;
