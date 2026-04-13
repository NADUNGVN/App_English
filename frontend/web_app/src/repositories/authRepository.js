import { buildApiUrl, request } from "../lib/apiClient";

export const authRepository = {
  getMe() {
    return request("/auth/me", {
      method: "GET",
    });
  },
  login(payload) {
    return request("/auth/login", {
      body: payload,
      method: "POST",
    });
  },
  loginWithGoogle() {
    window.location.assign(buildApiUrl("/auth/google/start"));
  },
  logout() {
    return request("/auth/logout", {
      method: "POST",
    });
  },
  register(payload) {
    return request("/auth/register", {
      body: payload,
      method: "POST",
    });
  },
  updateProfile(payload) {
    return request("/users/me", {
      body: payload,
      method: "PATCH",
    });
  },
};
