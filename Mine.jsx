import React, { useMemo, useReducer } from "react";
import { initialState, reducer } from "./reducer/mineReducer";
import { MineContext } from "./context/MineContext";
import MineInfo from "./components/MineInfo/MineInfo";
import MineTable from "./components/MineTable/MineTable";
import MineInfoWin from "./components/MineInfo/MineInfoWin";

const Mine = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(
    () => ({
      tableData: state.tableData,
      mine: state.mine,
      flag: state.flag,
      diff: state.diff,
      halted: state.halted,
      start: state.start,
      timer: state.timer,
      dispatch,
    }),
    [state.tableData, state.halted, state.timer]
  );
  return (
    <>
      <div className="background">
        <div className="mine-container">
          <MineContext.Provider value={value}>
            <MineInfo />
            <MineTable />
            {state.win && <MineInfoWin />}
          </MineContext.Provider>
        </div>
      </div>
    </>
  );
};

export default Mine;
