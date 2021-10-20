import styled from "styled-components";
import { Paper, Typography } from "@mui/material";
import { FileType } from "../../../domain/file";

const Container = styled(Paper)`
  min-height: 50px;
  padding: 20px;
  display: flex;
  align-items: center;
`;

export const FileItem: CT<{ item: FileType }> = ({ item }) => {
  return (
    <Container>
      <Typography variant={"h6"}>{item.name}</Typography>
    </Container>
  );
};
