import { createContext } from "react";

export const MineContext = createContext({
  tableData: [],
  timer: 0,
  diff: 0,
  halted: false,
  start: false,
  dispatch: () => {},
});
