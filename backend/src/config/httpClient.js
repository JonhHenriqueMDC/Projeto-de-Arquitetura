import axios from "axios";

export const httpClient = axios.create({
  timeout: 3000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
