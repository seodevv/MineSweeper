import React from "react";
import MineInfoLeft from "./MineInfoLeft";
import MineInfoMid from "./MineInfoMid";
import MineInfoRight from "./MineInfoRight";

const MineInfo = () => {
  return (
    <>
      <div className="mine-info">
        <MineInfoLeft />
        <MineInfoMid />
        <MineInfoRight />
      </div>
    </>
  );
};

export default MineInfo;
