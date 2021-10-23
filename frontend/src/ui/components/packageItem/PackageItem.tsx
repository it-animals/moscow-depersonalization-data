import styled from "styled-components";
import { Button, Paper, Typography, useTheme } from "@mui/material";
import { PackageType } from "../../../domain/package";
import { Link } from "react-router-dom";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { statusCatalog } from "../../../domain/status";
import { fileService } from "../../../service/file/fileService";
import { taskService } from "../../../service/task/taskService";

const Container = styled(Paper)`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PackageItem: CT<{
  onShowClick: VoidFunction;
  id: number;
  status: 1 | 2 | 3 | 4;
}> = ({ onShowClick, id, status }) => {
  const theme = useTheme();

  const abortHandler = () => {
    const solution = window.confirm(
      "Вы уверены, что хотите отменить преобразование файла?"
    );
    if (solution) {
      taskService.abort(id);
    }
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
      <ButtonWrapper>
        <Link to={`/package/${id}`}>
          <Button
            style={{ marginTop: 10 }}
            variant={"contained"}
            color={"secondary"}
            onClick={onShowClick}
          >
            Просмотр
          </Button>
        </Link>
        {status === 1 && (
          <Button
            color={"warning"}
            style={{ marginTop: 10 }}
            variant={"contained"}
            onClick={abortHandler}
          >
            Отменить
          </Button>
        )}
      </ButtonWrapper>
    </Container>
  );
};
