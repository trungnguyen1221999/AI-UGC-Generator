import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL_DEVELOPMENT,
});

export const setupAxiosInterceptors = (
  getToken: () => Promise<string | null>,
) => {
  instance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error fetching token for axios", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

export default instance;
