export const CHARACTER_MAP = {
  king: { white: "♔", black: "♚", notation: "K" },
  queen: { white: "♕", black: "♛", notation: "Q" },
  rook: { white: "♖", black: "♜", notation: "R" },
  bishop: { white: "♗", black: "♝", notation: "B" },
  knight: { white: "♘", black: "♞", notation: "N" },
  pawn: { white: "♙", black: "♟︎", notation: "" },
};

export enum PieceTypes {
  KING = "king",
  QUEEN = "queen",
  ROOK = "rook",
  BISHOP = "bishop",
  KNIGHT = "knight",
  PAWN = "pawn",
}

export type Piece = {
  id: number;
  type: PieceTypes;
  color: "white" | "black";
  hasMoved?: boolean;
  notation: string;
};

export type Board = (Piece | null)[][];

export type Position = {
  x: number;
  y: number;
};

export type PieceWithPosition = {
  piece: Piece;
  position: Position;
};

export type Move = {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece | null;
  isPromoted?: boolean;
  isCastle?: boolean;
  promotedTo?: PieceTypes
};

export type PIECE_MOVE = { dx: number; dy: number };
