import { useState } from "react";

import BoardRow from "./BoardRow.jsx";

export default function Board() {
  const [moveTiles, setMoveTiles] = useState({
    id: null,
    tiles: [],
  });

  function updatePieceMoveTiles(pieceMoveInfo) {
    setMoveTiles(pieceMoveInfo);
  }

  let rowIndex = -1;

  return (
    <section id="chess-board-container">
      <div className="chess-board">
        {Array.from({ length: 8 }).map(() => {
          rowIndex++;
          return (
            <BoardRow
              rowIndex={rowIndex}
              key={rowIndex}
              updatePieceMoveTiles={updatePieceMoveTiles}
              moveTiles={moveTiles}
            />
          );
        })}
      </div>
    </section>
  );
}
