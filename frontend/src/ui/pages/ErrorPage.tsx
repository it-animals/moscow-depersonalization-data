import { Button, Grid, Typography } from "@mui/material";
import { PageTemplate } from "../components/templates/PageTemplate";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../service/store/store";
import { clearAppError } from "../../service/store/application/appSlice";

export const ErrorPage: CT<unknown> = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearAppError());
    };
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
