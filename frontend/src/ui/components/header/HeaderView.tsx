import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Pagination,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  selectCountImages,
  selectViewFile,
} from "../../../service/store/file/fileViewSlice";
import { useAppDispatch, useAppSelector } from "../../../service/store/store";
import { useEffect } from "react";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleName = styled(Typography)`
  max-width: 780px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

export const HeaderView: CT<unknown> = () => {
  const history = useHistory();
  const params = useParams<{ id: string; image: string }>();
  const countImages = useAppSelector(selectCountImages);
  const fileView = useAppSelector(selectViewFile);

  useEffect(() => {
    if (!countImages) return;
    if (isNaN(Number(params.image))) history.push("/");
    if (isNaN(Number(params.id))) history.push("/");
    if (countImages < Number(params.image)) {
      history.push({
        pathname: `/view/${params.id}/1`,
      });
    }
  }, [params, countImages]);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1111 }}>
      <Box>
        <AppBar color={"default"} position="static">
          <Toolbar>
            <Wrapper>
              <Link to={fileView ? `/package/${fileView.task_id}` : "/"}>
                <Button variant={"contained"}>Назад к файлам</Button>
              </Link>
              <div>
                <Pagination
                  count={countImages ?? 0}
                  onChange={(event, page) => {
                    history.push({
                      pathname: `/view/${params.id}/${page}`,
                    });
                  }}
                  color="secondary"
                />
              </div>
              <TitleName variant={"h6"}>{fileView?.name ?? ""}</TitleName>
            </Wrapper>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
