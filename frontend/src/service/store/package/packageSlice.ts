import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PackageType } from "../../../domain/package";

const initialState = {
  package: null,
  filteredPackage: null,
} as { package: PackageType | null; filteredPackage: PackageType | null };

export const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackage(state, action: PayloadAction<PackageType>) {
      state.package = action.payload;
    },
    filterPackage(state, action: PayloadAction<string>) {
      state.filteredPackage = {
        ...state.package!,
        files: state.package!.files.filter((file) =>
          file.name.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };
    },
    clearPackage(state) {
      state.package = null;
    },
    clearFilter(state) {
      state.filteredPackage = null;
    },
    clearAllPackage(state) {
      return {
        package: null,
        filteredPackage: null,
      };
    },
  },
});

export const {
  setPackage,
  clearPackage,
  filterPackage,
  clearFilter,
  clearAllPackage,
} = packageSlice.actions;
export default packageSlice.reducer;

export const selectPackage = (state: RootState) => state.package.package;
export const selectFilterPackage = (state: RootState) =>
  state.package.filteredPackage;
