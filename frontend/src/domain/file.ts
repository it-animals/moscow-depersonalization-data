export type FileType = {
  id: number;
  task_id: number;
  date_start: number;
  date_end: number | null;
  status: 1 | 2 | 3; //(1 — в работе, 2 — преобразован, 3 — провал)
  base_path: string;
  name: string;
  result_path: string;
  image_path: string;
};
