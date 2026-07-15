import { getDataSource } from "./config";
import { getJsonStore } from "./json/json-store";
import { getMysqlStore } from "./mysql/mysql-store";
import type { IJsonStore } from "./types";

let store: IJsonStore | null = null;

/** Returns the active data store — JSON file or MySQL, based on DATA_SOURCE env */
export function getStore(): IJsonStore {
  if (!store) {
    store = getDataSource() === "mysql" ? getMysqlStore() : getJsonStore();
  }
  return store;
}

export function resetStore() {
  store = null;
}
