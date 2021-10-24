import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";
import { PackageItem } from "../components/packageItem/PackageItem";
import { useContext, useEffect, useState } from "react";
import { PackageType } from "../../domain/package";
import { taskService } from "../../service/task/taskService";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../lib/animations/upToDownAnimate";
import { LoadContext } from "../features/common/LoadContextProvider";
import useUrlState from "@ahooksjs/use-url-state";
import { Filter } from "../components/filter/Filter";
import { useTitle } from "ahooks";

const TopLine = styled(motion.div)`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const LinePackage = styled(motion(Grid))``;

const FilterLine = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const FilterContent = styled.div`
  display: flex;
  align-items: center;
  column-gap: 15px;
`;

type FilterType = 1 | 2 | 3 | 4 | 0;

export const PackageListPage: CT<unknown> = () => {
  const [list, setList] = useState<PackageType[]>([]);
  const loadContextData = useContext(LoadContext);
  const [urlState, setUrlState] = useUrlState<{
    filterBy: FilterType;
  }>({ filterBy: 0 });
  useTitle("Пакеты документов");
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

  const filterBy = (
    data: PackageType[],
    filterBy: FilterType
  ): PackageType[] => {
    if (filterBy === 0) return data;
    return data.filter((packageFile) => packageFile.status === filterBy);
  };

  const clickFilterHandler = (status: FilterType) => {
    setUrlState({ filterBy: status });
  };

  const filteredData = filterBy(list, Number(urlState.filterBy) as FilterType);

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
      <FilterLine
        {...upToDownAnimate}
        transition={{
          ease: ["easeInOut"],
          duration: 0.3,
          delay: 0.1,
        }}
      >
        <Typography fontWeight={"bold"}>Фильтры:&nbsp;&nbsp;&nbsp;</Typography>
        <FilterContent>
          <Filter
            onClick={clickFilterHandler}
            status={0}
            isActive={+urlState.filterBy === 0}
            title={"Все"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={2}
            isActive={+urlState.filterBy === 2}
            title={"Преобразован"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={1}
            isActive={+urlState.filterBy === 1}
            title={"В работе"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={4}
            isActive={+urlState.filterBy === 4}
            title={"Отменен"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={3}
            isActive={+urlState.filterBy === 3}
            title={"Ошибка"}
          />
        </FilterContent>
      </FilterLine>

      <Grid
        container
        rowSpacing={2}
        columnSpacing={10}
        justifyContent={"flex-start"}
      >
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
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
          })
        ) : (
          <Grid item xs={4}>
            <Typography variant={"h6"}>Пакеты не найдены</Typography>
          </Grid>
        )}
      </Grid>
    </PageTemplate>
  );
};
