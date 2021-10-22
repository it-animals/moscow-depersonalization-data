import styled, { keyframes } from "styled-components";
import { Button, Paper, Typography } from "@mui/material";
import { fileError, fileInWork, FileType } from "../../../domain/file";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../../lib/animations/upToDownAnimate";
import { Link } from "react-router-dom";
import { Loop } from "@mui/icons-material";
import { NearbyErrorOutlined } from "@mui/icons-material";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;

const Container = styled(motion(Paper))`
  padding: 20px;
  display: flex;
  min-height: 150px;
  justify-content: space-between;
  flex-direction: column;
  cursor: pointer;
  position: relative;

  & h6 {
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

const Load = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.85);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const IconLoad = styled(Loop)`
  width: 80px;
  height: 80px;
  fill: white;
  color: white;
  animation: ${rotate} 2s linear infinite;
`;

const IconError = styled(NearbyErrorOutlined)`
  width: 80px;
  height: 80px;
  fill: red;
  color: red;
`;

const Error = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 26, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const FileItem: CT<{ item: FileType; showAnimate: boolean }> = ({
  item,
  showAnimate,
}) => {
  if (fileError(item)) {
    return (
      <Container
        {...upToDownAnimate}
        transition={{
          delay: showAnimate ? 0.6 : 0,
          duration: showAnimate ? 0.3 : 0.3,
          ease: ["easeInOut"],
        }}
      >
        <Typography variant={"h6"}>{item.name}</Typography>
        <Error>
          <IconError style={{ width: 45, height: 45 }} />
          <Typography color={"red"}>Ошибка преобразования</Typography>
        </Error>
      </Container>
    );
  }
  if (fileInWork(item)) {
    return (
      <Container
        {...upToDownAnimate}
        transition={{
          delay: showAnimate ? 0.6 : 0,
          duration: showAnimate ? 0.3 : 0.3,
          ease: ["easeInOut"],
        }}
      >
        <Typography variant={"h6"}>{item.name}</Typography>
        <Load>
          <IconLoad style={{ width: 45, height: 45 }} />
          <Typography color={"white"}>Преобразование файла...</Typography>
        </Load>
      </Container>
    );
  }

  return (
    <Container
      {...upToDownAnimate}
      transition={{
        delay: showAnimate ? 0.6 : 0,
        duration: showAnimate ? 0.3 : 0.3,
        ease: ["easeInOut"],
      }}
    >
      <Typography variant={"h6"}>{item.name}</Typography>
      <Link to={`/view/${item.id}/1`}>
        <Button
          style={{ marginTop: 10 }}
          variant={"contained"}
          color={"secondary"}
        >
          Просмотр
        </Button>
      </Link>
    </Container>
  );
};
