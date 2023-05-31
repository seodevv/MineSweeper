import React, { memo, useContext, useRef } from "react";
import { MineContext } from "../../context/MineContext";
import { CODE, OPEN_CELL, SET_FLAG } from "../../reducer/mineReducer";

const getClass = (data, rowIndex, colIndex, diff) => {
  let classString = [];
  let opend = false;

  if (diff === 0) classString.push("mine-table-junior-td");
  else if (diff === 1) classString.push("mine-table-senior-td");
  else classString.push("mine-table-expert-td");

  if (data === CODE.CLICK_MINE) classString.push("mine-table-opend-boom");

  if (data >= CODE.OPEND) opend = true;

  if ((rowIndex + colIndex) % 2 === 0) {
    if (opend) classString.push("mine-table-opend-odd");
    else classString.push("mine-table-closed-odd");
  } else {
    if (opend) classString.push("mine-table-opend-even");
    else classString.push("mine-table-closed-even");
  }

  switch (data) {
    case 1:
      classString.push("blue");
      break;
    case 2:
      classString.push("green");
      break;
    case 3:
      classString.push("red");
      break;
    case 4:
      classString.push("purple");
      break;
    case 5:
      classString.push("orange");
      break;
  }

  return classString.join(" ");
};

const getText = (data) => {
  switch (data) {
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return "🚩";
    case CODE.CLICK_MINE:
      return "🔥";
    case CODE.MINE:
      return "";
    case CODE.NORMAL:
    case CODE.OPEND:
    default:
      return data === -1 ? "" : data === 0 ? "" : data;
  }
};

const findArround = (tableData, rowIndex, colIndex, dispatch) => {
  const target = document.querySelector(`#td_${rowIndex}_${colIndex}`);

  if (tableData[rowIndex][colIndex] === 0) return;

  let flagCount = 0; // 주변 칸의 flag 갯수를 기록
  let arround = []; // 열리지 않은 주변 칸을 기록
  arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex - 1 });
  arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex });
  arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex + 1 });
  arround.push({ rowIndex: rowIndex, colIndex: colIndex - 1 });
  arround.push({ rowIndex: rowIndex, colIndex: colIndex + 1 });
  arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex - 1 });
  arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex });
  arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex + 1 });
  // 존재하면서 열리지 않은 주변 칸을 확인한다.
  arround = arround.filter((v) => {
    if (
      v.rowIndex === -1 ||
      v.rowIndex === tableData.length ||
      v.colIndex === -1 ||
      v.colIndex === tableData[rowIndex].length ||
      tableData[v.rowIndex][v.colIndex] >= CODE.OPEND
    ) {
      return false;
    } else if (
      [CODE.FLAG, CODE.FLAG_MINE].includes(tableData[v.rowIndex][v.colIndex])
    ) {
      flagCount++;
      return false;
    }
    return true;
  });

  // 플래그를 제외하고 다 열렸으면 return
  if (arround.length === 0) return arround;

  // flag 가 지뢰 갯수랑 같거나 많으면 열리지 않은 칸을 연다
  if (flagCount >= tableData[rowIndex][colIndex]) {
    arround.forEach((v) => {
      dispatch({
        type: OPEN_CELL,
        data: tableData[v.rowIndex][v.colIndex],
        rowIndex: v.rowIndex,
        colIndex: v.colIndex,
      });
    });
  }

  return arround;
};

const Td = memo(({ rowIndex, colIndex, data }) => {
  const { tableData, diff, halted, mine, flag, dispatch } =
    useContext(MineContext);

  const openCell = () => {
    if (
      [CODE.OPEND, CODE.FLAG, CODE.FLAG_MINE].includes(data) ||
      data > CODE.OPEND
    ) {
      return;
    }

    dispatch({ type: OPEN_CELL, data, rowIndex, colIndex });
  };

  const setFlag = (e) => {
    e.preventDefault();
    if (![CODE.NORMAL, CODE.MINE, CODE.FLAG, CODE.FLAG_MINE].includes(data)) {
      return;
    }

    if (mine - flag === 0) {
      return;
    }

    dispatch({ type: SET_FLAG, data: data, rowIndex, colIndex });
  };

  let dbClick = [false, false];
  let targets = [];

  const mouseDown = (e) => {
    if (data < CODE.OPEND) return;

    if ((dbClick[0] && e.button === 2) || (dbClick[1] && e.button === 0)) {
      const arround = findArround(tableData, rowIndex, colIndex, dispatch);
      targets = arround.map((v) => `td_${v.rowIndex}_${v.colIndex}`);
      if (targets.length !== 0) {
        targets.forEach((v) => {
          const target = document.querySelector(`#${v}`);
          target.classList.add("selected");
        });
      }
      return;
    } else if (e.button === 0) {
      dbClick[0] = true;
    } else if (e.button === 2) {
      dbClick[1] = true;
    }
  };

  const mouseUp = (e) => {
    if (dbClick) {
      dbClick = [false, false];
      if (targets.length !== 0) {
        targets.forEach((v) => {
          const target = document.querySelector(`#${v}`);
          target.classList.remove("selected");
        });
      }
    }
  };

  return (
    <>
      <td
        className={`nondragable ${getClass(data, rowIndex, colIndex, diff)}`}
        id={`td_${rowIndex}_${colIndex}`}
        onClick={!halted ? openCell : null}
        onContextMenu={!halted ? setFlag : null}
        onMouseDown={!halted ? mouseDown : null}
        onMouseUp={!halted ? mouseUp : null}
      >
        {getText(data)}
      </td>
    </>
  );
});

Td.displayName = "Td";

export default Td;
