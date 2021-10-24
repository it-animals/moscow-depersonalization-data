import { RequestInterceptor } from "./RequestInterceptor";
import { ErrorBoundary } from "./ErrorBoundary";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "../../styles/_global";
import { ThemeProvider } from "@mui/material";
import { MUITheme } from "../../styles/_MUITheme";
import { useGlobalRequestConfiguration } from "../hooks/useGlobalRequestConfiguration";
import { LoadContextProvider } from "./LoadContextProvider";

export const AppLayout: CT<unknown> = ({ children }) => {
  useGlobalRequestConfiguration();
  return (
    <>
      <Router>
        <GlobalStyle />
        <ErrorBoundary>
          <LoadContextProvider>
            {/*Отлов ошибок api */}
            <RequestInterceptor>
              <ThemeProvider theme={MUITheme}>{children}</ThemeProvider>
            </RequestInterceptor>
          </LoadContextProvider>
        </ErrorBoundary>
      </Router>
    </>
  );
};
