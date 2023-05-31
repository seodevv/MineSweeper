import React, { memo, useCallback, useContext, useMemo, useRef } from "react";
import styled from "styled-components";
import { MineContext } from "../../context/MineContext";
import { SET_DIFF, difficulty, START_GAME } from "../../reducer/mineReducer";

const Icon = memo(styled.span`
  margin-left: 3px;
  font-size: 0.8rem;
`);

const MineInfoLeft = () => {
  const { diff, dispatch } = useContext(MineContext);
  const dropdown = useRef(null);

  const dropdownBtn = () => {
    console.log("dropdownBtn");
    if (dropdown.current) {
      dropdown.current.classList.toggle("mine-info-dropdown-active");
    }
  };

  const changeDiff = (e) => {
    console.log("changeDiff");
    const index = [...e.target.parentNode.children].indexOf(e.target);
    dispatch({ type: SET_DIFF, diff: index });
    dispatch({ type: START_GAME });
    if (dropdown.current) {
      dropdown.current.classList.remove("mine-info-dropdown-active");
    }
  };

  return useMemo(
    () => (
      <>
        <div className="mine-info-left">
          <div className="mine-info-diff" onClick={dropdownBtn}>
            {difficulty[diff]}
            <Icon>▼</Icon>
          </div>
          <div className="mine-info-dropdown" ref={dropdown}>
            <ul>
              <li onClick={changeDiff}>{diff === 0 && "✔"} 초급</li>
              <li onClick={changeDiff}>{diff === 1 && "✔"} 중급</li>
              <li onClick={changeDiff}>{diff === 2 && "✔"} 고급</li>
            </ul>
          </div>
        </div>
      </>
    ),
    [diff]
  );
};

export default MineInfoLeft;
