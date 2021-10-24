import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PackageType } from "../../../domain/package";

const mock = {
  id: 1,
  date_start: "21.10.2021 12:52:05 UTC",
  date_end: null,
  status: 3,
  files: [
    {
      id: 1,
      task_id: 1,
      name: "Frame 18298 — копия 2.png",
      date_start: "21.10.2021 12:52:05 UTC",
      date_end: null,
      status: 1,
      base_path: "/app/files/0/1/Frame 18298 — копия 2.png",
      result_path: null,
      image_path: null,
    },
    {
      id: 2,
      task_id: 1,
      name: "Frame 18298 — копия 3.png",
      date_start: "21.10.2021 12:52:05 UTC",
      date_end: null,
      status: 2,
      base_path: "/app/files/0/2/Frame 18298 — копия 3.png",
      result_path: null,
      image_path: null,
    },
    {
      id: 3,
      task_id: 1,
      name: "Frame 18298 — копия 4.png",
      date_start: "21.10.2021 12:52:05 UTC",
      date_end: null,
      status: 3,
      base_path: "/app/files/0/3/Frame 18298 — копия 4.png",
      result_path: null,
      image_path: null,
    },
  ],
};

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
