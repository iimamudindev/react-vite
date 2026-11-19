import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise = null;

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest =
      /\/(login|refresh|logout)(\?|$)/.test(requestUrl);

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthData();
      window.location.href = "/";
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post(
          `${import.meta.env.VITE_API_URL}/refresh`,
          { refreshToken }
        )
          .then((res) => {
            const newAccessToken = res.data.accessToken;

            if (!newAccessToken) {
              throw new Error("Access token tidak ditemukan");
            }

            localStorage.setItem("token", newAccessToken);

            if (res.data.user) {
              localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
              );
            }

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      clearAuthData();
      window.location.href = "/";

      return Promise.reject(refreshError);
    }
  }
);

// LOGOUT
export async function logout() {
  try {
    await api.post("/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    clearAuthData();
    window.location.href = "/";
  }
}

export default api;