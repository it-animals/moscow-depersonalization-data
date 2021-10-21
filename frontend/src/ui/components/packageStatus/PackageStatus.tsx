import styled from "styled-components";
import { packageInWork, PackageType } from "../../../domain/package";
import { Button, Typography } from "@mui/material";

const Status = styled.div`
  width: 100%;
  height: 50px;
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
      <Button color={"secondary"} variant={"contained"}>
        Скачать полный пакет документов
      </Button>
    </Status>
  );
};
