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
import Logo from "../../../assets/login.svg";
import Dit from "../../../assets/dit.svg";
import Dpi from "../../../assets/dpi.svg";
import Aim from "../../../assets/aim.svg";

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

const ImageWrap = styled.div`
  height: 100%;

  & img {
    height: 64px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Part = styled.div`
  column-gap: 15px;
  display: flex;
  align-items: center;
`;

export const Header: CT<unknown> = () => {
  return (
    <header>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Content>
              <Part>
                <a
                  href="https://leaders2021.innoagency.ru/?utm_source=telegram&utm_medium=smm"
                  target={"_blank"}
                >
                  <ImageWrap>
                    <img src={Logo} alt="" />
                  </ImageWrap>
                </a>
                <LogoLink href="/">
                  <Typography variant="h6" noWrap component="div">
                    деПерсонализатор
                  </Typography>
                </LogoLink>
              </Part>
              <Part>
                <a href="https://www.mos.ru/dpir/" target={"_blank"}>
                  <ImageWrap>
                    <img src={Dpi} style={{ height: 38, width: 142 }} alt="" />
                  </ImageWrap>
                </a>
                <a href="https://innoagency.ru/ru/" target={"_blank"}>
                  <ImageWrap>
                    <img src={Aim} style={{ height: 38, width: 142 }} alt="" />
                  </ImageWrap>
                </a>
                <a href="https://www.mos.ru/dit/" target={"_blank"}>
                  <ImageWrap>
                    <img src={Dit} style={{ height: 38, width: 142 }} alt="" />
                  </ImageWrap>
                </a>
              </Part>
            </Content>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
