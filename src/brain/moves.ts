import { PIECE_MOVE } from "./types";

export const KNIGHT_MOVES: PIECE_MOVE[] = [
  { dx: -2, dy: -1 },
  { dx: -1, dy: -2 },
  { dx: +1, dy: -2 },
  { dx: +2, dy: -1 },
  { dx: +2, dy: +1 },
  { dx: +1, dy: +2 },
  { dx: -1, dy: +2 },
  { dx: -2, dy: +1 },
];

export const BISHOP_MOVES: PIECE_MOVE[] = [
  { dx: +1, dy: -1 },
  { dx: -1, dy: +1 },
  { dx: -1, dy: -1 },
  { dx: +1, dy: +1 },
];

export const ROOK_MOVES: PIECE_MOVE[] = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: +1 },
  { dx: -1, dy: 0 },
  { dx: +1, dy: 0 },
];

export const QUEEN_MOVES: PIECE_MOVE[] = [...BISHOP_MOVES, ...ROOK_MOVES];

export const KING_MOVES: PIECE_MOVE[] = [
  { dx: +1, dy: +1 },
  { dx: +1, dy: 0 },
  { dx: +1, dy: -1 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: +1 },
  { dx: -1, dy: +1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: -1 },
];
