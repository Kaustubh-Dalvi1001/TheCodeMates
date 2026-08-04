import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  profile: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,

  reducers: {
    addUser: (state, action) => {
      state.status = "authenticated";
      state.profile = action.payload;
    },
    removeUser: (state, action) => {
      state.status = "unauthenticated";
      state.profile = null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
