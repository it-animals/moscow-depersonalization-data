import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LogoLink = styled.a`
  text-decoration: none;
  color: white;
  &:active {
    color: white;
  }
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: white;
  &:active {
    color: white;
  }
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const Nav = styled.nav`
  display: flex;
  margin-left: 125px;
  height: 100%;
  align-items: center;
  & ul {
    display: flex;
    column-gap: 20px;
    align-items: center;
    height: 100%;
  }
`;

export const Header: CT<unknown> = () => {
  return (
    <header>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <LogoLink href="/">
              <Typography variant="h6" noWrap component="div">
                Персонализатор
              </Typography>
            </LogoLink>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
