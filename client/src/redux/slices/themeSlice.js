import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "dark", // SAFE DEFAULT FOR SSR
    hydrated: false,
  },
  reducers: {
    setTheme(state, action) {
      state.mode = action.payload;
      state.hydrated = true;
      Cookies.set("theme", state.mode, { expires: 365 });
    },
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      Cookies.set("theme", state.mode, { expires: 365 });
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
