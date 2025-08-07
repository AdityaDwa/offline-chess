import { useState, useEffect } from "react";

import { pieceIdentifier } from "../MovesValidations.js";
import { computePiecePosition, areArraysEqual } from "../PieceUtility.js";

export default function Piece({
  pieceInfo,
  isWhiteTurn,
  isBoardFlipped,
  isMovementAllowed,
  style,
  moveTiles,
  genMovementTiles,
}) {
  const [isPieceClicked, setIsPieceClicked] = useState(false);

  useEffect(() => {
    if (moveTiles.id !== pieceInfo.id) {
      setIsPieceClicked(false);
    }
  }, [moveTiles]);

  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", "chess-piece");
    handlePieceClick();
  }

  function handlePieceClick() {
    setIsPieceClicked(!isPieceClicked);
    const computedPiecePosition = computePiecePosition(pieceInfo);

    const returnArray = pieceIdentifier(
      pieceInfo,
      computedPiecePosition.row,
      computedPiecePosition.col
    );

    genMovementTiles((prevMoveInfo) => {
      if (
        !prevMoveInfo.tiles.length ||
        !areArraysEqual(returnArray, prevMoveInfo.tiles)
      ) {
        return { id: pieceInfo.id, tiles: returnArray };
      } else {
        return { id: null, tiles: [] };
      }
    });
  }

  const isDisabled =
    isWhiteTurn !== pieceInfo.title.includes("white") || !isMovementAllowed;

  const cssClasses = isPieceClicked
    ? "chess-piece-btn chess-piece-btn-active"
    : "chess-piece-btn";

  return (
    <button
      draggable={!isDisabled}
      className={cssClasses}
      onClick={handlePieceClick}
      onDragStart={handleDragStart}
      disabled={isDisabled}
      style={style}
    >
      <img
        src={pieceInfo.src}
        alt={pieceInfo.title}
        style={{ rotate: isBoardFlipped ? "180deg" : "0deg" }}
      />
    </button>
  );
}
