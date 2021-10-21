import axios from "axios";
import { PackageType } from "../../domain/package";

export const taskService = {
  path: "task/",

  view(id: PackageType["id"]) {
    return axios.get<PackageType>(this.path + `view?id=${id}`);
  },

  list() {
    return axios.get<PackageType[]>(this.path + "list");
  },
};
