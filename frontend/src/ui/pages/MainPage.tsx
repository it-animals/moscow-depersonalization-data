import { PageTemplate } from "../components/templates/PageTemplate";
import { UploadFile } from "../features/UploadFile/UploadFile";
import styled from "styled-components";
import { Button, Grid, Paper, useTheme } from "@mui/material";
import { useState } from "react";
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
import { FileItem } from "../components/fileItem/FileItem";

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

  const dispath = useAppDispatch();
  const packageFiles = useAppSelector(selectPackage);

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
    const task = await taskService.view(idPackage);
    dispath(setPackage(task.data));
  };

  return (
    <PageTemplate>
      {!packageFiles && (
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
      {packageFiles && (
        <Grid
          container
          rowSpacing={5}
          columnSpacing={10}
          justifyContent={"flex-start"}
        >
          {packageFiles.files.map((item) => (
            <Grid item xs={3} key={item.id}>
              <FileItem item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </PageTemplate>
  );
};
