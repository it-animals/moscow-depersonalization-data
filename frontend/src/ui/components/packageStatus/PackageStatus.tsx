import styled from "styled-components";
import {
  packageAbort,
  packageCompleted,
  packageError,
  packageInWork,
  PackageType,
} from "../../../domain/package";
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { fileAbort, fileError } from "../../../domain/file";
import { useRef, useState } from "react";
import { appConfig } from "../../../config";
import { Link } from "react-router-dom";

const Status = styled.div`
  width: 100%;
  height: 50px;
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MenuLink = styled.a`
  color: black;

  &:active {
    color: black;
  }
`;

export const PackageStatus: CT<{ packageFile: PackageType | null }> = ({
  packageFile,
}) => {
  const Download: CT<{ item: PackageType }> = ({ item }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const openHandler = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    if (!packageCompleted(item)) return <></>;
    return (
      <div>
        <Button
          ref={anchorRef}
          endIcon={<KeyboardArrowDownOutlined />}
          color={"success"}
          variant={"contained"}
          onClick={openHandler}
        >
          Скачать пакет документов
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
                    <MenuItem onClick={handleClose}>
                      <MenuLink
                        href={`${appConfig.apiUrl}task/download?id=${item.id}&pdf=0`}
                      >
                        в .jpeg формате
                      </MenuLink>
                    </MenuItem>

                    <MenuItem onClick={handleClose}>
                      <MenuLink
                        href={`${appConfig.apiUrl}task/download?id=${item.id}&pdf=1`}
                      >
                        в .pdf формате
                      </MenuLink>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  };

  if (!packageFile) {
    return <></>;
  }
  if (packageAbort(packageFile)) {
    return (
      <Status>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакет документов №{packageFile.id}. Обработка отменена
        </Typography>
        <Download item={packageFile} />
      </Status>
    );
  }
  if (packageError(packageFile)) {
    return (
      <Status>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакет документов №{packageFile.id} преобразован с ошибками
        </Typography>
        <Download item={packageFile} />
      </Status>
    );
  }
  if (packageInWork(packageFile)) {
    return (
      <Status>
        <Typography
          style={{ textDecoration: "underline" }}
          color={"secondary.main"}
          variant={"h5"}
        >
          Пакет документов №{packageFile.id} находится в обработке
        </Typography>
        <Download item={packageFile} />
      </Status>
    );
  }
  return (
    <Status>
      <Typography
        style={{ textDecoration: "underline" }}
        color={"secondary.main"}
        variant={"h5"}
      >
        Пакет документов №{packageFile.id} успешно преобразован
      </Typography>
      <Download item={packageFile} />
    </Status>
  );
};
