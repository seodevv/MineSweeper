import React, { memo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { MineContext } from "../../context/MineContext";
import { START_GAME } from "../../reducer/mineReducer";

const MineInfoRight = memo(() => {
  const { dispatch } = useContext(MineContext);

  const onReset = () => {
    console.log("MineInfoRight", "onReset");
    dispatch({ type: START_GAME });
  };

  return (
    <>
      <div className="mine-info-right">
        <div className="mine-info-reset">
          <FontAwesomeIcon icon={faArrowRotateRight} onClick={onReset} />
        </div>
      </div>
    </>
  );
});

MineInfoRight.displayName = "MineInfoRight";

export default MineInfoRight;
