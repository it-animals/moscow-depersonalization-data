import { PageTemplate } from "../components/templates/PageTemplate";
import { Button, Grid, Typography } from "@mui/material";

export const NotFoundPage: CT<unknown> = () => {
  return (
    <>
      <PageTemplate>
        <Grid container rowSpacing={3}>
          <Grid item xs={12}>
            <Typography variant={"h3"}>404 Страница не найдена :(</Typography>
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
