export function computePiecePosition(piece) {
  if (!piece.moveList.length) {
    return { row: piece.position.row, col: piece.position.col };
  } else {
    const currentPosition = piece.moveList[piece.moveList.length - 1];
    return { row: currentPosition.row, col: currentPosition.col };
  }
}
