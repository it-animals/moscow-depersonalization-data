import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AppError } from "../../../domain/appError";

export type AppStateType = {
  error: AppError | null;
};

const initialState = {
  error: null,
} as AppStateType;

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError(state, action: PayloadAction<AppError>) {
      state.error = action.payload;
    },
    clearAppError(state) {
      state.error = null;
    },
  },
});

export const { setAppError, clearAppError } = appSlice.actions;
export default appSlice.reducer;

export const selectAppError = (state: RootState) => state.app.error;
