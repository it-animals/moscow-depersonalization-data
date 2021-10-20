import { Box, Container, Menu, MenuItem } from "@mui/material";
import { Header } from "../header/Header";
import { Grid } from "@mui/material";
import styled from "styled-components";

const BoxContent = styled(Box)`
  padding: 60px 0;
`;

export const PageTemplate: CT<unknown> = ({ children }) => {
  return (
    <>
      <Header />
      <Container>
        <main>
          <BoxContent>{children}</BoxContent>
        </main>
      </Container>
    </>
  );
};
