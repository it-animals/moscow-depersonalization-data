import styled from "styled-components";
import { Box, Container } from "@mui/material";
import { HeaderView } from "../header/HeaderView";

const BoxContent = styled(Box)`
  padding: 60px 0;
`;

export const PageTemplateView: CT<unknown> = ({ children }) => {
  return (
    <>
      <HeaderView />
      <Container>
        <main>
          <BoxContent>{children}</BoxContent>
        </main>
      </Container>
    </>
  );
};
