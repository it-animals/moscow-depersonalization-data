import { FileType } from "./file";

export type PackageType = {
  id: number;
  date_start: string;
  date_end: string | null;
  status: 1 | 2 | 3 | 4; //      (1 — в работе, 2 — преобразован, 3 — провал, 4 - отменен)
  files: FileType[];
  onlyFio: boolean;
};

export const packageInWork = (file: PackageType) => file.status === 1;
export const packageCompleted = (file: PackageType) => file.status === 2;
export const packageError = (file: PackageType) => file.status === 3;
export const packageAbort = (file: PackageType) => file.status === 4;

export const packageOnlyFio = (file: PackageType) => file.onlyFio;
