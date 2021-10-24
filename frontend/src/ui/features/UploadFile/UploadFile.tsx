import styled from "styled-components";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Form = styled.form<{
  borderColor: string;
}>`
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
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

const CenterContent = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
`;
const TextDecoration = styled.span<{ color: string }>`
  text-align: center;
  color: ${(props) => props.color};
  text-decoration: underline;
  cursor: pointer;
`;

export const UploadFile: CT<{
  onLoad: (files: File[]) => void;
  isLoaded: boolean;
}> = ({ onLoad, isLoaded }) => {
  const theme = useTheme();
  const dropRef = useRef<null | HTMLLabelElement>(null);
  const [isDragEnter, setDragEnter] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
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
    setFiles(Array.from(e.dataTransfer!.files));
  };
  const dragOverHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    setDragEnter(true);
  };

  const loadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFiles(Array.from(files));
    }
  };

  const clickWrapperHandler = (
    e: React.MouseEvent<HTMLLabelElement, MouseEvent>
  ) => {
    if (files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  useEffect(() => {
    if (!dropRef) return;
    dropRef.current!.addEventListener("dragenter", dragEnterHandler);
    dropRef.current!.addEventListener("dragleave", dragLeaveHandler);
    dropRef.current!.addEventListener("drop", dragDropHandler);
    dropRef.current!.addEventListener("dragover", dragOverHandler);
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

  useEffect(() => {
    onLoad(files);
  }, [files]);

  const loadAnimate = !isLoaded
    ? {
        initial: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        },
        animate: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        },
        transition: {
          duration: 0,
          delay: 0,
        },
      }
    : {
        initial: {
          top: "50%",
          left: "0",
          opacity: "0 !important",
          transform: "translate(-50%,-50%)",
        },
        animate: {
          top: "50%",
          left: "25px",
          transform: "translate(0%,-50%)",
        },
        transition: {
          duration: 0.6,
          delay: 0.5,
        },
      };

  return (
    <Form
      style={{ opacity: isDragEnter ? 0.2 : 1 }}
      borderColor={greyColor}
      action=""
    >
      <InputFileWrapper onClick={clickWrapperHandler} ref={dropRef}>
        <InputFile
          onChange={loadFileHandler}
          id={"upload-wrapper"}
          maxLength={1001}
          type={"file"}
          multiple
        />
        <CenterContent {...loadAnimate}>
          {!isLoaded ? (
            <Grid container justifyContent={"center"} justifyItems={"center"}>
              <Grid item xs={12}>
                <Box display={"flex"} justifyContent={"center"}>
                  <FileDownloadOutlined
                    style={{ fill: greyColor, width: "100px", height: "100px" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign={"center"} variant={"h5"}>
                  <TextDecoration color={accentColor}>Загрузите</TextDecoration>{" "}
                  или перенесите файлы (.pdf,.word,.jpg,.png,...)
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container>
              <Grid>
                <Typography variant={"h5"}>
                  <TextDecoration color={accentColor}>
                    Выбранные файлы
                  </TextDecoration>
                  : {files.length}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CenterContent>
      </InputFileWrapper>
    </Form>
  );
};
