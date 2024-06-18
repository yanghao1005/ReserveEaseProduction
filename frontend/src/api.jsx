import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Crea una instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Configura un interceptor para adjuntar el token de acceso a cada solicitud
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
