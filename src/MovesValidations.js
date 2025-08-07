import { DIRECTION_VECTORS } from "./PiecesInfo.js";
import { getPieceAtCoords } from "./PieceUtility.js";

let pieceColor;

export function pieceIdentifier(pieceToIdentify, row, col) {
  const pieceTitle = pieceToIdentify.title;

  if (pieceTitle.includes("white")) {
    pieceColor = "white";
  } else {
    pieceColor = "black";
  }

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
  } else if (pieceTitle.includes("king")) {
    return kingMoveGen(pieceToIdentify, row, col);
  } else {
    return pawnMoveGen(pieceToIdentify, row, col);
  }
}

function genMoveInOneDirection(
  row,
  col,
  rowIncrement,
  colIncrement,
  legalMoveArray
) {
  let i = 1;
  while (
    row + i * rowIncrement < 8 &&
    row + i * rowIncrement >= 0 &&
    col + i * colIncrement < 8 &&
    col + i * colIncrement >= 0
  ) {
    const targetRow = row + i * rowIncrement;
    const targetCol = col + i * colIncrement;

    const pieceInThePosition = getPieceAtCoords(targetRow, targetCol);
    if (pieceInThePosition) {
      if (pieceInThePosition.title.includes(pieceColor)) {
        break;
      } else {
        legalMoveArray.push({
          row: targetRow,
          col: targetCol,
        });
        break;
      }
    }

    legalMoveArray.push({
      row: targetRow,
      col: targetCol,
    });

    i++;
  }
}

function genOneMove(row, col, rowTraverse, colTraverse, legalMoveArray) {
  if (
    row + rowTraverse < 8 &&
    row + rowTraverse >= 0 &&
    col + colTraverse < 8 &&
    col + colTraverse >= 0
  ) {
    const pieceInThePosition = getPieceAtCoords(
      row + rowTraverse,
      col + colTraverse
    );

    if (!pieceInThePosition) {
      legalMoveArray.push({ row: row + rowTraverse, col: col + colTraverse });
    } else {
      if (!pieceInThePosition.title.includes(pieceColor)) {
        legalMoveArray.push({ row: row + rowTraverse, col: col + colTraverse });
      }
    }
  }
}

function genCastlingMove(
  row,
  col,
  kingPiece,
  legalMoveArray,
  castlingDirection
) {
  const isKingMoved = kingPiece.moveList.length !== 0;
  const castlingPathway = [];

  if (!isKingMoved) {
    const rookXCoordWrtKing = 3.5 * castlingDirection - 0.5;
    const castlingRook = getPieceAtCoords(row, col + rookXCoordWrtKing);

    if (castlingRook) {
      const friendlyPiece = castlingRook.title.includes(pieceColor);
      const isPieceRook = castlingRook.title.includes("rook");

      if (friendlyPiece && isPieceRook) {
        const isCastlingRookMoved = castlingRook.moveList.length !== 0;

        if (!isCastlingRookMoved) {
          let initialValue =
            Math.min(kingPiece.position.col, castlingRook.position.col) + 1;

          let limitingValue = Math.max(
            kingPiece.position.col,
            castlingRook.position.col
          );

          while (initialValue < limitingValue) {
            const pathwayPiece = getPieceAtCoords(row, initialValue);

            if (pathwayPiece) {
              castlingPathway.push(pathwayPiece);
            }

            initialValue++;
          }

          const isCastlingPathClear = castlingPathway.length === 0;

          if (isCastlingPathClear) {
            legalMoveArray.push({ row: row, col: col + 2 * castlingDirection });

            const keyTitle =
              castlingDirection === 1
                ? "kingsideCastling"
                : "queensideCastling";

            kingPiece.castling.isCastlingPossible = true;

            kingPiece.castling.rookCoords[keyTitle] = {
              initialCoords: { row: row, col: castlingRook.position.col },
              finalCoords: {
                row: row,
                col: col + castlingDirection,
              },
            };
          }
        }
      }
    }
  }
}

function rookMoveGen(row, col) {
  const legalRookMoves = [];

  DIRECTION_VECTORS.rook.forEach((vector) =>
    genMoveInOneDirection(row, col, vector.row, vector.col, legalRookMoves)
  );

  return legalRookMoves;
}

function knightMoveGen(row, col) {
  const legalKnightMoves = [];

  DIRECTION_VECTORS.knight.forEach((vector) =>
    genOneMove(row, col, vector.row, vector.col, legalKnightMoves)
  );

  return legalKnightMoves;
}

function bishopMoveGen(row, col) {
  const legalBishopMoves = [];

  DIRECTION_VECTORS.bishop.forEach((vector) =>
    genMoveInOneDirection(row, col, vector.row, vector.col, legalBishopMoves)
  );

  return legalBishopMoves;
}

function kingMoveGen(kingPiece, row, col) {
  const legalKingMoves = [];

  DIRECTION_VECTORS.king.forEach((vector) =>
    genOneMove(row, col, vector.row, vector.col, legalKingMoves)
  );

  kingPiece.castling = {
    isCastlingPossible: false,
    rookCoords: {
      kingsideCastling: { initialCoords: {}, finalCoords: {} },
      queensideCastling: { initialCoords: {}, finalCoords: {} },
    },
  };

  const kingsideCastle = 1;
  genCastlingMove(row, col, kingPiece, legalKingMoves, kingsideCastle);

  const queensideCastle = -1;
  genCastlingMove(row, col, kingPiece, legalKingMoves, queensideCastle);

  return legalKingMoves;
}

function pawnMoveGen(pawnPiece, row, col) {
  const validPawnMoves = [];
  const isPawnMoved = pawnPiece.moveList.length !== 0;
  const direction = pieceColor === "white" ? 1 : -1;

  function addMoveIfValid(targetRow, targetCol) {
    if (targetRow >= 0 && targetRow < 8) {
      const pieceInQuestion = getPieceAtCoords(targetRow, targetCol);

      if (!pieceInQuestion) {
        validPawnMoves.push({ row: targetRow, col: targetCol });
      }
    }
  }

  function captureIfValid(targetRow, targetCol) {
    if (targetRow >= 0 && targetRow < 8) {
      const pieceInQuestion = getPieceAtCoords(targetRow, targetCol);

      if (pieceInQuestion) {
        if (!pieceInQuestion.title.includes(pieceColor)) {
          validPawnMoves.push({ row: targetRow, col: targetCol });
        }
      }
    }
  }

  const oneSquareAhead = row + direction;
  addMoveIfValid(oneSquareAhead, col);

  if (!isPawnMoved) {
    const twoSquaresAhead = row + direction * 2;

    if (validPawnMoves.length > 0) {
      addMoveIfValid(twoSquaresAhead, col);
    }
  }

  const captureRight = col + 1;
  captureIfValid(oneSquareAhead, captureRight);

  const captureLeft = col - 1;
  captureIfValid(oneSquareAhead, captureLeft);

  const enPassantRow = (7 - 3 * direction) % 7;
  if (enPassantRow === row) {
    const rightPiece = getPieceAtCoords(row, col + 1);
    const leftPiece = getPieceAtCoords(row, col - 1);
    // console.log(rightPiece);
    // console.log(leftPiece);
  }

  return validPawnMoves;
}
