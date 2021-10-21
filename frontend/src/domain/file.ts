export type FileType = {
  id: number;
  task_id: number;
  date_start: string;
  date_end: number | null;
  status: 1 | 2 | 3; //(1 — в работе, 2 — преобразован, 3 — провал)
  base_path: string | null;
  name: string;
  result_path: string | null;
  image_path: string | null;
};

export const fileInWork = (file: FileType) => file.status === 1;

export const fileCompleted = (file: FileType) => file.status === 2;

export const fileError = (file: FileType) => file.status === 3;
