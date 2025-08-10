import blackKing from "../assets/black_king.png";
import whiteKing from "../assets/white_king.png";

const KING_COLOR = ["black", "white"];
const END_GAME_REASONS = ["Checkmate", "Stalemate", "Resignation", "Agreement"];

export default function GameEndModal({
  gameEndState,
  isWhiteTurn,
  handleNewGameRequest,
  handleModalClose,
}) {
  return (
    <section
      className={`modal-backdrop${
        gameEndState.hasEnded ? " modal-backdrop-active" : ""
      }`}
    >
      <div className="end-game-modal">
        <h1>Game End</h1>
        {gameEndState.reasonCode % 2 === 0 ? (
          <h2>{KING_COLOR[+!isWhiteTurn]} King Wins!</h2>
        ) : (
          <h2>Draw</h2>
        )}
        <p className="game-end-state-reason">
          (By {END_GAME_REASONS[gameEndState.reasonCode]})
        </p>
        <div className="score-card">
          <div className="player-icon">
            <img src={whiteKing} alt="white-king" />
            <span>White King</span>
          </div>
          <div className="score">
            {gameEndState.reasonCode % 2 === 0 ? (
              <p>
                <span>{+!isWhiteTurn}</span> - <span>{+isWhiteTurn}</span>
              </p>
            ) : (
              <p>
                <span>1/2</span> - <span>1/2</span>
              </p>
            )}
          </div>
          <div className="player-icon">
            <img src={blackKing} alt="black-king" />
            <span>Black King</span>
          </div>
        </div>
        <div className="end-game-btn-container">
          <button className="new-game-btn" onClick={handleNewGameRequest}>
            New Game
          </button>
          <button className="close-modal-btn" onClick={handleModalClose}>
            Close
          </button>
        </div>
      </div>
    </section>
  );
}
