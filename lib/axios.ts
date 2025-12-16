import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    return response;
  }, function onRejected(error) {
    return Promise.reject(error);
  });