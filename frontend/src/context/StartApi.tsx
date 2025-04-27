import axios, { AxiosRequestConfig } from "axios";
import { useRef, useState } from "react";
import { generateRandomHash } from "../core";

// Fução API
export const StartApi: React.FC<Props> = ({ children }) => {

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [appKey, setAppKey] = useState<string>(generateRandomHash(8));
  const [currentRequest, setCurrentRequest] = useState<(AxiosRequestConfig & { _retry?: boolean; }) | undefined>(undefined);

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
        setIsRefreshing(true);
        setCurrentRequest(originalRequest);
      }

      return Promise.reject(error);
    },
  );

  return (<div key={appKey}>
    {children}
  </ div>);
};

type Props = {
  children?: React.ReactNode;
};