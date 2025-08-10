import blackRook from "../assets/black_rook.png";
import blackKnight from "../assets/black_knight.png";
import blackBishop from "../assets/black_bishop.png";
import blackQueen from "../assets/black_queen.png";
import whiteRook from "../assets/white_rook.png";
import whiteKnight from "../assets/white_knight.png";
import whiteBishop from "../assets/white_bishop.png";
import whiteQueen from "../assets/white_queen.png";

const WHITE_PIECE_TITLES = [
  "white-rook",
  "white-knight",
  "white-bishop",
  "white-queen",
];
const BLACK_PIECE_TITLES = [
  "black-rook",
  "black-knight",
  "black-bishop",
  "black-queen",
];

export default function PawnPromotionModal({ pawnColor, handlePawnPromotion }) {
  const WHITE_PIECES = [whiteRook, whiteKnight, whiteBishop, whiteQueen];
  const BLACK_PIECES = [blackRook, blackKnight, blackBishop, blackQueen];

  const MAPPED_PIECES = pawnColor ? WHITE_PIECES : BLACK_PIECES;
  const MAPPED_PIECE_TITLES = pawnColor
    ? WHITE_PIECE_TITLES
    : BLACK_PIECE_TITLES;

  return (
    <section className="modal-backdrop modal-backdrop-active">
      <div className="end-game-modal promotion-modal">
        <h1>Pawn Promotion</h1>
        <p className="pawn-promotion-modal-info">
          Promote the pawn into any of the following pieces:
        </p>
        <div className="promotion-container-grid">
          {MAPPED_PIECES.map((promotedPiece, index) => {
            return (
              <button
                key={index}
                className="pawn-promotion-btn"
                onClick={() =>
                  handlePawnPromotion(promotedPiece, MAPPED_PIECE_TITLES[index])
                }
              >
                <img src={promotedPiece} alt={MAPPED_PIECE_TITLES[index]} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
