import { PIECES_INFO } from "../constants/PiecesInfo.js";
import { pieceIdentifier } from "./MovesValidation.js";

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

export function probeForCheck(turn) {
  const attackingPieces = [];
  PIECES_INFO.forEach((piece) => {
    if (piece.title.includes("black") === turn && !piece.isCaptured) {
      const computedPiecePosition = computePiecePosition(piece);
      const returnArray = pieceIdentifier(
        piece,
        computedPiecePosition.row,
        computedPiecePosition.col
      );

      attackingPieces.push({
        piece: piece,
        possibleMoves: returnArray,
      });
    }
  });

  const defendingKing = PIECES_INFO.find(
    (piece) =>
      piece.title.includes("king") &&
      piece.title.includes(turn ? "white" : "black")
  );
  const defendingKingCoords = computePiecePosition(defendingKing);

  const trueAttackingPieces = attackingPieces.filter((attackingPiece) =>
    attackingPiece.possibleMoves.some(
      (eachMove) =>
        eachMove.row === defendingKingCoords.row &&
        eachMove.col === defendingKingCoords.col
    )
  );

  return trueAttackingPieces;
}

export function probeForStalemate(turn) {
  for (const piece of PIECES_INFO) {
    if (piece.title.includes("white") === turn && !piece.isCaptured) {
      const computedPiecePosition = computePiecePosition(piece);

      const returnArray = pieceIdentifier(
        piece,
        computedPiecePosition.row,
        computedPiecePosition.col
      );

      for (const eachMove of returnArray) {
        const canPieceMove = isLegalMovePossible(piece, eachMove, turn);
        if (canPieceMove) {
          return false;
        }
      }
    }
  }
  return true;
}

function isLegalMovePossible(selectedPiece, currentMove, turn) {
  const capturedPiece = getPieceAtCoords(currentMove.row, currentMove.col);

  if (capturedPiece) {
    capturedPiece.isCaptured = true;
  }

  selectedPiece.moveList.push(currentMove);
  const checkFlagIndicator = probeForCheck(turn);

  selectedPiece.moveList.pop();

  if (capturedPiece) {
    capturedPiece.isCaptured = false;
  }

  return checkFlagIndicator.length === 0;
}

export function probeForCheckmate(turn, checkMoveArray) {
  if (checkMoveArray.length !== 0) {
    const defendingKing = PIECES_INFO.find(
      (piece) =>
        piece.title.includes("king") &&
        piece.title.includes(turn ? "white" : "black")
    );
    const defendingKingCoords = computePiecePosition(defendingKing);
    const kingPossibleMoves = pieceIdentifier(
      defendingKing,
      defendingKingCoords.row,
      defendingKingCoords.col
    );

    for (const eachMove of kingPossibleMoves) {
      const canKingMove = isLegalMovePossible(defendingKing, eachMove, turn);

      if (canKingMove) {
        return false;
      }
    }

    if (checkMoveArray.length === 1) {
      for (const moveset of checkMoveArray) {
        const attackingPieceCoords = computePiecePosition(
          moveset.piece,
          moveset.piece.position.row,
          moveset.piece.position.col
        );

        for (const piece of PIECES_INFO) {
          if (piece.title.includes("white") === turn && !piece.isCaptured) {
            const computedPiecePosition = computePiecePosition(piece);

            const returnArray = pieceIdentifier(
              piece,
              computedPiecePosition.row,
              computedPiecePosition.col
            );
            const isAttackingPieceCapturable = returnArray.some(
              (eachMove) =>
                eachMove.row === attackingPieceCoords.row &&
                eachMove.col === attackingPieceCoords.col
            );
            if (isAttackingPieceCapturable) {
              piece.moveList.push(attackingPieceCoords);
              moveset.piece.isCaptured = true;
              const tempCheckMoveArray = probeForCheck(turn);
              piece.moveList.pop();
              moveset.piece.isCaptured = false;
              if (tempCheckMoveArray.length === 0) {
                // console.log("capturable");
                return false;
              }
            }
          }
        }

        for (const eachMove of moveset.possibleMoves) {
          for (const piece of PIECES_INFO) {
            if (piece.title.includes("white") === turn && !piece.isCaptured) {
              const computedPiecePosition = computePiecePosition(piece);
              const returnArray = pieceIdentifier(
                piece,
                computedPiecePosition.row,
                computedPiecePosition.col
              );
              for (const everyMove of returnArray) {
                if (
                  everyMove.row === eachMove.row &&
                  everyMove.col === eachMove.col
                ) {
                  const capturedPiece = getPieceAtCoords(
                    eachMove.row,
                    eachMove.col
                  );
                  if (capturedPiece) {
                    capturedPiece.isCaptured = true;
                  }

                  piece.moveList.push(eachMove);
                  const tempCheckMoveArray = probeForCheck(turn);
                  piece.moveList.pop();

                  if (capturedPiece) {
                    capturedPiece.isCaptured = false;
                  }

                  if (tempCheckMoveArray.length === 0) {
                    // console.log("blockable by", piece.title, piece.id);
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
  return false;
}
