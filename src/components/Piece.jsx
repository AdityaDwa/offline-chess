import { areArraysEqual, pieceIdentifier } from "../moves_validation.js";
import { computePiecePosition } from "../piece_utility.js";

export default function Piece({ pieceInfo, updatePieceMoveTiles }) {
  function handlePieceClick() {
    const computedPiecePosition = computePiecePosition(pieceInfo[0]);

    const returnArray = pieceIdentifier(
      pieceInfo[0].title,
      computedPiecePosition.row,
      computedPiecePosition.col
    );

    updatePieceMoveTiles((prevMoveInfo) => {
      if (
        !prevMoveInfo.tiles.length ||
        !areArraysEqual(returnArray, prevMoveInfo.tiles)
      ) {
        return { id: pieceInfo[0].id, tiles: returnArray };
      } else {
        return { id: null, tiles: [] };
      }
    });
  }

  return (
    <button className="chess-piece-btn" onClick={handlePieceClick}>
      <img src={pieceInfo[0].src} alt={pieceInfo[0].title} />
    </button>
  );
}
