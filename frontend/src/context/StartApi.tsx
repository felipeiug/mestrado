import axios, { AxiosRequestConfig } from "axios";

// Fução API
export const StartApi: React.FC<Props> = ({ children }) => {

  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; };

      // Se a resposta for 401 e a requisição não foi marcada como repetida
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
      }

      return Promise.reject(error);
    },
  );

  return (<div>{children}</ div>);
};

type Props = {
  children?: React.ReactNode;
};