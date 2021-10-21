import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";
import { PackageItem } from "../components/packageItem/PackageItem";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { PackageType } from "../../domain/package";
import { taskService } from "../../service/task/taskService";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../lib/animations/upToDownAnimate";

const TopLine = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const LinePackage = styled(motion(Grid))``;

export const PackageListPage: CT<unknown> = () => {
  const [list, setList] = useState<PackageType[]>([]);

  useEffect(() => {
    (async () => {
      const data = await taskService.list();
      setList(data.data);
    })();
  }, []);

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
      {!!list.length && (
        <Grid
          container
          rowSpacing={2}
          columnSpacing={10}
          justifyContent={"flex-start"}
        >
          {list.map((item) => {
            return (
              <LinePackage
                {...upToDownAnimate}
                transition={{
                  ease: ["easeInOut"],
                  duration: 0.4,
                  delay: 0.1,
                }}
                item
                xs={4}
              >
                <PackageItem id={item.id} status={item.status} />
              </LinePackage>
            );
          })}
        </Grid>
      )}
    </PageTemplate>
  );
};
