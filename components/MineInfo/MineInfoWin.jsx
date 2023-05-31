import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { MineContext } from "../../context/MineContext";
import { START_GAME } from "../../reducer/mineReducer";

const MineInfoWin = () => {
  const { timer, dispatch } = useContext(MineContext);

  const onReset = () => {
    console.log("MineInfoWin", "onReset");
    dispatch({ type: START_GAME });
  };

  const preventEvent = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="mine-info-win" onContextMenu={preventEvent}>
        <div className="mine-info-result">
          <div className="mine-info-clock">🕑</div>
          <h2>{timer.toLocaleString()} 초</h2>
          <h3>Congratulations !</h3>
          <button className="mine-info-result-reset" onClick={onReset}>
            <FontAwesomeIcon icon={faArrowRotateRight} /> 다시 플레이하기
          </button>
        </div>
      </div>
    </>
  );
};

export default MineInfoWin;
