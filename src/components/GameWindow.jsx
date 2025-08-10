import { useState, useEffect } from "react";

import GameEndModal from "./GameEndModal.jsx";
import PawnPromotionModal from "./PawnPromotionModal.jsx";
import Board from "./Board.jsx";
import MoveHistoryTable from "./MoveHistoryTable.jsx";

import { MatchContext } from "../store/MatchContext.jsx";

import { PIECES_INFO } from "../constants/PiecesInfo.js";
import { MOVE_HISTORY, COLUMNS } from "../constants/MatchConstants.js";
import {
  castleKing,
  genMoveNotation,
  getMoveIndex,
  clearMoveHistory,
  traverseMoveHistory,
} from "../utils/MatchUtility.js";
import {
  computePiecePosition,
  getPieceAtCoords,
  probeForCheck,
  probeForStalemate,
  probeForCheckmate,
} from "../utils/PieceUtility.js";
import { pieceIdentifier } from "../utils/MovesValidation.js";

export default function GameWindow() {
  const [moveTiles, setMoveTiles] = useState({ id: null, tiles: [] });

  const [gameEndState, setGameEndState] = useState({
    hasEnded: false,
    reasonCode: null,
  });

  const [pawnPromotionInfo, setPawnPromotionInfo] = useState({
    isPromoting: false,
    pawnPiece: null,
  });

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [traverseIndex, setTravserseIndex] = useState(-1);

  useEffect(() => {
    const didCheckOccur = probeForCheck(isWhiteTurn, PIECES_INFO);

    if (didCheckOccur.length !== 0) {
      const didCheckmateOccur = probeForCheckmate(isWhiteTurn, didCheckOccur);

      if (didCheckmateOccur) {
        setTimeout(() => {
          setGameEndState({ hasEnded: true, reasonCode: 0 });
        }, 100);
      }
    } else {
      const didStalemateOccur = probeForStalemate(isWhiteTurn);

      if (didStalemateOccur) {
        setTimeout(() => {
          setGameEndState({ hasEnded: true, reasonCode: 1 });
        }, 100);
      }
    }
  }, [isBoardFlipped]);

  function genMovementTiles(pieceMoveInfo) {
    setMoveTiles(pieceMoveInfo);
  }

  function passPlay() {
    genMovementTiles({ id: null, tiles: [] });
    setIsWhiteTurn((prevTurn) => !prevTurn);
    setTravserseIndex((prevIndex) => prevIndex + 1);
    setTimeout(() => {
      setIsBoardFlipped((prevOrientation) => !prevOrientation);
    }, 500);
  }

  function handlePieceMovement(id, row, col) {
    const moveInfoObj = {
      moveNotation: "",
      capturedPieceId: null,
      specialMoveInfo: null,
    };

    const capturedPiece = getPieceAtCoords(row, col);
    if (capturedPiece) {
      capturedPiece.isCaptured = true;
      moveInfoObj.capturedPieceId = capturedPiece.id;
    }

    const movingPiece = PIECES_INFO.find((piece) => piece.id === id);
    const currentPosition = computePiecePosition(movingPiece);
    let castledRook = null;

    if (
      movingPiece.title.includes("king") &&
      movingPiece.castling.isCastlingPossible
    ) {
      castledRook = castleKing(
        movingPiece,
        currentPosition,
        col,
        moveInfoObj,
        isWhiteTurn
      );

      if (castledRook === -1) {
        return;
      }
    }

    let sameAnnotation = false;
    let moveClashfix = "";

    if (
      movingPiece.title.includes("rook") ||
      movingPiece.title.includes("knight") ||
      movingPiece.title.includes("bishop") ||
      movingPiece.title.includes("queen")
    ) {
      sameAnnotation = true;
    }

    if (sameAnnotation) {
      const samePiece = PIECES_INFO.find(
        (piece) =>
          piece.title === movingPiece.title &&
          piece.id !== id &&
          !piece.isCaptured
      );

      if (samePiece) {
        const samePieceCoords = computePiecePosition(samePiece);
        const samePossibleMoves = pieceIdentifier(
          samePiece,
          samePieceCoords.row,
          samePieceCoords.col
        );

        const isSameMovePossible = samePossibleMoves.some(
          (eachMove) => eachMove.row === row && eachMove.col === col
        );

        if (isSameMovePossible) {
          if (currentPosition.col === samePieceCoords.col) {
            moveClashfix = currentPosition.row + 1;
          } else {
            moveClashfix = COLUMNS[currentPosition.col];
          }
        }
      }
    }

    movingPiece.moveList.push({ row: row, col: col });
    const checkMovesFromOpponent = probeForCheck(isWhiteTurn);

    if (checkMovesFromOpponent.length !== 0) {
      movingPiece.moveList.pop();
      if (castledRook) {
        castledRook.moveList.pop();
      }

      if (capturedPiece) {
        capturedPiece.isCaptured = false;
      }
      // genMovementTiles({ id: null, tiles: [] });
      return;
    }

    const isPawnPromotionMove =
      movingPiece.title.includes("pawn") && 7 * +isWhiteTurn - row === 0;

    const pawnPromotionMoveObj = genMoveNotation(
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
    );

    if (isPawnPromotionMove) {
      setPawnPromotionInfo({
        isPromoting: true,
        pawnPiece: movingPiece,
        moveObj: pawnPromotionMoveObj,
      });
      genMovementTiles({ id: null, tiles: [] });
      return;
    }

    passPlay();
  }

  function handleMoveHistoryTraversal(moveId = "", traverseVector = "") {
    const moveIndex = getMoveIndex(moveId, traverseVector, traverseIndex);

    clearMoveHistory();
    traverseMoveHistory(moveIndex);

    setTravserseIndex(moveIndex);
    setMoveTiles({
      id: null,
      tiles: [],
    });
  }

  function handleDrop(event, id, row, col) {
    event.preventDefault();
    const draggedData = event.dataTransfer.getData("text/plain");

    if (draggedData === "chess-piece") {
      handlePieceMovement(id, row, col);
    }
  }

  function handleNewGameRequest() {
    clearMoveHistory();
    genMovementTiles({ id: null, tiles: [] });
    setIsWhiteTurn(true);
    setIsBoardFlipped(false);
    setTravserseIndex(-1);
    setGameEndState({ hasEnded: false, reasonCode: null });

    MOVE_HISTORY.length = 0;
  }

  function handleEndGameRequest(reasonCode) {
    setGameEndState({ hasEnded: true, reasonCode: reasonCode });
  }

  function handleModalClose() {
    setGameEndState((prevState) => ({ ...prevState, hasEnded: false }));
  }

  function handlePawnPromotion(promotedPiece, promotedPieceTitle) {
    pawnPromotionInfo.pawnPiece.title = promotedPieceTitle;
    pawnPromotionInfo.pawnPiece.src = promotedPiece;

    let promotionNotation = promotedPieceTitle[6].toUpperCase();
    promotionNotation = promotionNotation === "K" ? "N" : promotionNotation;

    const checkMovesFromCurrentUser = probeForCheck(!isWhiteTurn);
    const opponentIsMate = probeForCheckmate(
      !isWhiteTurn,
      checkMovesFromCurrentUser
    );

    const indexOfEqualSign = pawnPromotionInfo.moveObj.moveTitle.indexOf("=");
    let checkNotation = checkMovesFromCurrentUser.length !== 0 ? "+" : "";
    checkNotation = opponentIsMate ? "#" : checkNotation;

    pawnPromotionInfo.moveObj.moveTitle =
      pawnPromotionInfo.moveObj.moveTitle.slice(0, indexOfEqualSign + 1) +
      promotionNotation +
      checkNotation;

    pawnPromotionInfo.moveObj.pawnPromoMoveInfo = {
      title: promotedPieceTitle,
      src: promotedPiece,
    };

    MOVE_HISTORY.push(pawnPromotionInfo.moveObj);
    setPawnPromotionInfo({ isPromoting: false, pawnPiece: null });
    passPlay();
  }

  const ctxValue = {
    isWhiteTurn: isWhiteTurn,
    isBoardFlipped: isBoardFlipped,
    traverseIndex: traverseIndex,
    moveTiles: moveTiles,
    genMovementTiles: genMovementTiles,
    handlePieceMovement: handlePieceMovement,
    handleDrop: handleDrop,
    handleMoveHistoryTraversal: handleMoveHistoryTraversal,
  };

  return (
    <MatchContext.Provider value={ctxValue}>
      <GameEndModal
        gameEndState={gameEndState}
        isWhiteTurn={isWhiteTurn}
        handleNewGameRequest={handleNewGameRequest}
        handleModalClose={handleModalClose}
      />
      {pawnPromotionInfo.isPromoting && (
        <PawnPromotionModal
          pawnColor={pawnPromotionInfo.pawnPiece.title.includes("white")}
          handlePawnPromotion={handlePawnPromotion}
        />
      )}
      <section id="chess-board-container">
        <Board />
        <MoveHistoryTable />
        <div className="controls">
          <button onClick={() => handleEndGameRequest(2)}>resign</button>
          <button onClick={() => handleEndGameRequest(3)}>draw</button>
        </div>
      </section>
    </MatchContext.Provider>
  );
}
