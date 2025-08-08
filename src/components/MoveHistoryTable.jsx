import FirstMoveIcon from "./icons/FirstMoveIcon.jsx";
import PrevMoveIcon from "./icons/PrevMoveIcon.jsx";
import NextMoveIcon from "./icons/NextMoveIcon.jsx";
import LastMoveIcon from "./icons/LastMoveIcon.jsx";

import { MOVE_HISTORY } from "../MatchConstants.js";

export default function MoveHistoryTable({
  traverseIndex,
  handleMoveHistoryTraversal,
}) {
  return (
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
                    onClick={() => handleMoveHistoryTraversal(eachMove.moveId)}
                  >
                    {eachMove.moveId}
                  </button>

                  {MOVE_HISTORY[index + 1] && (
                    <button
                      className={`move-button${
                        index + 1 === traverseIndex ? " active-move-button" : ""
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
  );
}
