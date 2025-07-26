import { Board, PieceType } from "./types";

export const getInitialBoard = (): Board => {
  const board: Board = [];

  board[0] = [
    { id: 1, type: PieceType.ROOK, color: "black", notation: "R" },
    { id: 2, type: PieceType.KNIGHT, color: "black", notation: "N" },
    { id: 3, type: PieceType.BISHOP, color: "black", notation: "B" },
    { id: 4, type: PieceType.QUEEN, color: "black", notation: "Q" },
    { id: 5, type: PieceType.KING, color: "black", notation: "K" },
    { id: 6, type: PieceType.BISHOP, color: "black", notation: "B" },
    { id: 7, type: PieceType.KNIGHT, color: "black", notation: "N" },
    { id: 8, type: PieceType.ROOK, color: "black", notation: "R" },
  ];

  board[1] = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: 10 + i + 1,
      type: PieceType.PAWN,
      color: "black",
      hasMoved: false,
      notation: "",
    }));

  for (let i = 2; i <= 5; i++) {
    board[i] = Array(8).fill(null);
  }

  board[7] = [
    { id: 71, type: PieceType.ROOK, color: "white", notation: "R" },
    { id: 72, type: PieceType.KNIGHT, color: "white", notation: "N" },
    { id: 73, type: PieceType.BISHOP, color: "white", notation: "B" },
    { id: 74, type: PieceType.QUEEN, color: "white", notation: "Q" },
    { id: 75, type: PieceType.KING, color: "white", notation: "K" },
    { id: 76, type: PieceType.BISHOP, color: "white", notation: "B" },
    { id: 77, type: PieceType.KNIGHT, color: "white", notation: "N" },
    { id: 78, type: PieceType.ROOK, color: "white", notation: "R" },
  ];

  board[6] = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: 60 + i + 1,
      type: PieceType.PAWN,
      color: "white",
      hasMoved: false,
      notation: "",
    }));

  return board;
};
