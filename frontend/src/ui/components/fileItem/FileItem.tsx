import styled from "styled-components";
import { Button, Paper, Typography } from "@mui/material";
import { FileType } from "../../../domain/file";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../../lib/animations/upToDownAnimate";
import { Link } from "react-router-dom";
const Container = styled(motion(Paper))`
  padding: 20px;
  display: flex;
  min-height: 150px;
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

export const FileItem: CT<{ item: FileType; showAnimate: boolean }> = ({
  item,
  showAnimate,
}) => {
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
