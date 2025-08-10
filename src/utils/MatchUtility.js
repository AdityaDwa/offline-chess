import whitePawn from "../assets/white_pawn.png";
import blackPawn from "../assets/black_pawn.png";

import { PIECES_INFO } from "../constants/PiecesInfo.js";
import { MOVE_HISTORY, COLUMNS } from "../constants/MatchConstants";
import {
  getPieceAtCoords,
  probeForCheck,
  probeForCheckmate,
} from "./PieceUtility.js";

export function castleKing(
  movingPiece,
  currentPosition,
  col,
  moveInfoObj,
  isWhiteTurn
) {
  let returnPiece = null;
  const kingTraverse = col - movingPiece.position.col;

  if (Math.abs(kingTraverse) === 2) {
    const keyTitle =
      kingTraverse === 2 ? "kingsideCastling" : "queensideCastling";

    const checkMovesFromOpponent = probeForCheck(isWhiteTurn);

    movingPiece.moveList.push({
      row: currentPosition.row,
      col: currentPosition.col + kingTraverse * 0.5,
    });
    const middleSquareCheck = probeForCheck(isWhiteTurn);
    movingPiece.moveList.pop();

    if (checkMovesFromOpponent.length !== 0 || middleSquareCheck.length !== 0) {
      return -1;
    }

    const castlingRook = getPieceAtCoords(
      movingPiece.castling.rookCoords[keyTitle].initialCoords.row,
      movingPiece.castling.rookCoords[keyTitle].initialCoords.col
    );

    castlingRook.moveList.push(
      movingPiece.castling.rookCoords[keyTitle].finalCoords
    );

    returnPiece = castlingRook;

    moveInfoObj.moveNotation =
      keyTitle === "kingsideCastling" ? "O-O" : "O-O-O";
    moveInfoObj.specialMoveInfo = {
      specialPieceId: castlingRook.id,
      specialMove: movingPiece.castling.rookCoords[keyTitle].finalCoords,
    };
  }

  movingPiece.castling = {
    isCastlingPossible: false,
    rookCoords: {
      kingsideCastling: { initialCoords: {}, finalCoords: {} },
      queensideCastling: { initialCoords: {}, finalCoords: {} },
    },
  };

  return returnPiece;
}

export function genMoveNotation(
  id,
  row,
  col,
  isWhiteTurn,
  movingPiece,
  moveInfoObj,
  currentPosition,
  traverseIndex,
  isPawnPromotionMove,
  moveClashfix
) {
  const checkMovesFromCurrentUser = probeForCheck(!isWhiteTurn);
  const opponentIsMate = probeForCheckmate(
    !isWhiteTurn,
    checkMovesFromCurrentUser
  );

  let checkNotation = checkMovesFromCurrentUser.length !== 0 ? "+" : "";
  checkNotation = opponentIsMate ? "#" : checkNotation;

  if (!moveInfoObj.moveNotation) {
    let pieceNotation = "";

    if (movingPiece.title.includes("rook")) {
      pieceNotation = "R";
    } else if (movingPiece.title.includes("knight")) {
      pieceNotation = "N";
    } else if (movingPiece.title.includes("bishop")) {
      pieceNotation = "B";
    } else if (movingPiece.title.includes("king")) {
      pieceNotation = "K";
    } else if (movingPiece.title.includes("queen")) {
      pieceNotation = "Q";
    }

    let captureSymbol = moveInfoObj.capturedPieceId ? "x" : "";
    let pawnCaptureRow =
      moveInfoObj.capturedPieceId && movingPiece.title.includes("pawn")
        ? COLUMNS[currentPosition.col]
        : "";
    let pawnPromote = isPawnPromotionMove ? "=" : "";

    moveInfoObj.moveNotation = `${pieceNotation}${pawnCaptureRow}${moveClashfix}${captureSymbol}${
      COLUMNS[col]
    }${row + 1}${pawnPromote}${checkNotation}`;
  }

  if (isPawnPromotionMove) {
    return {
      moveId: traverseIndex + 1,
      moveTitle: moveInfoObj.moveNotation,
      pieceId: id,
      movedPosition: { row: row, col: col },
      capturedPieceId: moveInfoObj.capturedPieceId,
      specialMoveInfo: moveInfoObj.specialMoveInfo,
      pawnPromoMoveInfo: null,
    };
  } else {
    MOVE_HISTORY.push({
      moveId: traverseIndex + 1,
      moveTitle: moveInfoObj.moveNotation,
      pieceId: id,
      movedPosition: { row: row, col: col },
      capturedPieceId: moveInfoObj.capturedPieceId,
      specialMoveInfo: moveInfoObj.specialMoveInfo,
      pawnPromoMoveInfo: null,
    });
  }
}

export function getMoveIndex(moveId, traverseVector, traverseIndex) {
  let moveIndex;

  if (traverseVector === "") {
    moveIndex = MOVE_HISTORY.findIndex(
      (eachMove) => eachMove.moveId === moveId
    );
  } else {
    moveIndex = traverseVector - 1;
    if (traverseVector === 1 || traverseVector === -1) {
      moveIndex = traverseIndex + traverseVector;
    }
  }

  return moveIndex;
}

export function clearMoveHistory() {
  for (let i = MOVE_HISTORY.length - 1; i >= 0; i--) {
    const movedPiece = PIECES_INFO.find(
      (piece) => piece.id === MOVE_HISTORY[i].pieceId
    );
    movedPiece.moveList.pop();

    if (MOVE_HISTORY[i].capturedPieceId) {
      const capturedPiece = PIECES_INFO.find(
        (piece) => piece.id === MOVE_HISTORY[i].capturedPieceId
      );
      capturedPiece.isCaptured = false;
    }

    if (MOVE_HISTORY[i].specialMoveInfo) {
      const specialPiece = PIECES_INFO.find(
        (piece) => piece.id === MOVE_HISTORY[i].specialMoveInfo.specialPieceId
      );
      specialPiece.moveList.pop();
    }

    if (MOVE_HISTORY[i].pawnPromoMoveInfo) {
      const pawnColor = movedPiece.title.includes("white");
      movedPiece.title = `${pawnColor ? "white" : "black"}-pawn`;
      movedPiece.src = pawnColor ? whitePawn : blackPawn;
    }
  }
}

export function traverseMoveHistory(moveIndex) {
  for (let i = 0; i <= moveIndex; i++) {
    const movedPiece = PIECES_INFO.find(
      (piece) => piece.id === MOVE_HISTORY[i].pieceId
    );
    movedPiece.moveList.push(MOVE_HISTORY[i].movedPosition);

    if (MOVE_HISTORY[i].capturedPieceId) {
      const capturedPiece = PIECES_INFO.find(
        (piece) => piece.id === MOVE_HISTORY[i].capturedPieceId
      );
      capturedPiece.isCaptured = true;
    }

    if (MOVE_HISTORY[i].specialMoveInfo) {
      const specialPiece = PIECES_INFO.find(
        (piece) => piece.id === MOVE_HISTORY[i].specialMoveInfo.specialPieceId
      );
      specialPiece.moveList.push(MOVE_HISTORY[i].specialMoveInfo.specialMove);
    }

    if (MOVE_HISTORY[i].pawnPromoMoveInfo) {
      movedPiece.title = MOVE_HISTORY[i].pawnPromoMoveInfo.title;
      movedPiece.src = MOVE_HISTORY[i].pawnPromoMoveInfo.src;
    }
  }
}
