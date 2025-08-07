import { PIECES_INFO } from "./PiecesInfo.js";

export function computePiecePosition(piece) {
  if (!piece.moveList.length) {
    return { row: piece.position.row, col: piece.position.col };
  } else {
    const currentPosition = piece.moveList[piece.moveList.length - 1];
    return { row: currentPosition.row, col: currentPosition.col };
  }
}

export function getPieceAtCoords(targetRow, targetCol) {
  return PIECES_INFO.find((piece) => {
    const computedPiecePosition = computePiecePosition(piece);
    return (
      computedPiecePosition.row === targetRow &&
      computedPiecePosition.col === targetCol &&
      !piece.isCaptured
    );
  });
}

export function areArraysEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((item, index) =>
    Object.keys(item).every((key) => item[key] === array2[index][key])
  );
}
