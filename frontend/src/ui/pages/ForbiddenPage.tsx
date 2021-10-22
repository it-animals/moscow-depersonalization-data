import { PageTemplate } from "../components/templates/PageTemplate";
import { Button, Grid, Typography } from "@mui/material";
import { useAppDispatch } from "../../service/store/store";
import { useEffect } from "react";
import { clearAppError } from "../../service/store/application/appSlice";

export const ForbiddenPage: CT<unknown> = () => {
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
            <Typography variant={"h3"}>
              Недостаточно прав для просмотра страницы
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <a href={"/"} style={{ textDecoration: "none" }}>
              <Button color={"secondary"} variant={"contained"}>
                Вернуться на главную
              </Button>
            </a>
          </Grid>
        </Grid>
      </PageTemplate>
    </>
  );
};
