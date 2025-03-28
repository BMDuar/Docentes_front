import axios from "axios";
import URLS from "../assets/json/texts.json";

const api = axios.create({
  baseURL:
    window.location.href.includes("localhost") ||
    window.location.href.includes("127.0.0.1") ||
    window.location.href.includes("10.5.17")
      ? URLS.STATIC_URL_DEV
      : window.location.href.includes("teste")
      ? URLS.STATIC_URL_TESTE
      : URLS.STATIC_URL_PROD,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
