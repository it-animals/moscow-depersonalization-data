import { Button, Grid, Typography } from "@mui/material";
import { PageTemplate } from "../components/templates/PageTemplate";
import { useEffect } from "react";
import { useAppDispatch } from "../../service/store/store";
import { clearAppError } from "../../service/store/application/appSlice";
import { useTitle } from "ahooks";

export const ErrorPage: CT<unknown> = () => {
  const dispatch = useAppDispatch();
  useTitle("Ошибка");

  useEffect(() => {
    return () => {
      dispatch(clearAppError());
    };
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <PageTemplate>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <Typography variant={"h3"}>Что-то пошло не так :(</Typography>
          </Grid>
          <Grid item xs={12}>
            <a href={"/"} style={{ textDecoration: "none" }}>
              <Button color={"secondary"} variant={"contained"}>
                Перезагрузить
              </Button>
            </a>
          </Grid>
        </Grid>
      </PageTemplate>
    </>
  );
};
