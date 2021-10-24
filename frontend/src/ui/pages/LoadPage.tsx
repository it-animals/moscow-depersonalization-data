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
  clearAllPackage,
  selectPackage,
  setPackage,
} from "../../service/store/package/packageSlice";
import { FileList } from "../features/FileList/FileList";
import { Link, useHistory, useParams } from "react-router-dom";
import { packageCompleted } from "../../domain/package";
import { PackageStatus } from "../components/packageStatus/PackageStatus";
import { TimeoutId } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";
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

const TopLine = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const LoadPage: CT<unknown> = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processLoad, setProcessLoad] = useState(false);

  const dispath = useAppDispatch();
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
    history.push(`/package/${data.data.task_id}`);
  };

  useEffect(() => {
    dispath(clearAllPackage());
  }, []);
  useTitle("Создать пакет");
  return (
    <PageTemplate>
      <TopLine>
        <Link to={"/"}>
          <Button variant={"contained"}>К списку пакетов</Button>
        </Link>
      </TopLine>
      <UploadContainer {...uploadAnimate}>
        <UploadFile isLoaded={!!files.length} onLoad={loadFileHandler} />
        {processLoad && <FormLoader />}
      </UploadContainer>
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
    </PageTemplate>
  );
};
