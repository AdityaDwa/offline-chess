import { useState, useEffect } from "react";

import Board from "./Board.jsx";
import MoveHistoryTable from "./MoveHistoryTable.jsx";

import { PIECES_INFO } from "../PiecesInfo.js";
import {
  computePiecePosition,
  getPieceAtCoords,
  probeForCheck,
  probeForStalemate,
  probeForCheckmate,
} from "../PieceUtility.js";

import { MOVE_HISTORY, COLUMNS } from "../MatchConstants.js";

export default function GameWindow() {
  const [moveTiles, setMoveTiles] = useState({
    id: null,
    tiles: [],
  });

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [traverseIndex, setTravserseIndex] = useState(-1);

  const [dummyState, setDummyState] = useState("");

  useEffect(() => {
    const didCheckOccur = probeForCheck(isWhiteTurn, PIECES_INFO);

    if (didCheckOccur.length !== 0) {
      probeForCheckmate(isWhiteTurn, didCheckOccur);
    } else {
      probeForStalemate(isWhiteTurn);
    }
  }, [isWhiteTurn]);

  function genMovementTiles(pieceMoveInfo) {
    setMoveTiles(pieceMoveInfo);
  }

  function handlePieceMovement(id, row, col) {
    const capturedPiece = getPieceAtCoords(row, col);
    let moveNotation = "";
    let specialMoveInfo = null;
    let capturedPieceId = null;

    if (capturedPiece) {
      capturedPiece.isCaptured = true;
      capturedPieceId = capturedPiece.id;
    }

    const movingPiece = PIECES_INFO.find((piece) => piece.id === id);
    const currentPosition = computePiecePosition(movingPiece);

    if (
      movingPiece.title.includes("king") &&
      movingPiece.castling.isCastlingPossible
    ) {
      const kingTraverse = col - movingPiece.position.col;
      const keyTitle =
        kingTraverse === 2 ? "kingsideCastling" : "queensideCastling";

      if (Math.abs(kingTraverse) === 2) {
        const castlingRook = getPieceAtCoords(
          movingPiece.castling.rookCoords[keyTitle].initialCoords.row,
          movingPiece.castling.rookCoords[keyTitle].initialCoords.col
        );

        castlingRook.moveList.push(
          movingPiece.castling.rookCoords[keyTitle].finalCoords
        );

        moveNotation = keyTitle === "kingsideCastling" ? "O-O" : "O-O-O";
        specialMoveInfo = {
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
    }

    movingPiece.moveList.push({ row: row, col: col });
    const checkMoveArrayForCurrentUser = probeForCheck(isWhiteTurn);
    if (checkMoveArrayForCurrentUser.length !== 0) {
      movingPiece.moveList.pop();
      if (capturedPiece) {
        capturedPiece.isCaptured = false;
      }
      // console.log(checkMoveArrayForCurrentUser);
      return;
    }

    const checkMoveArrayForOpponent = probeForCheck(!isWhiteTurn);
    const opponentIsMate = probeForCheckmate(!isWhiteTurn);

    let checkNotation = checkMoveArrayForOpponent.length !== 0 ? "+" : "";
    checkNotation = opponentIsMate ? "#" : checkNotation;

    if (!moveNotation) {
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

      let captureSymbol = capturedPieceId ? "x" : "";
      let pawnCaptureRow =
        capturedPieceId && movingPiece.title.includes("pawn")
          ? COLUMNS[currentPosition.col]
          : "";
      moveNotation = `${pieceNotation}${pawnCaptureRow}${captureSymbol}${
        COLUMNS[col]
      }${row + 1}${checkNotation}`;
    }

    MOVE_HISTORY.push({
      moveId: moveNotation,
      pieceId: id,
      movedPosition: { row: row, col: col },
      capturedPieceId: capturedPieceId,
      specialMoveInfo: specialMoveInfo,
    });

    genMovementTiles({ id: null, tiles: [] });
    setIsWhiteTurn((prevTurn) => !prevTurn);
    setTravserseIndex((prevIndex) => prevIndex + 1);

    setTimeout(() => {
      setIsBoardFlipped((prevOrientation) => !prevOrientation);
    }, 500);
  }

  function handleMoveHistoryTraversal(moveId = "", traverseVector = "") {
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

    setTravserseIndex(moveIndex);

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
    }

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

      setMoveTiles({
        id: null,
        tiles: [],
      });
      setDummyState(Math.random());
    }
  }

  function handleDrop(event, id, row, col) {
    event.preventDefault();
    const draggedData = event.dataTransfer.getData("text/plain");

    if (draggedData === "chess-piece") {
      handlePieceMovement(id, row, col);
    }
  }

  return (
    <section id="chess-board-container">
      <Board
        isWhiteTurn={isWhiteTurn}
        isBoardFlipped={isBoardFlipped}
        traverseIndex={traverseIndex}
        moveTiles={moveTiles}
        genMovementTiles={genMovementTiles}
        handlePieceMovement={handlePieceMovement}
        handleDrop={handleDrop}
      />

      <MoveHistoryTable
        traverseIndex={traverseIndex}
        handleMoveHistoryTraversal={handleMoveHistoryTraversal}
      />
    </section>
  );
}
