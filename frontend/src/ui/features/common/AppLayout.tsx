import { RequestInterceptor } from "./RequestInterceptor";
import { ErrorBoundary } from "./ErrorBoundary";
import { Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "../../styles/_global";
import { ThemeProvider } from "@mui/material";
import { MUITheme } from "../../styles/_MUITheme";
import { useGlobalRequestConfiguration } from "../hooks/useGlobalRequestConfiguration";

export const AppLayout: CT<unknown> = ({ children }) => {
  useGlobalRequestConfiguration();
  return (
    <>
      <Router>
        <GlobalStyle />
        <ErrorBoundary>
          {/*Отлов ошибок api */}
          <RequestInterceptor>
            <ThemeProvider theme={MUITheme}>{children}</ThemeProvider>
          </RequestInterceptor>
        </ErrorBoundary>
      </Router>
    </>
  );
};
