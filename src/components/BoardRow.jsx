import { COLUMNS } from "../constants/MatchConstants.js";

export default function BoardRow({ rowIndex, isBoardFlipped }) {
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
            {rowIndex == 7 - checkingCondition ? COLUMNS[columnIndex] : ""}
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
