import React, { useEffect, useState } from "react";
import axios from "axios";
import { setAppError } from "../../../service/store/application/appSlice";
import { useAppDispatch } from "../../../service/store/store";

export const RequestInterceptor: React.FC<unknown> = ({ children }) => {
  const [showContent, setShowContent] = useState(false);
  const dispatch = useAppDispatch();

  /*
        Установка интерсептора для глобального отлова ошибок
        Логика в том, что при 500,403,401 произойдет редирект на соотв. страницу
        Вне зависимости от вида запроса
       */
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (
            err?.response?.status === 500 ||
            err?.response?.status === 403 ||
            err?.response?.status === 401
          ) {
            const { message } = err.response.data;
            dispatch(setAppError({ status: err.response.status, message }));
          }
        }
        if (err.response === undefined) {
          dispatch(setAppError({ status: 0, message: "Неизвестная ошибка" }));
        }
        return Promise.reject(err);
      }
    );
    setShowContent(true);
    //eslint-disable-next-line
  }, []);

  return <>{showContent && children}</>;
};
