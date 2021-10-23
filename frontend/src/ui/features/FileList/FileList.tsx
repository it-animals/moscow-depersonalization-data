import { useAppDispatch, useAppSelector } from "../../../service/store/store";
import {
  clearFilter,
  filterPackage,
  selectFilterPackage,
  selectPackage,
} from "../../../service/store/package/packageSlice";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FileItem } from "../../components/fileItem/FileItem";
import styled from "styled-components";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import { upToDownAnimate } from "../../lib/animations/upToDownAnimate";
import { useEffect, useState } from "react";
import { fileService } from "../../../service/file/fileService";

const SearchLine = styled(motion.div)`
  min-height: 60px;
  width: 100%;
  margin-bottom: 45px;
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  width: 210px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const Count = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

export const FileList: CT<unknown> = () => {
  const [inputSearch, setInputSearch] = useState("");
  const [existSearch, setExitSearch] = useState(false);

  const packageFiles = useAppSelector(selectPackage);
  const filteredFiles = useAppSelector(selectFilterPackage);
  const dispatch = useAppDispatch();

  const data = filteredFiles ? filteredFiles : packageFiles;

  const changeSearchHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInputSearch(e.currentTarget.value);
  };

  const searchClickHandler = () => {
    if (!inputSearch.length) return;
    dispatch(filterPackage(inputSearch));
    setExitSearch(true);
  };

  const clearSearchHandler = () => {
    dispatch(clearFilter());
    setInputSearch("");
  };

  if (!data) return <></>;

  return (
    <>
      <SearchLine
        {...upToDownAnimate}
        transition={{
          delay: !existSearch ? 0.3 : 0,
          duration: !existSearch ? 0.3 : 0,
          ease: ["easeInOut"],
        }}
      >
        <Box sx={{ width: "70%", display: "flex", alignItems: "flex-end" }}>
          <SearchIcon sx={{ color: "second.main", mr: 1, my: 0.5 }} />
          <TextField
            onChange={changeSearchHandler}
            value={inputSearch}
            color={"primary"}
            fullWidth
            inputProps={{
              style: { fontSize: 18 },
            }}
            id="input-with-sx"
            label="Поиск по названию файла"
            variant="standard"
          />
        </Box>
        <ButtonWrapper>
          <Button variant={"contained"} onClick={searchClickHandler}>
            Поиск
          </Button>
          <Button
            onClick={clearSearchHandler}
            color={"secondary"}
            variant={"contained"}
          >
            Сбросить
          </Button>
        </ButtonWrapper>
      </SearchLine>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={10}
        justifyContent={"flex-start"}
      >
        {data!.files.map((item) => (
          <Grid item xs={4} key={item.id}>
            <FileItem showAnimate={!existSearch} item={item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
