import { useContext } from "react";

import { MatchContext } from "../store/MatchContext.jsx";

export default function MoveTile({ move }) {
  const { moveTiles, handlePieceMovement, handleDrop } =
    useContext(MatchContext);

  const transformXPosition = move.col * 5.5;
  const transformYPosition = (7 - move.row) * 5.5;

  return (
    <div
      className="move-tile"
      style={{
        top: `${transformYPosition}rem`,
        left: `${transformXPosition}rem`,
      }}
      onClick={() => handlePieceMovement(moveTiles.id, move.row, move.col)}
      onDrop={(event) => handleDrop(event, moveTiles.id, move.row, move.col)}
      onDragOver={(event) => event.preventDefault()}
    >
      <div className="move-tile-indicator"></div>
    </div>
  );
}
