import styled from "styled-components";
import {
  packageError,
  packageInWork,
  PackageType,
} from "../../../domain/package";
import { Button, Typography } from "@mui/material";

const Status = styled.div`
  width: 100%;
  height: 50px;
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PackageStatus: CT<{ packageFile: PackageType | null }> = ({
  packageFile,
}) => {
  if (!packageFile) {
    return <></>;
  }
  if (packageError(packageFile)) {
    return (
      <Status>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакет документов №{packageFile.id} преобразован с ошибками
        </Typography>
        <Button color={"warning"} variant={"contained"}>
          Скачать полный пакет документов
        </Button>
      </Status>
    );
  }
  if (packageInWork(packageFile)) {
    return (
      <Status>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакет документов №{packageFile.id} находится в обработке
        </Typography>
      </Status>
    );
  }
  return (
    <Status>
      <Typography
        style={{ textDecoration: "underline" }}
        color={"secondary.main"}
        variant={"h5"}
      >
        Пакет документов №{packageFile.id} успешно преобразован
      </Typography>
      <Button color={"success"} variant={"contained"}>
        Скачать полный пакет документов
      </Button>
    </Status>
  );
};
