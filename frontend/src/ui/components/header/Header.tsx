import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
export const Header: CT<unknown> = () => {
  return (
    <header>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Заголовок
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
