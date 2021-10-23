import { createContext, useState } from "react";

export type LoadContextType = {
  clearLoad: VoidFunction;
  load: NodeJS.Timeout | null;
  setLoad: (timeout: NodeJS.Timeout) => void;
};

export const loadContextData: LoadContextType = {
  load: null,
  clearLoad() {
    if (!this?.load) return;
    clearTimeout(this.load);
    this.load = null;
  },
  setLoad(timeout: NodeJS.Timeout) {
    this.load = timeout;
  },
};
export const LoadContext = createContext(loadContextData);

export const LoadContextProvider: CT<unknown> = ({ children }) => {
  return (
    <LoadContext.Provider value={loadContextData}>
      {children}
    </LoadContext.Provider>
  );
};
