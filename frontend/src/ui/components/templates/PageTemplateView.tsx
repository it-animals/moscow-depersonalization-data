import styled from "styled-components";
import { Box, Container } from "@mui/material";
import { HeaderView } from "../header/HeaderView";
import React from "react";

const BoxContent = styled(Box)`
  padding: 60px 0;
`;

export const PageTemplateView: CT<{ fullWidth?: boolean }> = ({
  children,
  fullWidth = false,
}) => {
  const ContainerVariant: React.FC<unknown> = ({ children }) =>
    fullWidth ? (
      <Container maxWidth={false}>{children}</Container>
    ) : (
      <Container>{children}</Container>
    );

  return (
    <>
      <HeaderView />
      <ContainerVariant>
        <main>
          <BoxContent>{children}</BoxContent>
        </main>
      </ContainerVariant>
    </>
  );
};
