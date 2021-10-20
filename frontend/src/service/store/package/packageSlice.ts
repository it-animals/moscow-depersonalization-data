import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AppError } from "../../../domain/appError";
import { PackageType } from "../../../domain/package";

const initialState = null as PackageType | null;

export const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackage(state, action: PayloadAction<PackageType>) {
      return action.payload;
    },
    clearAppError(state) {
      return null;
    },
  },
});

export const { setPackage, clearAppError } = packageSlice.actions;
export default packageSlice.reducer;

export const selectPackage = (state: RootState) => state.package;
