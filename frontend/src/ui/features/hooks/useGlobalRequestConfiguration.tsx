import { useEffect } from "react";
import axios from "axios";
import { appConfig } from "../../../config";

export const useGlobalRequestConfiguration = () => {
  useEffect(() => {
    axios.defaults.baseURL = appConfig.apiUrl;
    //eslint-disable-next-line
  }, []);
};
