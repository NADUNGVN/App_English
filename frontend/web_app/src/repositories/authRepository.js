import { request } from "../lib/apiClient";

export const authRepository = {
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: payload,
    });
  },
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: payload,
    });
  },
  getMe(token) {
    return request("/auth/me", {
      method: "GET",
      token,
    });
  },
  updateProfile(token, payload) {
    return request("/users/me", {
      method: "PATCH",
      token,
      body: payload,
    });
  },
};
