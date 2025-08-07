import { useState, useEffect } from "react";

import BoardRow from "./BoardRow.jsx";
import Piece from "./Piece.jsx";
import FirstMoveIcon from "./icons/FirstMoveIcon.jsx";
import PrevMoveIcon from "./icons/PrevMoveIcon.jsx";
import NextMoveIcon from "./icons/NextMoveIcon.jsx";
import LastMoveIcon from "./icons/LastMoveIcon.jsx";

import { PIECES_INFO } from "../PiecesInfo.js";
import { computePiecePosition, getPieceAtCoords } from "../PieceUtility.js";
import { pieceIdentifier } from "../MovesValidations.js";

const MOVE_HISTORY = [];
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Board() {
  const [moveTiles, setMoveTiles] = useState({
    id: null,
    tiles: [],
  });

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardFlipped, setIsBoardFlipped] = useState(false);
  const [traverseIndex, setTravserseIndex] = useState(-1);

  const [dummyState, setDummyState] = useState("");

  useEffect(() => {
    // isCheckmate(isWhiteTurn);
    stalemateCondition(isWhiteTurn);
  }, [isWhiteTurn]);

  function kingCheckCondition(turn) {
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

  function stalemateCondition(turn) {
    //is king in check??
    for (const piece of PIECES_INFO) {
      if (piece.title.includes("white") === turn && !piece.isCaptured) {
        const computedPiecePosition = computePiecePosition(piece);

        const returnArray = pieceIdentifier(
          piece,
          computedPiecePosition.row,
          computedPiecePosition.col
        );

        for (const eachMove of returnArray) {
          piece.moveList.push(eachMove);
          const capturedPiece = getPieceAtCoords(eachMove.row, eachMove.col);
          if (capturedPiece) {
            capturedPiece.isCaptured = true;
          }
          const checkMoveArray = kingCheckCondition(turn);
          piece.moveList.pop();
          if (capturedPiece) {
            capturedPiece.isCaptured = false;
          }
          if (checkMoveArray.length === 0) {
            // console.log("not stale");
            return;
          }
        }
      }
    }
    // console.log("stalemate");
  }

  function isCheckmate(turn) {
    const checkMoveArray = kingCheckCondition(turn);

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
        defendingKing.moveList.push(eachMove);
        const capturedPiece = getPieceAtCoords(eachMove.row, eachMove.col);
        if (capturedPiece) {
          capturedPiece.isCaptured = true;
        }
        const tempCheckMoveArray = kingCheckCondition(turn);
        defendingKing.moveList.pop();
        if (capturedPiece) {
          capturedPiece.isCaptured = false;
        }
        if (tempCheckMoveArray.length === 0) {
          // console.log("king is safe no need for others");
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
                const tempCheckMoveArray = kingCheckCondition(turn);
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
                    piece.moveList.push(eachMove);
                    const capturedPiece = getPieceAtCoords(
                      eachMove.row,
                      eachMove.col
                    );
                    if (capturedPiece) {
                      capturedPiece.isCaptured = true;
                    }
                    const tempCheckMoveArray = kingCheckCondition(turn);
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
    const checkMoveArrayForCurrentUser = kingCheckCondition(isWhiteTurn);
    if (checkMoveArrayForCurrentUser.length !== 0) {
      movingPiece.moveList.pop();
      if (capturedPiece) {
        capturedPiece.isCaptured = false;
      }
      // console.log(checkMoveArrayForCurrentUser);
      return;
    }

    const checkMoveArrayForOpponent = kingCheckCondition(!isWhiteTurn);
    const opponentIsMate = isCheckmate(!isWhiteTurn);

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
          ? columns[currentPosition.col]
          : "";
      moveNotation = `${pieceNotation}${pawnCaptureRow}${captureSymbol}${
        columns[col]
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

  let rowIndex = -1;

  return (
    <section id="chess-board-container">
      <div
        className="chess-board"
        style={{ rotate: isBoardFlipped ? "180deg" : "0deg" }}
        onDragOver={(event) => event.preventDefault()}
      >
        {Array.from({ length: 8 }).map(() => {
          rowIndex++;
          return (
            <BoardRow
              key={rowIndex}
              rowIndex={rowIndex}
              isBoardFlipped={isBoardFlipped}
            />
          );
        })}

        {PIECES_INFO.map((piece) => {
          const computedPiecePosition = computePiecePosition(piece);

          const transformXPosition = computedPiecePosition.col * 5.5;
          const transformYPosition = (7 - computedPiecePosition.row) * 5.5;

          if (!piece.isCaptured) {
            return (
              <Piece
                key={piece.id}
                pieceInfo={piece}
                isWhiteTurn={isWhiteTurn}
                isBoardFlipped={isBoardFlipped}
                isMovementAllowed={traverseIndex === MOVE_HISTORY.length - 1}
                style={{
                  transform: `translate(${transformXPosition}rem, ${transformYPosition}rem)`,
                }}
                moveTiles={moveTiles}
                genMovementTiles={genMovementTiles}
              />
            );
          }
        })}

        {moveTiles.tiles.map((move, index) => {
          const transformXPosition = move.col * 5.5;
          const transformYPosition = (7 - move.row) * 5.5;

          return (
            <div
              key={index}
              className="move-tile"
              style={{
                top: `${transformYPosition}rem`,
                left: `${transformXPosition}rem`,
              }}
              onClick={() =>
                handlePieceMovement(moveTiles.id, move.row, move.col)
              }
              onDrop={(event) =>
                handleDrop(event, moveTiles.id, move.row, move.col)
              }
              onDragOver={(event) => event.preventDefault()}
            >
              <div className="move-tile-indicator"></div>
            </div>
          );
        })}
      </div>
      <div className="move-history-section">
        <p>Chess Notation</p>
        <div className="move-history-container">
          {MOVE_HISTORY.length ? (
            MOVE_HISTORY.map((eachMove, index) => {
              if (index % 2 === 0) {
                return (
                  <div className="move-history-row" key={index}>
                    <span className="move-pair-serial-no">
                      {Math.floor(index / 2) + 1}.
                    </span>

                    <button
                      className={`move-button${
                        index === traverseIndex ? " active-move-button" : ""
                      }`}
                      onClick={() =>
                        handleMoveHistoryTraversal(eachMove.moveId)
                      }
                    >
                      {eachMove.moveId}
                    </button>

                    {MOVE_HISTORY[index + 1] && (
                      <button
                        className={`move-button${
                          index + 1 === traverseIndex
                            ? " active-move-button"
                            : ""
                        }`}
                        onClick={() =>
                          handleMoveHistoryTraversal(
                            MOVE_HISTORY[index + 1].moveId
                          )
                        }
                      >
                        {MOVE_HISTORY[index + 1].moveId}
                      </button>
                    )}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="empty-move-history">No moves yet!</div>
          )}
        </div>
        <div className="move-history-navigation">
          <FirstMoveIcon
            isInactive={traverseIndex === -1}
            handleTraverse={handleMoveHistoryTraversal}
          />
          <PrevMoveIcon
            isInactive={traverseIndex === -1}
            handleTraverse={handleMoveHistoryTraversal}
          />
          <NextMoveIcon
            isInactive={traverseIndex === MOVE_HISTORY.length - 1}
            handleTraverse={handleMoveHistoryTraversal}
          />
          <LastMoveIcon
            isInactive={traverseIndex === MOVE_HISTORY.length - 1}
            handleTraverse={handleMoveHistoryTraversal}
            finalIndex={MOVE_HISTORY.length}
          />
        </div>
      </div>
    </section>
  );
}
