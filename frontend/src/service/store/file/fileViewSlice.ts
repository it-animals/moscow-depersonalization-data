import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FileType } from "../../../domain/file";

const initialState = null as FileType | null;

export const packageSlice = createSlice({
  name: "viewFile",
  initialState,
  reducers: {
    setViewFile: (state, action: PayloadAction<FileType>) => {
      return action.payload;
    },
    clearViewFile: (state) => {
      return null;
    },
  },
});

export const { clearViewFile, setViewFile } = packageSlice.actions;
export default packageSlice.reducer;

export const selectViewFile = (state: RootState) => state.viewFile;
export const selectCountImages = (state: RootState) =>
  state.viewFile?.image_pages ?? null;
