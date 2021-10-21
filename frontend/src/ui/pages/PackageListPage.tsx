import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";
import { PackageItem } from "../components/packageItem/PackageItem";
import { Link } from "react-router-dom";

const TopLine = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const PackageListPage: CT<unknown> = () => {
  return (
    <PageTemplate>
      <TopLine>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакеты документов
        </Typography>
        <Link to={`/load/`}>
          <Button
            variant={"contained"}
            // color={"secondary"}
          >
            Создать пакет
          </Button>
        </Link>
      </TopLine>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={10}
        justifyContent={"flex-start"}
      >
        {new Array(10).fill(0).map((item) => {
          return (
            <Grid item xs={4}>
              <PackageItem id={1} status={3} />
            </Grid>
          );
        })}
      </Grid>
    </PageTemplate>
  );
};
