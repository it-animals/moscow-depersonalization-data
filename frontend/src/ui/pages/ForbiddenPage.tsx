import { PageTemplate } from "../components/templates/PageTemplate";
import { Button, Grid, Typography } from "@mui/material";

export const ForbiddenPage: CT<unknown> = () => {
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
