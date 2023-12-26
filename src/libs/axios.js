import axios from "axios";
import { getUrl } from "@/config/config";

const baseURL = getUrl();
const api = axios.create({
  baseURL,
});

api.interceptors.request.use(function (config) {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  function (error) {
    return Promise.reject(error);
  }
);

export default api;