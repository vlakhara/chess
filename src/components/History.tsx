"use client";

import { Move, PieceType } from "@/brain/types";
import React, { FC, useEffect, useRef } from "react";

type Props = {
  history: Move[];
};

const History: FC<Props> = ({ history }) => {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={historyRef}
      style={{
        position: "fixed",
        top: "clamp(20px, 3vh, 32px)",
        right: "clamp(10px, 2vw, 32px)",
        width: "clamp(150px, 20vw, 220px)",
        height: "clamp(150px, 30vh, 300px)",
        padding: "clamp(0.5rem, 1vw, 1rem)",
        backgroundColor: "#111",
        color: "#eee",
        fontFamily: "monospace",
        fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
        lineHeight: "1.8",
        borderRadius: "8px",
        overflowY: "auto",
        boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
        zIndex: 1000,
      }}
    >
      {history.map((move, i) => (
        <div key={i}>
          {!move.isCastle
            ? `${i + 1}. ${move.piece.notation}${
                move.capturedPiece
                  ? move.piece.type === PieceType.PAWN
                    ? "dx"
                    : "x"
                  : ""
              }${"abcdefgh".charAt(move.to.y)}${8 - move.to.x}`
            : `${i + 1}. ${move.to.y === 2 ? "o-o-o" : "o-o"}`}
        </div>
      ))}
    </div>
  );
};

export default History;
