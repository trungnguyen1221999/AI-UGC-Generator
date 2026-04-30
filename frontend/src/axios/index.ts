import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL_DEVELOPMENT,
  withCredentials: true,
});

export default instance;
