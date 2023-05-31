import React, { memo, useContext } from "react";
import { MineContext } from "../../context/MineContext";
import Tr from "./Tr";

const Table = memo(() => {
  const { tableData } = useContext(MineContext);
  // console.log("Table Render");

  return (
    <>
      <table>
        <tbody>
          {tableData.map((v, i) => (
            <Tr key={i} rowIndex={i} />
          ))}
        </tbody>
      </table>
    </>
  );
});

Table.displayName = "Table";

export default Table;
