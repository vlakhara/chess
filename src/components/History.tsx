"use client";

import { Move, PieceTypes } from "@/brain/types";
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
        top: "32px",
        right: "32px",
        width: "220px",
        height: "300px",
        padding: "1rem",
        backgroundColor: "#111",
        color: "#eee",
        fontFamily: "monospace",
        fontSize: "1rem",
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
                  ? move.piece.type === PieceTypes.PAWN
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
