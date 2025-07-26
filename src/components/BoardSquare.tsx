import React from "react";
import { Piece, Position } from "@/brain/types";
import { CHARACTER_MAP } from "@/brain/types";
import styles from "@/styles/BoardSquare.module.css";

interface BoardSquareProps {
  piece: Piece | null;
  position: Position;
  isCheckMate: boolean;
  isActive: boolean;
  getSquareColor: (position: Position) => string;
  onClick: (position: Position) => void;
  playerColor: "white" | "black";
}

const BoardSquare: React.FC<BoardSquareProps> = ({
  piece,
  position,
  isCheckMate,
  isActive,
  getSquareColor,
  onClick,
  playerColor,
}) => {
  const pieceClassName = `${styles.piece} ${
    isActive ? styles.active : ""
  } ${isCheckMate && piece?.color ? styles.checkmate : ""}`;

  return (
    <div
      className={styles.square}
      style={{
        backgroundColor: getSquareColor(position),
        transform: playerColor === "black" ? "rotate(180deg)" : "none",
      }}
      onClick={() => onClick(position)}
    >
      <p
        className={pieceClassName}
        style={{
          color: piece?.color,
        }}
      >
        {piece && CHARACTER_MAP[piece.type][piece.color]}
      </p>
    </div>
  );
};

export default BoardSquare; 