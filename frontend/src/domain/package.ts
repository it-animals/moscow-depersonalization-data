import { FileType } from "./file";

export type PackageType = {
  id: number;
  date_start: string;
  date_end: string | null;
  status: 1 | 2 | 3; //      (1 — в работе, 2 — преобразован, 3 — провал)
  files: FileType[];
};
