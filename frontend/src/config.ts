const isDevelopment = process.env["NODE_ENV"];

export const isDev = () => isDevelopment === "development";

export const appConfig = {
  apiUrl: isDev() ? "http://localhost:8000/v1/" : "/v1/",
  titleApp: " | Сервис отзывов",
};
