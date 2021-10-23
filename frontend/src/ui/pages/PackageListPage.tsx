import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";
import { PackageItem } from "../components/packageItem/PackageItem";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PackageType } from "../../domain/package";
import { taskService } from "../../service/task/taskService";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../lib/animations/upToDownAnimate";
import { setPackage } from "../../service/store/package/packageSlice";
import {
  LoadContext,
  loadContextData,
} from "../features/common/LoadContextProvider";

const TopLine = styled(motion.div)`
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
  const loadContextData = useContext(LoadContext);

  useEffect(() => {
    (async () => {
      const load = async () => {
        try {
          const data = await await taskService.list();
          setList(data.data);
          loadContextData.setLoad(setTimeout(load, 3000));
        } catch (e) {
          console.log(e);
        }
      };
      load();
    })();
  }, []);

  const stopLoadHandler = () => {
    loadContextData.clearLoad();
    taskService.stop();
  };

  return (
    <PageTemplate>
      <TopLine
        {...upToDownAnimate}
        transition={{
          delay: 0,
          duration: 0.3,
          ease: ["easeInOut"],
        }}
      >
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакеты документов
        </Typography>
        <a href={`/load/`}>
          <Button
            variant={"contained"}
            onClick={stopLoadHandler}
            // color={"secondary"}
          >
            Создать пакет
          </Button>
        </a>
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
                <PackageItem
                  onShowClick={stopLoadHandler}
                  id={item.id}
                  status={item.status}
                />
              </LinePackage>
            );
          })}
        </Grid>
      )}
    </PageTemplate>
  );
};
