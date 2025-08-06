import { PIECES_INFO } from "./pieces_info.js";
import { computePiecePosition } from "./piece_utility.js";

export function areArraysEqual(array1, array2) {
  if (array1.length !== array2.length) return false;

  return array1.every((item, index) =>
    Object.keys(item).every((key) => item[key] === array2[index][key])
  );
}

export function pieceIdentifier(pieceTitle, row, col) {
  if (pieceTitle.includes("rook")) {
    return rookMoveGen(row, col);
  } else if (pieceTitle.includes("knight")) {
    return knightMoveGen(row, col);
  } else if (pieceTitle.includes("bishop")) {
    return bishopMoveGen(row, col);
  } else if (pieceTitle.includes("queen")) {
    const rookMoves = rookMoveGen(row, col);
    const bishopMoves = bishopMoveGen(row, col);
    const legalQueenMoves = [...rookMoves, ...bishopMoves];
    return legalQueenMoves;
  } else {
    return kingMoveGen(row, col);
  }
}

function rookMoveGen(row, col) {
  let i = 1;
  const validRookMoves = [];

  while (row + i < 8) {
    validRookMoves.push({ row: row + i, col: col });
    i++;
  }

  i = 1;
  while (row - i >= 0) {
    validRookMoves.push({ row: row - i, col: col });
    i++;
  }

  i = 1;
  while (col + i < 8) {
    validRookMoves.push({ row: row, col: col + i });
    i++;
  }

  i = 1;
  while (col - i >= 0) {
    validRookMoves.push({ row: row, col: col - i });
    i++;
  }

  const legalRookMoves = validRookMoves.filter((move) => {
    const pieceInThePosition = PIECES_INFO.find((piece) => {
      const computedPiecePosition = computePiecePosition(piece);
      return (
        computedPiecePosition.row == move.row &&
        computedPiecePosition.col == move.col
      );
    });
    if (!pieceInThePosition) {
      return move;
    }
  });

  return legalRookMoves;
}

function knightMoveGen(row, col) {
  const validKnightMoves = [];

  if (row + 1 < 8 && col + 2 < 8) {
    validKnightMoves.push({ row: row + 1, col: col + 2 });
  }
  if (row + 1 < 8 && col - 2 >= 0) {
    validKnightMoves.push({ row: row + 1, col: col - 2 });
  }
  if (row - 1 >= 0 && col + 2 < 8) {
    validKnightMoves.push({ row: row - 1, col: col + 2 });
  }
  if (row - 1 >= 0 && col - 2 >= 0) {
    validKnightMoves.push({ row: row - 1, col: col - 2 });
  }
  if (row + 2 < 8 && col + 1 < 8) {
    validKnightMoves.push({ row: row + 2, col: col + 1 });
  }
  if (row + 2 < 8 && col - 1 >= 0) {
    validKnightMoves.push({ row: row + 2, col: col - 1 });
  }
  if (row - 2 >= 0 && col + 1 < 8) {
    validKnightMoves.push({ row: row - 2, col: col + 1 });
  }
  if (row - 2 >= 0 && col - 1 >= 0) {
    validKnightMoves.push({ row: row - 2, col: col - 1 });
  }

  const legalKnightMoves = validKnightMoves.filter((move) => {
    const pieceInThePosition = PIECES_INFO.find((piece) => {
      const computedPiecePosition = computePiecePosition(piece);
      return (
        computedPiecePosition.row == move.row &&
        computedPiecePosition.col == move.col
      );
    });
    if (!pieceInThePosition) {
      return move;
    }
  });

  return legalKnightMoves;
}

function bishopMoveGen(row, col) {
  let i = 1;
  const validBishopMoves = [];

  while (row + i < 8 && col + i < 8) {
    validBishopMoves.push({ row: row + i, col: col + i });
    i++;
  }

  i = 1;
  while (row + i < 8 && col - i >= 0) {
    validBishopMoves.push({ row: row + i, col: col - i });
    i++;
  }

  i = 1;
  while (row - i >= 0 && col + i < 8) {
    validBishopMoves.push({ row: row - i, col: col + i });
    i++;
  }

  i = 1;
  while (row - i >= 0 && col - i >= 0) {
    validBishopMoves.push({ row: row - i, col: col - i });
    i++;
  }

  const legalBishopMoves = validBishopMoves.filter((move) => {
    const pieceInThePosition = PIECES_INFO.find((piece) => {
      const computedPiecePosition = computePiecePosition(piece);
      return (
        computedPiecePosition.row == move.row &&
        computedPiecePosition.col == move.col
      );
    });
    if (!pieceInThePosition) {
      return move;
    }
  });

  return legalBishopMoves;
}

function kingMoveGen(row, col) {
  const validKingMoves = [];

  const up = row + 1 < 8;
  const down = row - 1 >= 0;
  const right = col + 1 < 8;
  const left = col - 1 >= 0;

  if (up) {
    validKingMoves.push({ row: row + 1, col: col });
  }
  if (up && right) {
    validKingMoves.push({ row: row + 1, col: col + 1 });
  }
  if (right) {
    validKingMoves.push({ row: row, col: col + 1 });
  }
  if (down && right) {
    validKingMoves.push({ row: row - 1, col: col + 1 });
  }
  if (down) {
    validKingMoves.push({ row: row - 1, col: col });
  }
  if (down && left) {
    validKingMoves.push({ row: row - 1, col: col - 1 });
  }
  if (left) {
    validKingMoves.push({ row: row, col: col - 1 });
  }
  if (up && left) {
    validKingMoves.push({ row: row + 1, col: col - 1 });
  }

  const legalKingMoves = validKingMoves.filter((move) => {
    const pieceInThePosition = PIECES_INFO.find((piece) => {
      const computedPiecePosition = computePiecePosition(piece);
      return (
        computedPiecePosition.row == move.row &&
        computedPiecePosition.col == move.col
      );
    });
    if (!pieceInThePosition) {
      return move;
    }
  });

  return legalKingMoves;
}
