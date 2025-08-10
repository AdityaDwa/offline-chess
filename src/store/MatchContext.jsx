import { createContext } from "react";

export const MatchContext = createContext({
  isWhiteTurn: "",
  isBoardFlipped: "",
  traverseIndex: "",
  moveTiles: "",
  genMovementTiles: () => {},
  handlePieceMovement: () => {},
  handleDrop: () => {},
  handleMoveHistoryTraversal: () => {},
});
