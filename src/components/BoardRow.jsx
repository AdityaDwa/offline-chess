export default function BoardRow({ rowIndex, isBoardFlipped }) {
  const columnsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  let columnIndex = -1;
  return (
    <>
      {Array.from({ length: 8 }).map(() => {
        let cssClasses = "chess-box";
        const checkingCondition = !isBoardFlipped ? 0 : 7;
        const colorCondition = (rowIndex + columnIndex) % 2 === 0;
        columnIndex++;

        if (colorCondition) {
          cssClasses += " dark-chess-box";
        }

        const rowLetter = (
          <span
            className="row-letter"
            style={{
              color: colorCondition ? "rgb(217, 230, 245)" : "#18354f",
            }}
          >
            {columnIndex == checkingCondition ? 8 - rowIndex : ""}
          </span>
        );

        const columnLetter = (
          <span
            className="column-letter"
            style={{
              color: colorCondition ? "rgb(217, 230, 245)" : "#18354f",
            }}
          >
            {rowIndex == 7 - checkingCondition
              ? columnsLetters[columnIndex]
              : ""}
          </span>
        );

        return (
          <span
            key={columnIndex}
            className={cssClasses}
            style={{
              rotate: isBoardFlipped ? "180deg" : "0deg",
            }}
          >
            {rowLetter}
            {columnLetter}
          </span>
        );
      })}
    </>
  );
}

//pawn promotion, notation, movehistory
//en passant, notation, movehistory
//endgame resign
//castling not done
//checkmate and stalemate not done(pinned pieces)
//move traverse tile array empty

//clashing move notation fix
//same name clashing in list too
//refactor localstorage variable names code optimization
