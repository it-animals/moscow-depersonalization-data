import { useAppDispatch, useAppSelector } from "../../../service/store/store";
import {
  clearFilter,
  filterPackage,
  selectFilterPackage,
  selectPackage,
} from "../../../service/store/package/packageSlice";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { FileItem } from "../../components/fileItem/FileItem";
import styled from "styled-components";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import { upToDownFn } from "../../lib/animations/upToDownAnimate";
import { useState } from "react";
import useUrlState from "@ahooksjs/use-url-state";
import { Filter } from "../../components/filter/Filter";
import { PackageType } from "../../../domain/package";

const SearchLine = styled(motion.div)`
  min-height: 60px;
  width: 100%;
  margin-bottom: 45px;
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

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

const ButtonWrapper = styled.div`
  width: 210px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

type FilterType = 1 | 2 | 3 | 4 | 0;

export const FileList: CT<{ onClickFilter: VoidFunction }> = ({
  onClickFilter,
}) => {
  const [urlState, setUrlState] = useUrlState<{
    filterBy: FilterType;
  }>({ filterBy: 0 });
  const [inputSearch, setInputSearch] = useState("");
  const [existSearch, setExitSearch] = useState(false);
  const [wasClickFilter, setClickFilter] = useState(false);

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

  const clickFilterHandler = (status: FilterType) => {
    onClickFilter();
    setUrlState({ filterBy: status });
    setClickFilter(true);
  };

  const filterBy = (data: PackageType, filterBy: FilterType): PackageType => {
    if (filterBy === 0) return data;
    return {
      ...data,
      files: data.files.filter((file) => file.status === filterBy),
    };
  };

  const filteredData = filterBy(data, Number(urlState.filterBy) as FilterType);

  return (
    <>
      <SearchLine {...upToDownFn(!existSearch ? 0.3 : 0, !existSearch ? 0 : 0)}>
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
            label="?????????? ???? ???????????????? ??????????"
            variant="standard"
          />
        </Box>
        <ButtonWrapper>
          <Button variant={"contained"} onClick={searchClickHandler}>
            ??????????
          </Button>
          <Button
            onClick={clearSearchHandler}
            color={"secondary"}
            variant={"contained"}
          >
            ????????????????
          </Button>
        </ButtonWrapper>
      </SearchLine>
      <FilterLine {...upToDownFn(0.3, 0.3)}>
        <Typography fontWeight={"bold"}>??????????????:&nbsp;&nbsp;&nbsp;</Typography>
        <FilterContent>
          <Filter
            onClick={clickFilterHandler}
            status={0}
            isActive={+urlState.filterBy === 0}
            title={"??????"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={1}
            isActive={+urlState.filterBy === 1}
            title={"?? ????????????"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={2}
            isActive={+urlState.filterBy === 2}
            title={"????????????????????????"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={4}
            isActive={+urlState.filterBy === 4}
            title={"??????????????"}
          />
          <Filter
            onClick={clickFilterHandler}
            status={3}
            isActive={+urlState.filterBy === 3}
            title={"????????????"}
          />
        </FilterContent>
      </FilterLine>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={10}
        justifyContent={"flex-start"}
      >
        {filteredData.files.length > 0 ? (
          filteredData!.files.map((item) => (
            <Grid item xs={4} key={item.id}>
              <FileItem
                showAnimate={!(existSearch || wasClickFilter)}
                item={item}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={4}>
            <Typography variant={"h6"}>?????????? ???? ??????????????</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};
