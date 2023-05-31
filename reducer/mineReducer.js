export const difficulty = ["초급", "중급", "고급"];

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const SET_DIFF = "SET_DIFF";
export const SET_FLAG = "SET_FLAG";
export const SET_TIMER = "SET_TIMER";

export const CODE = {
  OPEND: 0,
  NORMAL: -1,
  FLAG: -2,
  FLAG_MINE: -3,
  MINE: -4,
  CLICK_MINE: -5,
};

const flantMine = (row, col, mine) => {
  const candidate = Array(row * col)
    .fill()
    .map((v, i) => i);
  const mines = [];

  for (let i = 0; i < mine; i++) {
    const index = Math.floor(Math.random() * candidate.length);
    const choosen = candidate.splice(index, 1)[0];
    mines.push(choosen);
  }

  const tableData = new Array(row).fill();
  for (let i = 0; i < tableData.length; i++) {
    tableData[i] = new Array(col).fill(-1);
  }

  for (let i = 0; i < mines.length; i++) {
    const r = Math.floor(mines[i] / col);
    const c = mines[i] % col;
    tableData[r][c] = CODE.MINE;
  }

  return tableData;
};

export const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME: {
      let tableData = [];
      let mine = 0;
      if (state.diff === 0) {
        tableData = flantMine(8, 10, 10);
        mine = 10;
      } else if (state.diff === 1) {
        tableData = flantMine(14, 18, 40);
        mine = 40;
      } else {
        tableData = flantMine(20, 24, 99);
        mine = 99;
      }
      return {
        ...state,
        tableData,
        mine,
        halted: false,
        start: false,
        openCount: 0,
        win: false,
        flag: 0,
      };
    }
    case OPEN_CELL: {
      let openCount = state.openCount + 1; // open 한 cell 을 기록하는 변수
      const { rowIndex, colIndex, data } = action;
      const tableData = [...state.tableData]; // tableData 1차원 얕은 복사
      // tableData[rowIndex] = [...state.tableData[rowIndex]]; // tableData 해당 row(2차원) 얕은 복사
      tableData[rowIndex].forEach((col) => {
        // tableData 모든 row(2차원) 얕은 복사
        tableData[rowIndex] = [...state.tableData[rowIndex]];
      });

      // 오픈한 CELL 이 지뢰일 경우
      if (data === CODE.MINE) {
        tableData[rowIndex][colIndex] = CODE.CLICK_MINE;
        tableData.forEach((row, i) =>
          row.forEach((col, j) => {
            if ([CODE.MINE, CODE.FLAG_MINE].includes(tableData[i][j])) {
              tableData[i][j] = CODE.CLICK_MINE;
            }
          })
        );
        return { ...state, tableData, halted: true };
      }
      // 오픈한 CELL 이 지뢰가 아닐 경우
      else {
        const check = [];
        let count = 0; // 클릭한 수를 기록하는 변수

        const checkArround = (rowIndex, colIndex) => {
          // 중복 체크를 막기 위해 체크한 셀은 check 배열에 넣어줌
          if (check.includes(rowIndex + "/" + colIndex)) {
            return;
          }
          check.push(rowIndex + "/" + colIndex);
          // 이미 체크한 cell 이면 return

          // 이미 open 한 cell 이면 return
          if (tableData[rowIndex][colIndex] >= CODE.OPEND) {
            return;
          }

          // FLAG 세워져 있거나 mine 이면 return
          if (
            [CODE.MINE, CODE.FLAG, CODE.FLAG_MINE].includes(
              tableData[rowIndex][colIndex]
            )
          ) {
            return;
          }

          if (state.halted) {
            return;
          }

          // 클릭한 수를 증가
          count++;

          // arround : 클릭한 CELL 의 주변 지뢰 갯수를 확인
          let arround = [];
          // push : 일단 주변칸 다 넣어
          arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex - 1 });
          arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex });
          arround.push({ rowIndex: rowIndex - 1, colIndex: colIndex + 1 });
          arround.push({ rowIndex: rowIndex, colIndex: colIndex - 1 });
          arround.push({ rowIndex: rowIndex, colIndex: colIndex + 1 });
          arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex - 1 });
          arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex });
          arround.push({ rowIndex: rowIndex + 1, colIndex: colIndex + 1 });
          // filter : 없는 칸은 제외시켜
          arround = arround.filter((v) => {
            if (
              v.rowIndex === -1 ||
              v.rowIndex === tableData.length ||
              v.colIndex === -1 ||
              v.colIndex === tableData[rowIndex].length ||
              check.includes(v.rowIndex + "/" + v.colIndex)
            )
              return false;
            return true;
          });

          // 존재하는 주변 칸에 mine 이 있는지 카운팅
          const arroundMine = arround.filter((v) => {
            if (
              // mine 이거나 flag_mine 일 때 카운팅
              [CODE.MINE, CODE.FLAG_MINE].includes(
                tableData[v.rowIndex][v.colIndex]
              )
            ) {
              return true;
            }
          }).length;

          tableData[rowIndex][colIndex] = arroundMine;

          // 만약 mine 이 0 개면 주변 칸도 같이 열어줌
          if (arroundMine === 0) {
            arround.forEach((v) => {
              checkArround(v.rowIndex, v.colIndex);
            });
          } else {
            return;
          }
        };

        checkArround(rowIndex, colIndex);
        openCount = openCount + count - 1;
      }

      // mine 이외의 모든 칸을 열었으면 승리
      if (
        tableData.length * tableData[rowIndex].length - state.mine ===
        openCount
      ) {
        return { ...state, tableData, halted: true, win: true };
      }

      return { ...state, tableData, start: true, openCount };
    }
    case SET_DIFF:
      return { ...state, diff: action.diff };
    case SET_FLAG: {
      let flag = state.flag;
      const tableData = [...state.tableData];
      tableData[action.rowIndex] = [...tableData[action.rowIndex]];

      switch (action.data) {
        case CODE.NORMAL:
          tableData[action.rowIndex][action.colIndex] = CODE.FLAG;
          flag++;
          break;
        case CODE.MINE:
          tableData[action.rowIndex][action.colIndex] = CODE.FLAG_MINE;
          flag++;
          break;
        case CODE.FLAG:
          tableData[action.rowIndex][action.colIndex] = CODE.NORMAL;
          flag--;
          break;
        case CODE.FLAG_MINE:
          tableData[action.rowIndex][action.colIndex] = CODE.MINE;
          flag--;
          break;
      }
      return { ...state, tableData, flag };
    }
    case SET_TIMER:
      return { ...state, timer: action.timer };
    default:
      return { ...state };
  }
};

export const initialState = {
  tableData: flantMine(8, 10, 10),
  mine: 10,
  diff: 0,
  halted: false,
  start: false,
  openCount: 0,
  win: false,
  timer: 0,
  flag: 0,
};
