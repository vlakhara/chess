"use client";

import { getInitialBoard } from "@/brain/board";
import {
  getKing,
  getValidMoves,
  isAnyMoveLeft,
  isKingCheckMate,
  isKingInCheck,
  movePiece,
  promote,
} from "@/brain/move";
import {
  Board as BoardType,
  CHARACTER_MAP,
  Move,
  Piece,
  PieceTypes,
  Position,
} from "@/brain/types";
import { useState } from "react";
import History from "./History";
import WinnerDialog from "./WinnerDialog";
import confetti from "canvas-confetti";
import { usePromotionDialog } from "./usePromotionDialog";

const Board = () => {
  const [board, setBoard] = useState<BoardType>(getInitialBoard());
  const [turn, setTurn] = useState<"white" | "black">("white");
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [moves, setMoves] = useState<Position[]>([]);
  const [history, setHistory] = useState<Move[]>([]);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckMate, setIsCheckMate] = useState<boolean>(false);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const { askPromotion, dialog: promotionDialog } = usePromotionDialog();

  const handleSquareClick = async (position: Position) => {
    const { x, y } = position;
    if (selectedPosition?.x === x && selectedPosition?.y === y) {
      setSelectedPosition(null);
      setActivePiece(null);
      setMoves([]);
      return;
    }

    const piece = board[x][y];

    const isHighlightedSquare = moves.find(
      (move) => move.x === x && move.y === y
    );

    if (isHighlightedSquare) {
      if (!activePiece || !selectedPosition) return;

      let _board = movePiece(board, selectedPosition, position);
      let choice = null;

      if (
        activePiece.type === PieceTypes.PAWN &&
        ((activePiece.color === "white" && position.x === 0) ||
          (activePiece.color === "black" && position.x === 7))
      ) {
        choice = await askPromotion(activePiece.color);
      }

      if (choice) {
        _board = promote(_board, choice, position, activePiece.color);
      }

      const capturedPiece = board[position.x][position.y];

      const history: Move = {
        from: selectedPosition,
        to: position,
        piece: activePiece,
        capturedPiece: capturedPiece,
      };

      if (choice) {
        history.isPromoted = Boolean(choice);
        history.promotedTo = choice;
      }

      if (
        activePiece.type === PieceTypes.KING &&
        Math.abs(position.y - selectedPosition.y) === 2
      ) {
        history.isCastle = true;
      }

      const nextTurn = turn === "white" ? "black" : "white";
      const kingPiece = getKing(board, nextTurn);
      let isCheck = false;
      if (kingPiece?.piece && kingPiece?.position) {
        isCheck = isKingInCheck(_board, kingPiece?.position);
      }

      setHistory((prev) => [...prev, history]);
      setBoard(_board);
      setIsCheck(isCheck);
      resetStates();
      if (isCheck) {
        const isCheckMate = isKingCheckMate(_board, nextTurn);
        if (isCheckMate) {
          setWinner(turn);
          setShowWinnerDialog(true);
          setTimeout(() => {
            handleClick();
          }, 100);
        }
        setIsCheckMate(isCheckMate);
      } else {
        if (!isAnyMoveLeft(_board, nextTurn)) {
          setIsStalemate(true);
          setShowWinnerDialog(true);
        }
      }
      setTurn(nextTurn);
    } else if (piece && piece.color === turn) {
      setActivePiece(piece);
      setSelectedPosition(position);
      const moves = getValidMoves(board, position, history);
      setMoves(moves);
    } else {
      resetStates();
    }
  };

  const resetStates = () => {
    setActivePiece(null);
    setSelectedPosition(null);
    setMoves([]);
  };

  const resetBoard = () => {
    resetStates();
    setIsCheck(false);
    setIsCheckMate(false);
    setWinner(null);
    setShowWinnerDialog(false);
    setHistory([]);
    setTurn("white");
    setIsStalemate(false);
    setBoard(getInitialBoard());
  };

  const getSquareColor = (position: Position) => {
    const { x, y } = position;
    const piece = board[x][y];
    const isKing = piece?.type === PieceTypes.KING;

    if (isCheck && isKing && piece.color === turn) {
      return "#8E1616";
    }

    const isHighlight = moves.find((move) => move.x === x && move.y === y);
    if (isHighlight) return "#FCEF91";
    return (x + y) % 2 === 0 ? "#004030" : "#4A9782";
  };

  const handleClick = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
        zIndex: 9999, // Ensure confetti appears above dialog
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        zIndex: 9999, // Ensure confetti appears above dialog
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        gap: "20px",
      }}
    >
      <div
        style={{
          height: "800px",
          width: "800px",
          boxShadow: "0 0 10px #fff",
          borderRadius: "10px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
        }}
      >
        {board.map((row, x) =>
          row.map((piece, y) => (
            <div
              key={`${x}-${y}`}
              style={{
                height: "100px",
                width: "100px",
                backgroundColor: getSquareColor({ x, y }),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleSquareClick({ x, y })}
            >
              <p
                style={{
                  fontSize: "5rem",
                  color: piece?.color,
                  cursor: "pointer",
                  userSelect: "none",
                  opacity: isCheckMate && piece?.color === turn ? 0.6 : 1,
                  transform:
                    activePiece?.id === piece?.id ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                  display: "inline-block",
                }}
              >
                {piece && CHARACTER_MAP[piece.type][piece.color]}
              </p>
            </div>
          ))
        )}
      </div>
      <History history={history} />
      <WinnerDialog
        winner={winner}
        isOpen={showWinnerDialog}
        onClose={resetBoard}
        isStalemate={isStalemate}
      />
      {promotionDialog}
    </div>
  );
};

export default Board;
