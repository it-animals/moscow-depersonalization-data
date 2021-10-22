import styled from "styled-components";
import { Button, Paper, Typography, useTheme } from "@mui/material";
import { PackageType } from "../../../domain/package";
import { Link } from "react-router-dom";

const Container = styled(Paper)`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const PackageItem: CT<{ id: number; status: 1 | 2 | 3 }> = ({
  id,
  status,
}) => {
  const theme = useTheme();
  const statusCatalog = {
    1: "В работе",
    2: "Преобразован",
    3: "Ошибка",
  };

  return (
    <Container>
      <Typography variant={"h6"} fontWeight={"bold"}>
        Пакет документов № {id}
      </Typography>
      <Typography variant={"h6"} fontWeight={"bold"}>
        <span>
          Статус:&nbsp;
          <span style={{ color: theme.palette.secondary.main }}>
            {statusCatalog[status]}
          </span>
        </span>
      </Typography>
      <Link to={`/package/${id}`}>
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
