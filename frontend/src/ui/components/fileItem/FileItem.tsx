import styled from "styled-components";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
  useTheme,
} from "@mui/material";
import {
  fileAbort,
  fileError,
  fileInWork,
  FileType,
} from "../../../domain/file";
import { motion } from "framer-motion";
import { upToDownFn } from "../../lib/animations/upToDownAnimate";
import { Link } from "react-router-dom";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { useAppDispatch } from "../../../service/store/store";
import { setViewFile } from "../../../service/store/file/fileViewSlice";
import { useRef, useState } from "react";
import { statusCatalog } from "../../../domain/status";
import { fileService } from "../../../service/file/fileService";

const Container = styled(motion(Paper))`
  padding: 20px;
  display: flex;
  min-height: 225px;
  justify-content: space-between;
  flex-direction: column;
  position: relative;

  & h6 {
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

const MenuLink = styled(Link)`
  color: black;

  &:active {
    color: black;
  }
`;

export const FileItem: CT<{ item: FileType; showAnimate: boolean }> = ({
  item,
  showAnimate,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const clickHandler = () => {
    dispatch(setViewFile(item));
  };

  const openHandler = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const abortHandler = () => {
    const solution = window.confirm(
      "Вы уверены, что хотите отменить преобразование файла?"
    );
    if (solution) {
      fileService.abort(item.id);
    }
  };

  return (
    <Container
      title={item.name}
      {...upToDownFn(showAnimate ? 0.6 : 0, showAnimate ? 0.6 : 0)}
    >
      <Typography
        style={{
          minHeight: 96,
        }}
        fontWeight={"bold"}
        variant={"h6"}
      >
        {item.name}
      </Typography>
      <Typography style={{ marginTop: 10 }} fontWeight={"bold"} variant={"h6"}>
        Статус:{" "}
        <span style={{ color: theme.palette.secondary.main }}>
          {statusCatalog[item.status]}
        </span>
      </Typography>
      {fileInWork(item) && (
        <div>
          <Button
            color={"warning"}
            style={{ marginTop: 10 }}
            variant={"contained"}
            onClick={abortHandler}
          >
            Отменить
          </Button>
        </div>
      )}
      {fileInWork(item) ||
        (fileAbort(item) && <div style={{ height: 32, marginTop: 10 }} />)}
      {!fileInWork(item) && !fileAbort(item) && (
        <div style={{ position: "relative" }}>
          <Button
            ref={anchorRef}
            onClick={openHandler}
            style={{ marginTop: 10 }}
            variant={"contained"}
            color={"secondary"}
            endIcon={<KeyboardArrowDownOutlined />}
          >
            Просмотр
          </Button>
          <Popper
            open={open}
            role={undefined}
            placement="bottom-start"
            transition
            style={{ zIndex: 111 }}
            anchorEl={anchorRef.current}
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      id="composition-menu"
                      aria-labelledby="composition-button"
                    >
                      {!fileError(item) && !fileAbort(item) && (
                        <>
                          <MenuItem onClick={handleClose}>
                            <MenuLink
                              to={`/compare/${item.task_id}/${item.id}/1`}
                              onClick={clickHandler}
                            >
                              Режим сравнения
                            </MenuLink>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <MenuLink
                              to={`/view/${item.task_id}/${item.id}/1`}
                              onClick={clickHandler}
                            >
                              Преобразованные файлы
                            </MenuLink>
                          </MenuItem>
                        </>
                      )}
                      <MenuItem onClick={handleClose}>
                        <MenuLink
                          to={`/initial/${item.task_id}/${item.id}/1`}
                          onClick={clickHandler}
                        >
                          Исходные файлы
                        </MenuLink>
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      )}
    </Container>
  );
};
