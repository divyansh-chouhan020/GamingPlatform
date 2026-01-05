import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!Cookies.get("token"),
    role: Cookies.get("role") || "guest",
    token: Cookies.get("token") || null,
  },
  reducers: {
    login(state, action) {
      const { token, role } = action.payload;
      state.isAuthenticated = true;
      state.token = token;
      state.role = role;

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.role = "guest";

      Cookies.remove("token");
      Cookies.remove("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
