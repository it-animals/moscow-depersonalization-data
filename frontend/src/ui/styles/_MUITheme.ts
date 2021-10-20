import { createTheme } from "@mui/material";
import { _variables } from "./_variables";

export const MUITheme = createTheme({
  palette: {
    background: {
      default: _variables.primaryColor,
    },
    primary: {
      main: _variables.secondColor,
    },
    secondary: {
      main: _variables.accentColor,
    },
  },
});
