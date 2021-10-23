export type FileType = {
  id: number;
  task_id: number;
  date_start: string;
  date_end: number | null;
  status: 1 | 2 | 3 | 4; //(1 — в работе, 2 — преобразован, 3 — провал)
  base_path: string | null;
  name: string;
  result_path: string | null;
  image_path: string | null;
  image_pages: number; // количество преобразованных картинок
};

export const fileInWork = (file: FileType) => file.status === 1;
export const fileCompleted = (file: FileType) => file.status === 2;
export const fileError = (file: FileType) => file.status === 3;
export const fileAbort = (file: FileType) => file.status === 4;
