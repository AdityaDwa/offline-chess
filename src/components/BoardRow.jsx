import Piece from "./Piece.jsx";

import { PIECES_INFO } from "../pieces_info.js";
import { computePiecePosition } from "../piece_utility.js";

export default function BoardRow({
  rowIndex,
  updatePieceMoveTiles,
  moveTiles,
}) {
  function handleMoveTileClick(id, row, col) {
    const movingPiece = PIECES_INFO.find((piece) => piece.id === id);
    movingPiece.moveList.push({ row: row, col: col });
    updatePieceMoveTiles({ id: null, tiles: [] });
  }

  let columnIndex = -1;
  return (
    <>
      {Array.from({ length: 8 }).map(() => {
        let cssClasses = "chess-box";
        columnIndex++;

        if ((rowIndex + columnIndex) % 2 != 0) {
          cssClasses += " dark-chess-box";
        }

        const pieceInfo = PIECES_INFO.filter((piece) => {
          const computedPiecePosition = computePiecePosition(piece);
          return (
            computedPiecePosition.row == rowIndex &&
            computedPiecePosition.col == columnIndex
          );
        });

        return (
          <span className={cssClasses} key={columnIndex}>
            {pieceInfo.length ? (
              <Piece
                pieceInfo={pieceInfo}
                updatePieceMoveTiles={updatePieceMoveTiles}
              />
            ) : (
              ""
            )}

            {moveTiles.tiles.map((move) => {
              if (move.row == rowIndex && move.col == columnIndex) {
                return (
                  <div
                    className="move-tile"
                    key={move.row + move.col}
                    onClick={() =>
                      handleMoveTileClick(moveTiles.id, move.row, move.col)
                    }
                  >
                    <div className="move-tile-indicator"></div>
                  </div>
                );
              }
            })}
          </span>
        );
      })}
    </>
  );
}
