import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { upToDownFn } from "../lib/animations/upToDownAnimate";
import { taskService } from "../../service/task/taskService";
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import {
  clearAllPackage,
  selectPackage,
  setPackage,
} from "../../service/store/package/packageSlice";
import { FileList } from "../features/FileList/FileList";
import { useHistory, useParams } from "react-router-dom";
import { PackageStatus } from "../components/packageStatus/PackageStatus";
import { loadContextData } from "../features/common/LoadContextProvider";
import { useTitle } from "ahooks";

const TopLine = styled(motion.div)`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatusWrapper = styled(motion.div)`
  display: flex;
`;

export const PackagePage: CT<unknown> = () => {
  const params = useParams<{ packageId?: string }>();
  const dispath = useAppDispatch();
  const packageFiles = useAppSelector(selectPackage);
  const history = useHistory();

  useTitle("Просмотр пакета");

  const stopRequest = useCallback(() => {
    loadContextData.clearLoad();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!params.packageId) return;
    if (isNaN(Number(params.packageId))) {
      history.push("/load/");
    }
    const load = async () => {
      try {
        const task = await taskService.view(Number(params.packageId));
        dispath(setPackage(task.data));
        if (task.data.status === 1) {
          loadContextData.setLoad(setTimeout(load, 1500));
        }
      } catch (e) {
        console.log(e);
        history.push("/load/");
      }
    };
    load();
    //eslint-disable-next-line
  }, [params]);

  useEffect(() => {
    dispath(clearAllPackage());
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      loadContextData.clearLoad();
      dispath(clearAllPackage());
    };
    //eslint-disable-next-line
  }, []);

  return (
    <PageTemplate>
      <TopLine {...upToDownFn(0.22, 0)}>
        <a href={"/"}>
          <Button
            variant={"contained"}
            onClick={() => {
              taskService.stop();
              loadContextData.clearLoad();
            }}
          >
            К списку пакетов
          </Button>
        </a>
        <a href={"/load/"}>
          <Button
            color={"secondary"}
            onClick={() => {
              taskService.stop();
              loadContextData.clearLoad();
            }}
            variant={"contained"}
          >
            Создать пакет
          </Button>
        </a>
      </TopLine>
      {
        <StatusWrapper {...upToDownFn(0.22, 0)}>
          <PackageStatus packageFile={packageFiles ?? null} />
        </StatusWrapper>
      }

      {packageFiles && history.location.pathname !== "/load/" && (
        <FileList onClickFilter={stopRequest} />
      )}
    </PageTemplate>
  );
};
