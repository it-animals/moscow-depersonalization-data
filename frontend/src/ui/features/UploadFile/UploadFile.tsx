import styled from "styled-components";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

const Form = styled.form<{
  borderColor: string;
}>`
  width: 100%;
  height: 100%;
  border: 3px dashed ${(props) => props.borderColor};
  border-radius: 15px;
`;

const InputFileWrapper = styled.label`
  width: 100%;
  display: block;
  height: 100%;
  position: relative;
`;
const InputFile = styled.input`
  display: none;
`;
const TextContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const TextDecoration = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  text-decoration: underline;
  cursor: pointer;
`;

export const UploadFile = () => {
  const theme = useTheme();
  const dropRef = useRef<null | HTMLFormElement>(null);
  const [isDragEnter, setDragEnter] = useState(false);

  const greyColor = theme.palette.grey["400"];
  const accentColor = theme.palette.secondary.main;

  const dragEnterHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnter(true);
  };

  const dragLeaveHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnter(false);
  };

  const dragDropHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    setDragEnter(false);
    console.log(e.dataTransfer!.files[0]);
  };

  useEffect(() => {
    if (!dropRef) return;
    dropRef.current!.addEventListener("dragenter", dragEnterHandler);
    dropRef.current!.addEventListener("dragleave", dragLeaveHandler);
    dropRef.current!.addEventListener("drop", dragDropHandler);
    window.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
    window.addEventListener(
      "dragover",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }, [dropRef]);

  return (
    <Form
      style={{ opacity: isDragEnter ? 0.2 : 1 }}
      ref={dropRef}
      borderColor={greyColor}
      action=""
    >
      <InputFileWrapper>
        <InputFile id={"upload-wrapper"} type={"file"} />
        <TextContent>
          <Grid container justifyContent={"center"} justifyItems={"center"}>
            <Grid xs={12}>
              <Box display={"flex"} justifyContent={"center"}>
                <FileDownloadOutlined
                  style={{ fill: greyColor, width: "100px", height: "100px" }}
                />
              </Box>
            </Grid>
            <Grid>
              <Typography variant={"h5"}>
                <TextDecoration color={accentColor}>Загрузите</TextDecoration>{" "}
                или перетащите файлы
              </Typography>
            </Grid>
          </Grid>
        </TextContent>
      </InputFileWrapper>
    </Form>
  );
};
