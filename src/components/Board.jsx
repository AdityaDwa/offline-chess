import BoardRow from "./BoardRow.jsx";
import Piece from "./Piece.jsx";

import { PIECES_INFO } from "../PiecesInfo.js";
import { MOVE_HISTORY } from "../MatchConstants.js";
import { computePiecePosition } from "../PieceUtility.js";

export default function Board({
  isWhiteTurn,
  isBoardFlipped,
  traverseIndex,
  moveTiles,
  genMovementTiles,
  handlePieceMovement,
  handleDrop,
}) {
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
              isWhiteTurn={isWhiteTurn}
              isBoardFlipped={isBoardFlipped}
              isMovementAllowed={traverseIndex === MOVE_HISTORY.length - 1}
              style={{
                transform: `translate(${transformXPosition}rem, ${transformYPosition}rem)`,
              }}
              moveTiles={moveTiles}
              genMovementTiles={genMovementTiles}
            />
          );
        }
      })}

      {moveTiles.tiles.map((move, index) => {
        const transformXPosition = move.col * 5.5;
        const transformYPosition = (7 - move.row) * 5.5;

        return (
          <div
            key={index}
            className="move-tile"
            style={{
              top: `${transformYPosition}rem`,
              left: `${transformXPosition}rem`,
            }}
            onClick={() =>
              handlePieceMovement(moveTiles.id, move.row, move.col)
            }
            onDrop={(event) =>
              handleDrop(event, moveTiles.id, move.row, move.col)
            }
            onDragOver={(event) => event.preventDefault()}
          >
            <div className="move-tile-indicator"></div>
          </div>
        );
      })}
    </div>
  );
}
