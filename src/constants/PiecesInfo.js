import blackPawn from "../assets/black_pawn.png";
import blackRook from "../assets/black_rook.png";
import blackKnight from "../assets/black_knight.png";
import blackBishop from "../assets/black_bishop.png";
import blackQueen from "../assets/black_queen.png";
import blackKing from "../assets/black_king.png";
import whitePawn from "../assets/white_pawn.png";
import whiteRook from "../assets/white_rook.png";
import whiteKnight from "../assets/white_knight.png";
import whiteBishop from "../assets/white_bishop.png";
import whiteQueen from "../assets/white_queen.png";
import whiteKing from "../assets/white_king.png";

export const DIRECTION_VECTORS = {
  rook: [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ],

  knight: [
    { row: 1, col: 2 },
    { row: 1, col: -2 },
    { row: -1, col: 2 },
    { row: -1, col: -2 },
    { row: 2, col: 1 },
    { row: 2, col: -1 },
    { row: -2, col: 1 },
    { row: -2, col: -1 },
  ],

  bishop: [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 },
  ],

  king: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 0, col: 1 },
    { row: -1, col: 1 },
    { row: -1, col: 0 },
    { row: -1, col: -1 },
    { row: 0, col: -1 },
    { row: 1, col: -1 },
  ],
};

export const PIECES_INFO = [
  {
    id: "wp1",
    title: "white-rook",
    position: {
      row: 0,
      col: 0,
    },
    moveList: [],
    isCaptured: false,
    src: whiteRook,
  },
  {
    id: "wp2",
    title: "white-knight",
    position: {
      row: 0,
      col: 1,
    },
    moveList: [],
    isCaptured: false,
    src: whiteKnight,
  },
  {
    id: "wp3",
    title: "white-bishop",
    position: {
      row: 0,
      col: 2,
    },
    moveList: [],
    isCaptured: false,
    src: whiteBishop,
  },
  {
    id: "wp4",
    title: "white-queen",
    position: {
      row: 0,
      col: 3,
    },
    moveList: [],
    isCaptured: false,
    src: whiteQueen,
  },
  {
    id: "wp5",
    title: "white-king",
    position: {
      row: 0,
      col: 4,
    },
    moveList: [],
    isCaptured: false,
    castling: {
      isCastlingPossible: false,
      rookCoords: {
        kingsideCastling: { initialCoords: {}, finalCoords: {} },
        queensideCastling: { initialCoords: {}, finalCoords: {} },
      },
    },
    src: whiteKing,
  },
  {
    id: "wp6",
    title: "white-bishop",
    position: {
      row: 0,
      col: 5,
    },
    moveList: [],
    isCaptured: false,
    src: whiteBishop,
  },
  {
    id: "wp7",
    title: "white-knight",
    position: {
      row: 0,
      col: 6,
    },
    moveList: [],
    isCaptured: false,
    src: whiteKnight,
  },
  {
    id: "wp8",
    title: "white-rook",
    position: {
      row: 0,
      col: 7,
    },
    moveList: [],
    isCaptured: false,
    src: whiteRook,
  },
  {
    id: "wp9",
    title: "white-pawn",
    position: {
      row: 1,
      col: 0,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp10",
    title: "white-pawn",
    position: {
      row: 1,
      col: 1,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp11",
    title: "white-pawn",
    position: {
      row: 1,
      col: 2,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp12",
    title: "white-pawn",
    position: {
      row: 1,
      col: 3,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp13",
    title: "white-pawn",
    position: {
      row: 1,
      col: 4,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp14",
    title: "white-pawn",
    position: {
      row: 1,
      col: 5,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp15",
    title: "white-pawn",
    position: {
      row: 1,
      col: 6,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "wp16",
    title: "white-pawn",
    position: {
      row: 1,
      col: 7,
    },
    moveList: [],
    isCaptured: false,
    src: whitePawn,
  },
  {
    id: "bp1",
    title: "black-rook",
    position: {
      row: 7,
      col: 0,
    },
    moveList: [],
    isCaptured: false,
    src: blackRook,
  },
  {
    id: "bp2",
    title: "black-knight",
    position: {
      row: 7,
      col: 1,
    },
    moveList: [],
    isCaptured: false,
    src: blackKnight,
  },
  {
    id: "bp3",
    title: "black-bishop",
    position: {
      row: 7,
      col: 2,
    },
    moveList: [],
    isCaptured: false,
    src: blackBishop,
  },
  {
    id: "bp4",
    title: "black-queen",
    position: {
      row: 7,
      col: 3,
    },
    moveList: [],
    isCaptured: false,
    src: blackQueen,
  },
  {
    id: "bp5",
    title: "black-king",
    position: {
      row: 7,
      col: 4,
    },
    moveList: [],
    isCaptured: false,
    castling: {
      isCastlingPossible: false,
      rookCoords: {
        kingsideCastling: { initialCoords: {}, finalCoords: {} },
        queensideCastling: { initialCoords: {}, finalCoords: {} },
      },
    },
    src: blackKing,
  },
  {
    id: "bp6",
    title: "black-bishop",
    position: {
      row: 7,
      col: 5,
    },
    moveList: [],
    isCaptured: false,
    src: blackBishop,
  },
  {
    id: "bp7",
    title: "black-knight",
    position: {
      row: 7,
      col: 6,
    },
    moveList: [],
    isCaptured: false,
    src: blackKnight,
  },
  {
    id: "bp8",
    title: "black-rook",
    position: {
      row: 7,
      col: 7,
    },
    moveList: [],
    isCaptured: false,
    src: blackRook,
  },
  {
    id: "bp9",
    title: "black-pawn",
    position: {
      row: 6,
      col: 0,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp10",
    title: "black-pawn",
    position: {
      row: 6,
      col: 1,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp11",
    title: "black-pawn",
    position: {
      row: 6,
      col: 2,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp12",
    title: "black-pawn",
    position: {
      row: 6,
      col: 3,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp13",
    title: "black-pawn",
    position: {
      row: 6,
      col: 4,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp14",
    title: "black-pawn",
    position: {
      row: 6,
      col: 5,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp15",
    title: "black-pawn",
    position: {
      row: 6,
      col: 6,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
  {
    id: "bp16",
    title: "black-pawn",
    position: {
      row: 6,
      col: 7,
    },
    moveList: [],
    isCaptured: false,
    src: blackPawn,
  },
];
