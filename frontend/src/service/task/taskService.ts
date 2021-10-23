import axios from "axios";
import { PackageType } from "../../domain/package";

export const taskService = {
  path: "task/",
  token: axios.CancelToken,
  source: axios.CancelToken.source(),
  updateToken() {
    this.token = axios.CancelToken;
    this.source = axios.CancelToken.source();
  },
  view(id: PackageType["id"]) {
    this.updateToken();
    return axios.get<PackageType>(this.path + `view?id=${id}`, {
      cancelToken: this.source.token,
    });
  },

  list() {
    this.updateToken();
    return axios.get<PackageType[]>(this.path + "list");
  },

  stop() {
    this.source.cancel("stop");
    this.updateToken();
  },
};
