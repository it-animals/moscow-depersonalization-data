import { PageTemplate } from "../components/templates/PageTemplate";
import { UploadFile } from "../features/UploadFile/UploadFile";
import styled from "styled-components";
import {
  Alert,
  Button,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fileService } from "../../service/file/fileService";
import { motion } from "framer-motion";
import { upToDownFn } from "../lib/animations/upToDownAnimate";
import { uploadFileAnimate } from "../lib/animations/uploadFileAnimate";
import { Loader } from "../components/loader/Loader";
import { useAppDispatch } from "../../service/store/store";
import { clearAllPackage } from "../../service/store/package/packageSlice";
import { Link, useHistory } from "react-router-dom";
import { useTitle } from "ahooks";

const UploadContainer = styled(motion(Paper))`
  width: 100%;
  height: 540px;
  position: relative;
  padding: 20px;
`;

const ButtonPanel = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
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

const SelectLine = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: flex-end;
`;

const SpecialAlert = styled(motion(Alert))`
  margin-top: 15px;

  & ul {
    & li {
      list-style: disc;
    }
  }
`;

const parsedType = [
  {
    value: "Экспериментальный",
    id: 1,
  },
  {
    value: "Только ФИО",
    id: 2,
  },
];

export const LoadPage: CT<unknown> = () => {
  useTitle("Создать пакет");

  const [files, setFiles] = useState<File[]>([]);

  const [processLoad, setProcessLoad] = useState(false);
  const dispatch = useAppDispatch();

  const [selectValue, setSelectValue] = useState({
    value: "Экспериментальный",
    id: 1,
  });

  const [wasAnimate, setWasAnimate] = useState(false);

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
    history.push(`/package/${data.data.task_id}`);
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    const string = e.target.value;
    const val = parsedType.find((item) => item.value === string);
    setSelectValue(val!);
  };

  useEffect(() => {
    setTimeout(() => {
      setWasAnimate(true);
    }, 2000);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    dispatch(clearAllPackage());
    //eslint-disable-next-line
  }, []);
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
        <>
          <SelectLine>
            <Typography marginRight={"15px"} fontWeight={"bold"}>
              Способ обработки
            </Typography>
            <Select
              displayEmpty
              onChange={handleChange}
              value={selectValue.value}
              input={<OutlinedInput />}
              inputProps={{ "aria-label": "Without label" }}
            >
              {parsedType.map(({ value, id }) => (
                <MenuItem key={id} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </SelectLine>
          {selectValue.id === 1 && (
            <SpecialAlert
              {...upToDownFn(wasAnimate ? 0 : 0.4, wasAnimate ? 0 : 0.6)}
              severity="info"
            >
              <Typography fontWeight={"bold"}>
                Обработка файлов находится в экспериментальном режиме
              </Typography>
              <br />
              <Typography> Добавлено:</Typography>
              <ul>
                <li>
                  <Typography>Поиск и удаление email, телефонов;</Typography>
                </li>
                <li>
                  <Typography>Поиск и удаление адресов</Typography>
                </li>
              </ul>
            </SpecialAlert>
          )}
          {selectValue.id === 2 && (
            <SpecialAlert severity="info">
              <Typography fontWeight={"bold"}>
                Обработка файлов находится в режиме фио
              </Typography>
              <Typography>
                {" "}
                Обработка будет происходить в стандартном режиме
              </Typography>
            </SpecialAlert>
          )}
          <ButtonPanel {...upToDownFn(0.4, 0.8)}>
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
        </>
      )}
    </PageTemplate>
  );
};
