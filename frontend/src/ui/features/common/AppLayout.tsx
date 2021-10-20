import { RequestInterceptor } from "./RequestInterceptor";
import { ErrorBoundary } from "./ErrorBoundary";
import { Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalStyle } from "../../styles/_global";
import { ThemeProvider } from "@mui/material";
import { MUITheme } from "../../styles/_MUITheme";

export const AppLayout: CT<unknown> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <ErrorBoundary>
        {/*Отлов ошибок api */}
        <RequestInterceptor>
          <Router>
            <ThemeProvider theme={MUITheme}>{children}</ThemeProvider>
          </Router>
        </RequestInterceptor>
      </ErrorBoundary>
    </>
  );
};
