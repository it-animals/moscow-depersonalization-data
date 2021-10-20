import styled, { keyframes } from "styled-components";
import { InsertDriveFileOutlined } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";

const rotate = keyframes`
  from {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }
  to {
    transform: translateX(-5px);
  }
`;

const LooIcon = styled(InsertDriveFileOutlined)`
  animation: ${rotate} 1.5s infinite linear;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
export const Loader: CT<unknown> = ({ className, children }) => {
  const theme = useTheme();
  return (
    <Container className={className}>
      <LooIcon
        style={{
          width: "50px",
          height: "50px",
          fill: "white",
        }}
      />
      <Typography color={"white"} variant={"h6"}>
        Идет обработка файлов...
      </Typography>
    </Container>
  );
};
