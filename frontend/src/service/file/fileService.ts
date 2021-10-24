import axios from "axios";

export const fileService = {
  path: "file/",

  upload(files: File[]) {
    const data = new FormData();
    files.forEach((file) => {
      data.append("files[]", file);
    });
    return axios.post<{ task_id: number }>(this.path + "upload", data);
  },
  preview(id: number, page: number) {
    ///v1/file/preview?id=1&page=0
    return axios.get<any>(this.path + `preview?id=${id}&page=${page}`);
  },
  abort(id: number) {
    ///v1/file/cancel?id=1
    return axios.get(this.path + `cancel?id=${id}`);
  },
};
