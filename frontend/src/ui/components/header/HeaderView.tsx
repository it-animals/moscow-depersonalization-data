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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderView: CT<unknown> = () => {
  const history = useHistory();
  const params = useParams<{ id: string; pageNum: string }>();

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1111 }}>
      <Box>
        <AppBar color={"default"} position="static">
          <Toolbar>
            <Wrapper>
              <Link to={"/"}>
                <Button variant={"contained"}>Назад к файлам</Button>
              </Link>
              <div>
                <Pagination
                  count={10}
                  onChange={(event, page) => {
                    history.push({
                      pathname: `/view/${params.id}/${page}`,
                    });
                  }}
                  color="secondary"
                />
              </div>
              <Typography variant={"h6"}>FileName</Typography>
            </Wrapper>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
