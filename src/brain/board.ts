import { Board, PieceTypes } from "./types";

export const getInitialBoard = (): Board => {
  const board: Board = [];

  board[0] = [
    { id: 1, type: PieceTypes.ROOK, color: "black", notation: "R" },
    { id: 2, type: PieceTypes.KNIGHT, color: "black", notation: "N" },
    { id: 3, type: PieceTypes.BISHOP, color: "black", notation: "B" },
    { id: 4, type: PieceTypes.QUEEN, color: "black", notation: "Q" },
    { id: 5, type: PieceTypes.KING, color: "black", notation: "K" },
    { id: 6, type: PieceTypes.BISHOP, color: "black", notation: "B" },
    { id: 7, type: PieceTypes.KNIGHT, color: "black", notation: "N" },
    { id: 8, type: PieceTypes.ROOK, color: "black", notation: "R" },
  ];

  board[1] = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: 10 + i + 1,
      type: PieceTypes.PAWN,
      color: "black",
      hasMoved: false,
      notation: ""
    }));

  for (let i = 2; i <= 5; i++) {
    board[i] = Array(8).fill(null);
  }

  board[7] = [
    { id: 71, type: PieceTypes.ROOK, color: "white", notation: "R" },
    { id: 72, type: PieceTypes.KNIGHT, color: "white", notation: "N" },
    { id: 73, type: PieceTypes.BISHOP, color: "white", notation: "B" },
    { id: 74, type: PieceTypes.QUEEN, color: "white", notation: "Q" },
    { id: 75, type: PieceTypes.KING, color: "white", notation: "K" },
    { id: 76, type: PieceTypes.BISHOP, color: "white", notation: "B" },
    { id: 77, type: PieceTypes.KNIGHT, color: "white", notation: "N" },
    { id: 78, type: PieceTypes.ROOK, color: "white", notation: "R" },
  ];

  board[6] = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: 60 + i + 1,
      type: PieceTypes.PAWN,
      color: "white",
      hasMoved: false,
      notation: "",
    }));

  return board;
};
