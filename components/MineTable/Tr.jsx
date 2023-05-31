import React, { memo, useContext } from "react";
import Td from "./Td";
import { MineContext } from "../../context/MineContext";

const Tr = memo(({ rowIndex }) => {
  const { tableData } = useContext(MineContext);
  // console.log("Tr Render");
  return (
    <tr>
      {tableData[rowIndex].map((data, i) => (
        <Td key={rowIndex + i} rowIndex={rowIndex} colIndex={i} data={data} />
      ))}
    </tr>
  );
});

Tr.displayName = "Tr";

export default Tr;
