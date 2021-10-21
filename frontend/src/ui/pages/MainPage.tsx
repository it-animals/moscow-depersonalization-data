import { PageTemplate } from "../components/templates/PageTemplate";
import { UploadFile } from "../features/UploadFile/UploadFile";
import styled from "styled-components";
import { Button, Grid, Paper, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { fileService } from "../../service/file/fileService";
import { motion } from "framer-motion";
import { upToDownAnimate } from "../lib/animations/upToDownAnimate";
import { uploadFileAnimate } from "../lib/animations/uploadFileAnimate";
import { Loader } from "../components/loader/Loader";
import { taskService } from "../../service/task/taskService";
import { useAppDispatch, useAppSelector } from "../../service/store/store";
import {
  selectPackage,
  setPackage,
} from "../../service/store/package/packageSlice";
import { FileList } from "../features/FileList/FileList";
import { useHistory, useParams } from "react-router-dom";
import { packageCompleted } from "../../domain/package";
import { PackageStatus } from "../components/packageStatus/PackageStatus";

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

export const MainPage: CT<unknown> = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processLoad, setProcessLoad] = useState(false);

  const params = useParams<{ packageId?: string }>();

  const dispath = useAppDispatch();
  const packageFiles = useAppSelector(selectPackage);
  const history = useHistory();

  const uploadAnimate = !!files.length
    ? uploadFileAnimate.haveFiles
    : uploadFileAnimate.notFiles;

  const loadFileHandler = (files: File[]) => {
    setFiles(files);
  };

  const clearHandler = () => {
    setFiles([]);
  };

  const submitHandler = async () => {
    setProcessLoad(true);
    const data = await fileService.upload(files);
    const idPackage = data.data.task_id;
    history.push(`/${data.data.task_id}`);
  };

  useEffect(() => {
    if (!params.packageId) return;
    if (isNaN(Number(params.packageId))) {
      history.push("/");
    }
    const load = async () => {
      try {
        const task = await taskService.view(Number(params.packageId));
        dispath(setPackage(task.data));
        if (task.data.status !== 2) {
          setTimeout(load, 1500);
        }
      } catch (e) {
        console.log(e);
        history.push("/");
      }
    };
    load();
  }, [params]);
  console.log(params);

  return (
    <PageTemplate>
      {<PackageStatus packageFile={packageFiles ?? null} />}
      {!params.packageId && (
        <UploadContainer {...uploadAnimate}>
          <UploadFile isLoaded={!!files.length} onLoad={loadFileHandler} />
          {processLoad && <FormLoader />}
        </UploadContainer>
      )}

      {!!files.length && !processLoad && (
        <ButtonPanel
          initial={upToDownAnimate.initial}
          animate={upToDownAnimate.animate}
          transition={upToDownAnimate.transition}
        >
          <Button
            color={"secondary"}
            variant={"contained"}
            onClick={submitHandler}
          >
            Обработать
          </Button>
          <Button onClick={clearHandler} variant={"contained"}>
            Сбросить
          </Button>
        </ButtonPanel>
      )}
      {packageFiles && <FileList />}
    </PageTemplate>
  );
};
