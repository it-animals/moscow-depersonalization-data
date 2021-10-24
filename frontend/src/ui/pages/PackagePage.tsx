import { PageTemplate } from "../components/templates/PageTemplate";
import styled from "styled-components";
import { Button, Paper } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../lib/animations/upToDownAnimate";
import { Loader } from "../components/loader/Loader";
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
import {
  LoadContext,
  loadContextData,
  LoadContextType,
} from "../features/common/LoadContextProvider";
import { useTitle } from "ahooks";

const UploadContainer = styled(motion(Paper))`
  width: 100%;
  height: 540px;
  position: relative;
  padding: 20px;
`;

const ButtonPanel = styled(motion.div)`
  display: flex;
  min-height: 50px;
  justify-content: flex-end;
  align-items: center;
  column-gap: 20px;
`;

const FormLoader = styled(Loader)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
`;

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
  const contextLoad = useContext<LoadContextType>(LoadContext);
  const params = useParams<{ packageId?: string }>();

  const dispath = useAppDispatch();
  const packageFiles = useAppSelector(selectPackage);
  const history = useHistory();
  useTitle("Просмотр пакета");

  const stopRequest = useCallback(() => {
    loadContextData.clearLoad();
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
  }, [params]);

  useEffect(() => {
    dispath(clearAllPackage());
  }, []);

  useEffect(() => {
    return () => {
      loadContextData.clearLoad();
      dispath(clearAllPackage());
    };
  }, []);

  return (
    <PageTemplate>
      <TopLine
        {...upToDownAnimate}
        transition={{
          delay: 0,
          duration: 0.3,
          ease: ["easeIn"],
        }}
      >
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
        <StatusWrapper
          {...upToDownAnimate}
          transition={{
            delay: 0.0,
            duration: 0.3,
            ease: ["easeIn"],
          }}
        >
          <PackageStatus packageFile={packageFiles ?? null} />
        </StatusWrapper>
      }

      {packageFiles && history.location.pathname !== "/load/" && (
        <FileList onClickFilter={stopRequest} />
      )}
    </PageTemplate>
  );
};
