const isDevelopment = process.env["NODE_ENV"];

export const isDev = () => isDevelopment === "development";

export const appConfig = {
  apiUrl: isDev() ? "http://localhost:8000/v1/" : "http://62.84.123.147:8000/v1/",
  titleApp: " | Сервис отзывов",
};
