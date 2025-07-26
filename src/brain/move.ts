import {
  BISHOP_MOVES,
  KING_MOVES,
  KNIGHT_MOVES,
  QUEEN_MOVES,
  ROOK_MOVES,
} from "./moves";
import {
  Board,
  CHARACTER_MAP,
  Move,
  Piece,
  PIECE_MOVE,
  PieceType,
  PieceWithPosition,
  Position,
} from "./types";

export const getValidMoves = (
  board: Board,
  position: Position,
  history?: Move[]
): Position[] => {
  const { x, y } = position;
  const piece = board[x][y];
  if (!piece) return [];
  const moves: Position[] = [];

  switch (piece.type) {
    case PieceType.PAWN: {
      const direction = piece.color === "white" ? -1 : 1;

      const oneStep = x + direction;
      const twoStep = x + 2 * direction;

      if (!isSquareEmpty(board, { x, y: y - 1 })) {
        const opponent = board[x][y - 1];

        let lastMove = null;

        if (history) {
          lastMove = history[history?.length - 1];
        }

        const wasEnPassant =
          lastMove &&
          lastMove.piece.id === opponent?.id &&
          lastMove.piece.color !== piece.color &&
          Math.abs(lastMove.from.x - lastMove.to.x) === 2;

        if (
          opponent &&
          wasEnPassant &&
          opponent.type === PieceType.PAWN &&
          opponent.color !== piece.color
        ) {
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            { x: oneStep, y: y - 1 }
          );

          if (willKingBeSafe) moves.push({ x: oneStep, y: y - 1 });
        }
      }

      if (!isSquareEmpty(board, { x, y: y + 1 })) {
        const opponent = board[x][y + 1];

        let lastMove = null;

        if (history) {
          lastMove = history[history?.length - 1];
        }

        const wasEnPassant =
          lastMove &&
          lastMove.piece.id === opponent?.id &&
          lastMove.piece.color !== piece.color &&
          Math.abs(lastMove.from.x - lastMove.to.x) === 2;

        if (
          opponent &&
          wasEnPassant &&
          opponent.type === PieceType.PAWN &&
          opponent.color !== piece.color
        ) {
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            { x: oneStep, y: y - +1 }
          );

          if (willKingBeSafe) moves.push({ x: oneStep, y: y + 1 });
        }
      }

      if (isSquareEmpty(board, { x: oneStep, y })) {
        const willKingBeSafe = willKingBeSafeAfterMove(board, piece, position, {
          x: oneStep,
          y,
        });
        if (willKingBeSafe) moves.push({ x: oneStep, y });
        if (!piece.hasMoved && isSquareEmpty(board, { x: twoStep, y })) {
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            {
              x: twoStep,
              y,
            }
          );
          if (willKingBeSafe) moves.push({ x: twoStep, y });
        }
      }

      if (isSquareWithInBounds({ x: oneStep, y: y - 1 })) {
        const opponent = board[oneStep][y - 1];
        if (opponent && opponent.color !== piece.color) {
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            {
              x: oneStep,
              y: y - 1,
            }
          );
          if (willKingBeSafe) moves.push({ x: oneStep, y: y - 1 });
        }
      }

      if (isSquareWithInBounds({ x: oneStep, y: y + 1 })) {
        const opponent = board[oneStep][y + 1];
        if (opponent && opponent.color !== piece.color) {
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            {
              x: oneStep,
              y: y + 1,
            }
          );
          if (willKingBeSafe) moves.push({ x: oneStep, y: y + 1 });
        }
      }

      return moves;
    }
    case PieceType.KNIGHT: {
      KNIGHT_MOVES.forEach((move) => {
        const newX = x + move.dx;
        const newY = y + move.dy;

        if (isSquareWithInBounds({ x: newX, y: newY })) {
          const opponent = board[newX][newY];
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            {
              x: newX,
              y: newY,
            }
          );
          if (willKingBeSafe) {
            if (isSquareEmpty(board, { x: newX, y: newY })) {
              moves.push({ x: newX, y: newY });
            } else if (opponent && opponent.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
      });

      return moves;
    }
    case PieceType.BISHOP: {
      return getSlidingMoves(piece, position, BISHOP_MOVES, board, true);
    }
    case PieceType.ROOK: {
      return getSlidingMoves(piece, position, ROOK_MOVES, board, true);
    }
    case PieceType.QUEEN: {
      return getSlidingMoves(piece, position, QUEEN_MOVES, board, true);
    }
    case PieceType.KING: {
      const { canCastleLeft, canCastleRight } = canKingCastle(
        board,
        piece.color
      );

      const row = piece.color === "white" ? 7 : 0;

      if (canCastleLeft) {
        moves.push({ x: row, y: 2 });
      }

      if (canCastleRight) {
        moves.push({ x: row, y: 6 });
      }

      KING_MOVES.forEach((move) => {
        const newX = x + move.dx;
        const newY = y + move.dy;

        if (isSquareWithInBounds({ x: newX, y: newY })) {
          const opponent = board[newX][newY];
          const willKingBeSafe = willKingBeSafeAfterMove(
            board,
            piece,
            position,
            {
              x: newX,
              y: newY,
            }
          );

          if (willKingBeSafe) {
            if (isSquareEmpty(board, { x: newX, y: newY })) {
              moves.push({ x: newX, y: newY });
            } else if (opponent && opponent.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
      });
      return moves;
    }
    default:
      return [];
  }
};

export const getPseudoLegalMoves = (
  board: Board,
  position: Position,
  history?: Move[]
): Position[] => {
  const { x, y } = position;
  const piece = board[x][y];
  if (!piece) return [];
  const moves: Position[] = [];

  switch (piece.type) {
    case PieceType.PAWN: {
      const direction = piece.color === "white" ? -1 : 1;

      const oneStep = x + direction;
      const twoStep = x + 2 * direction;

      if (!isSquareEmpty(board, { x, y: y - 1 })) {
        const opponent = board[x][y - 1];

        let lastMove = null;

        if (history) {
          lastMove = history[history?.length - 1];
        }

        const wasEnPassant =
          lastMove &&
          lastMove.piece.color !== piece.color &&
          Math.abs(lastMove.from.x - lastMove.to.x) === 2;

        if (
          opponent &&
          wasEnPassant &&
          opponent.type === PieceType.PAWN &&
          opponent.color !== piece.color
        ) {
          moves.push({ x: oneStep, y: y - 1 });
        }
      }

      if (!isSquareEmpty(board, { x, y: y + 1 })) {
        const opponent = board[x][y + 1];

        const opponentMoves = history?.filter(
          (item) => item.piece.id === opponent?.id
        );

        const wasEnPassant =
          opponentMoves &&
          opponentMoves?.length === 1 &&
          Math.abs(opponentMoves[0].from.x - opponentMoves[0].to.x) === 2;

        if (
          opponent &&
          wasEnPassant &&
          opponent.type === PieceType.PAWN &&
          opponent.color !== piece.color
        ) {
          moves.push({ x: oneStep, y: y + 1 });
        }
      }

      if (isSquareEmpty(board, { x: oneStep, y })) {
        moves.push({ x: oneStep, y });
        if (!piece.hasMoved && isSquareEmpty(board, { x: twoStep, y })) {
          moves.push({ x: twoStep, y });
        }
      }

      if (isSquareWithInBounds({ x: oneStep, y: y - 1 })) {
        const opponent = board[oneStep][y - 1];
        if (opponent && opponent.color !== piece.color) {
          moves.push({ x: oneStep, y: y - 1 });
        }
      }

      if (isSquareWithInBounds({ x: oneStep, y: y + 1 })) {
        const opponent = board[oneStep][y + 1];
        if (opponent && opponent.color !== piece.color) {
          moves.push({ x: oneStep, y: y + 1 });
        }
      }

      return moves;
    }
    case PieceType.KNIGHT: {
      KNIGHT_MOVES.forEach((move) => {
        const newX = x + move.dx;
        const newY = y + move.dy;

        if (isSquareWithInBounds({ x: newX, y: newY })) {
          const opponent = board[newX][newY];
          if (isSquareEmpty(board, { x: newX, y: newY })) {
            moves.push({ x: newX, y: newY });
          } else if (opponent && opponent.color !== piece.color) {
            moves.push({ x: newX, y: newY });
          }
        }
      });

      return moves;
    }
    case PieceType.BISHOP: {
      return getSlidingMoves(piece, position, BISHOP_MOVES, board);
    }
    case PieceType.ROOK: {
      return getSlidingMoves(piece, position, ROOK_MOVES, board);
    }
    case PieceType.QUEEN: {
      return getSlidingMoves(piece, position, QUEEN_MOVES, board);
    }
    case PieceType.KING: {
      KING_MOVES.forEach((move) => {
        const newX = x + move.dx;
        const newY = y + move.dy;

        if (isSquareWithInBounds({ x: newX, y: newY })) {
          const opponent = board[newX][newY];

          if (isSquareEmpty(board, { x: newX, y: newY })) {
            moves.push({ x: newX, y: newY });
          } else if (opponent && opponent.color !== piece.color) {
            moves.push({ x: newX, y: newY });
          }
        }
      });
      return moves;
    }
    default:
      return [];
  }
};

export const getSlidingMoves = (
  piece: Piece,
  position: Position,
  movesMap: PIECE_MOVE[],
  board: Board,
  checkKingThreat: boolean = false
): Position[] => {
  const { x, y } = position;
  const moves: Position[] = [];
  movesMap.forEach((move) => {
    let newX = x;
    let newY = y;
    while (true) {
      const { dx, dy } = move;
      newX += dx;
      newY += dy;

      const isInBound = isSquareWithInBounds({ x: newX, y: newY });

      if (!isInBound) break;

      const opponent = board[newX][newY];

      let willKingBeSafe = true;

      if (checkKingThreat) {
        willKingBeSafe = willKingBeSafeAfterMove(board, piece, position, {
          x: newX,
          y: newY,
        });
      }

      if (opponent && opponent.color === piece.color) break;
      else if (willKingBeSafe && opponent && opponent.color !== piece.color) {
        moves.push({ x: newX, y: newY });
        break;
      } else {
        if (willKingBeSafe) moves.push({ x: newX, y: newY });
      }
    }
  });

  return moves;
};

export const movePiece = (
  board: Board,
  from: Position,
  to: Position,
  silent: boolean = false
): Board => {
  const newBoard = getDeepCopiedBoard(board);

  const { x: currentX, y: currentY } = from;
  const { x, y } = to;

  const piece = board[currentX][currentY];

  if (!piece) return board;

  const isEmpty = isSquareEmpty(newBoard, to);
  const opponent = board[x][y];

  switch (piece.type) {
    case PieceType.PAWN: {
      const hasMovedStraight = currentY === y;
      const hasMovedDiagonal = Math.abs(currentY - y) === 1;

      const anotherOpponent = board[currentX][y];
      const canPerformEnPassant =
        isEmpty &&
        anotherOpponent !== null &&
        anotherOpponent.type === PieceType.PAWN &&
        anotherOpponent.color !== piece.color;
      if (hasMovedDiagonal && canPerformEnPassant) {
        newBoard[currentX][currentY] = null;
        newBoard[currentX][y] = null;
        newBoard[x][y] = { ...piece, hasMoved: true };
        if (!silent) new Audio("/sounds/capture.mp3").play();
      } else if (hasMovedStraight && isEmpty) {
        newBoard[currentX][currentY] = null;
        newBoard[x][y] = { ...piece, hasMoved: true };
        if (!silent) new Audio("/sounds/move-self.mp3").play();
      } else if (hasMovedDiagonal && opponent) {
        newBoard[currentX][currentY] = null;
        newBoard[x][y] = { ...piece, hasMoved: true };
        if (!silent) new Audio("/sounds/capture.mp3").play();
      }

      return newBoard;
    }
    case PieceType.BISHOP:
    case PieceType.QUEEN:
    case PieceType.ROOK:
    case PieceType.KNIGHT: {
      const opponent = newBoard[x][y];
      if (opponent) {
        if (!silent) new Audio("/sounds/capture.mp3").play();
      } else {
        if (!silent) new Audio("/sounds/move-self.mp3").play();
      }
      newBoard[currentX][currentY] = null;
      newBoard[x][y] = { ...piece, hasMoved: true };
      return newBoard;
    }
    case PieceType.KING: {
      const opponent = newBoard[x][y];
      if (opponent) {
        if (!silent) new Audio("/sounds/capture.mp3").play();
      } else {
        if (!silent) new Audio("/sounds/move-self.mp3").play();
      }

      const isCastle = Math.abs(y - currentY) === 2;
      newBoard[x][y] = { ...piece, hasMoved: true };

      if (isCastle) {
        const col = y === 2 ? 0 : 7;
        const dir = col === 0 ? -1 : 1;
        const rook = board[x][col];
        newBoard[x][col] = null;
        newBoard[x][currentY + dir] = rook;
      }
      newBoard[currentX][currentY] = null;

      return newBoard;
    }
    default:
      return board;
  }
};

export const getKing = (
  board: Board,
  color: string
): PieceWithPosition | null => {
  for (let i = 0; i < board.length; i++) {
    const pieces = board[i];
    for (let j = 0; j < pieces.length; j++) {
      const piece = pieces[j];
      if (piece?.color === color && piece.type === PieceType.KING) {
        return { piece, position: { x: i, y: j } };
      }
    }
  }
  return null;
};

export const isKingInCheck = (
  board: Board,
  kingPosition: Position
): boolean => {
  const piece = board[kingPosition.x][kingPosition.y];

  if (!piece || piece.type !== PieceType.KING) return false;

  const opponentPieces = getSameColoredPieces(
    board,
    piece.color === "white" ? "black" : "white"
  );

  let canBeChecked = false;

  opponentPieces.forEach((opponent) => {
    const { position } = opponent;

    const moves = getPseudoLegalMoves(board, position);

    for (const move of moves) {
      if (move.x === kingPosition.x && move.y === kingPosition.y) {
        canBeChecked = true;
        break;
      }
    }
  });

  return canBeChecked;
};

export const isKingCheckMate = (board: Board, color: string): boolean => {
  let isKingCheckMate = true;
  const pieces = getSameColoredPieces(board, color);

  for (const piece of pieces) {
    const moves = getValidMoves(board, piece.position);
    if (moves.length > 0) {
      isKingCheckMate = false;
      break;
    }
  }

  return isKingCheckMate;
};

export const willKingBeSafeAfterMove = (
  board: Board,
  piece: Piece,
  currentPosition: Position,
  newPosition: Position
): boolean => {
  const { x, y } = currentPosition;

  const { x: _x, y: _y } = newPosition;
  const newBoard = movePiece(board, { x, y }, { x: _x, y: _y }, true);
  const king = getKing(newBoard, piece.color);
  let willKingBeSafe = true;
  if (king?.piece && king.position) {
    willKingBeSafe = !isKingInCheck(newBoard, king?.position);
  }

  return willKingBeSafe;
};

export const canKingCastle = (
  board: Board,
  color: string
): { canCastleLeft: boolean; canCastleRight: boolean } => {
  const kingPiece = getKing(board, color);

  let canCastleLeft = false;
  let canCastleRight = false;

  if (!kingPiece || kingPiece.piece.type !== PieceType.KING)
    return { canCastleLeft, canCastleRight };
  if (kingPiece.piece.hasMoved) return { canCastleLeft, canCastleRight };

  if (isKingInCheck(board, kingPiece.position))
    return { canCastleLeft, canCastleRight };

  const row = color === "white" ? 7 : 0;

  const leftRook = board[row][0];
  const rightRook = board[row][7];

  const leftSquares: Position[] = [
    {
      x: row,
      y: 2,
    },
    {
      x: row,
      y: 3,
    },
  ];

  const rightSquares: Position[] = [
    {
      x: row,
      y: 5,
    },
    {
      x: row,
      y: 6,
    },
  ];

  if (leftRook && !leftRook.hasMoved) {
    if (
      isSquareEmpty(board, {
        x: row,
        y: 1,
      })
    )
      for (const position of leftSquares) {
        const isEmpty = isSquareEmpty(board, position);

        if (!isEmpty) {
          canCastleLeft = false;
          break;
        }
        const willKingBeSafe = willKingBeSafeAfterMove(
          board,
          kingPiece.piece,
          kingPiece.position,
          position
        );

        canCastleLeft = willKingBeSafe;
        if (!canCastleLeft) {
          break;
        }
      }
  }

  if (rightRook && !rightRook.hasMoved) {
    for (const position of rightSquares) {
      const isEmpty = isSquareEmpty(board, position);

      if (!isEmpty) {
        canCastleRight = false;
        break;
      }
      const willKingBeSafe = willKingBeSafeAfterMove(
        board,
        kingPiece.piece,
        kingPiece.position,
        position
      );

      canCastleRight = willKingBeSafe;
      if (!canCastleRight) {
        break;
      }
    }
  }

  return { canCastleLeft, canCastleRight };
};

export const promote = (
  board: Board,
  promoteTo: PieceType,
  position: Position,
  color: "white" | "black"
): Board => {
  const _board = getDeepCopiedBoard(board);
  const piece = _board[position.x][position.y];

  if (!piece) return _board;

  _board[position.x][position.y] = {
    ...piece,
    notation: CHARACTER_MAP[promoteTo].notation,
    type: promoteTo,
    color,
  };

  return _board;
};

export const isAnyMoveLeft = (board: Board, color: string): boolean => {
  const pieces = getSameColoredPieces(board, color);
  const isStalemate = !pieces.some((piece) => {
    const moves = getValidMoves(board, piece.position);
    return moves.length > 0;
  });
  return !isStalemate;
};

export const getSameColoredPieces = (
  board: Board,
  color: string
): PieceWithPosition[] => {
  const pieces: PieceWithPosition[] = [];
  board.forEach((row, x) => {
    row.forEach((piece, y) => {
      if (piece?.color === color) {
        pieces.push({ piece, position: { x, y } });
      }
    });
  });
  return pieces;
};

export const getDeepCopiedBoard = (board: Board): Board => {
  const newBoard: Board = [];
  board.forEach((row, i) => {
    newBoard[i] = row.map((cell) => (cell ? { ...cell } : null));
  });

  return newBoard;
};

export const isSquareEmpty = (board: Board, position: Position): boolean => {
  return (
    isSquareWithInBounds(position) && board[position.x][position.y] === null
  );
};

export const isSquareWithInBounds = (position: Position): boolean => {
  const { x, y } = position;
  return x < 8 && x >= 0 && y < 8 && y >= 0;
};
