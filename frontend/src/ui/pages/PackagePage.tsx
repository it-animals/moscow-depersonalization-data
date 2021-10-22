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
  margin-bottom: 20px;
`;

export const PackagePage: CT<unknown> = () => {
  let timeout: TimeoutId;
  const params = useParams<{ packageId?: string }>();

  const dispath = useAppDispatch();
  const packageFiles = useAppSelector(selectPackage);
  const history = useHistory();

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
          timeout = setTimeout(load, 1500);
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
      clearTimeout(timeout);
      dispath(clearAllPackage());
    };
  }, []);

  console.log(history.location.pathname);
  return (
    <PageTemplate>
      <TopLine>
        <Link to={"/"}>
          <Button variant={"contained"}>К списку пакетов</Button>
        </Link>
        <Link to={"/load/"}>
          <Button color={"secondary"} variant={"contained"}>
            Создать пакет
          </Button>
        </Link>
      </TopLine>
      {<PackageStatus packageFile={packageFiles ?? null} />}

      {packageFiles && history.location.pathname !== "/load/" && <FileList />}
    </PageTemplate>
  );
};
