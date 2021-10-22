import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../service/store/store";
import { selectAppError } from "../../../service/store/application/appSlice";

export const ErrorBoundary: React.FC<unknown> = ({ children }) => {
  const appError = useAppSelector(selectAppError);
  const history = useHistory();
  const appErrors: { [key: number]: VoidFunction } = {
    "0": () => {
      history.push("/error");
    },
    "404": () => {
      history.push("/404");
    },
    "401": () => {
      history.push("/logout");
    },
    "500": () => {
      history.push("/error");
    },
    "403": () => {
      history.push("/403");
    },
  };

  useEffect(() => {
    if (!appError || !history) return;
    appErrors[appError.status]();
    //eslint-disable-next-line
  }, [appError, history]);

  return <>{children}</>;
};
