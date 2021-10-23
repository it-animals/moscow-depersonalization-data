const isDevelopment = process.env["NODE_ENV"];

export const isDev = () => isDevelopment === "development";

(() => {
  console.log(process.env);
  console.log(
    `http://${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/v1/`
  );
})();
export const appConfig = {
  apiUrl: isDev()
    ? "http://localhost:8000/v1/"
    : `http://${process.env.REACT_APP_API_PATH}:${process.env.REACT_APP_API_PORT}/v1/`,
  titleApp: " | Сервис отзывов",
};
