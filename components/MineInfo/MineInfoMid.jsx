import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { MineContext } from "../../context/MineContext";
import { SET_TIMER } from "../../reducer/mineReducer";

const MineInfoMid = memo(() => {
  const { diff, halted, start, flag, dispatch } = useContext(MineContext);
  const [timer, setTimer] = useState(0);
  const interval = useRef(null);

  useEffect(() => {
    if (halted) {
      clearInterval(interval.current);
      dispatch({ type: SET_TIMER, timer: timer });
    }
  }, [halted]);

  useEffect(() => {
    if (start) {
      interval.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval.current);
      setTimer(0);
    }
  }, [start]);

  return (
    <>
      <div className="mine-info-center">
        <div className="mine-info-count">
          🚩 {diff === 0 ? 10 - flag : diff === 1 ? 40 - flag : 99 - flag}
        </div>
        <div className="mine-info-timer">🕑 {timer.toLocaleString()}</div>
      </div>
    </>
  );
});

MineInfoMid.displayName = "MineInfoMid";

export default MineInfoMid;
