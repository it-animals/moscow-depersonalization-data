import styled from "styled-components";
import { Button, Paper, Typography } from "@mui/material";
import { FileType } from "../../../domain/file";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../../lib/animations/upToDownAnimate";

const Container = styled(motion(Paper))`
  min-height: 50px;
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  & h6 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

export const FileItem: CT<{ item: FileType }> = ({ item }) => {
  return (
    <Container
      {...upToDownAnimate}
      transition={{ delay: 0.3, duration: 0.3, ease: ["easeInOut"] }}
    >
      <Typography variant={"h6"}>{item.name}</Typography>
      <Button
        style={{ marginTop: 10 }}
        variant={"contained"}
        color={"secondary"}
      >
        Просмотр
      </Button>
    </Container>
  );
};
