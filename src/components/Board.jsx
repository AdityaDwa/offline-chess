import { useContext } from "react";

import BoardRow from "./BoardRow.jsx";
import Piece from "./Piece.jsx";
import MoveTile from "./MoveTile.jsx";

import { MatchContext } from "../store/MatchContext.jsx";

import { PIECES_INFO } from "../constants/PiecesInfo.js";
import { MOVE_HISTORY } from "../constants/MatchConstants.js";
import { computePiecePosition } from "../utils/PieceUtility.js";

export default function Board() {
  const { isBoardFlipped, traverseIndex, moveTiles } = useContext(MatchContext);

  let rowIndex = -1;

  return (
    <div
      className="chess-board"
      style={{ rotate: isBoardFlipped ? "180deg" : "0deg" }}
      onDragOver={(event) => event.preventDefault()}
    >
      {Array.from({ length: 8 }).map(() => {
        rowIndex++;
        return (
          <BoardRow
            key={rowIndex}
            rowIndex={rowIndex}
            isBoardFlipped={isBoardFlipped}
          />
        );
      })}

      {PIECES_INFO.map((piece) => {
        const computedPiecePosition = computePiecePosition(piece);

        const transformXPosition = computedPiecePosition.col * 5.5;
        const transformYPosition = (7 - computedPiecePosition.row) * 5.5;

        if (!piece.isCaptured) {
          return (
            <Piece
              key={piece.id}
              pieceInfo={piece}
              isMovementAllowed={traverseIndex === MOVE_HISTORY.length - 1}
              style={{
                transform: `translate(${transformXPosition}rem, ${transformYPosition}rem)`,
              }}
            />
          );
        }
      })}

      {moveTiles.tiles.map((move, index) => (
        <MoveTile key={index} move={move} />
      ))}
    </div>
  );
}
