"use client";

import React, { useEffect } from "react";
import { PieceTypes } from "@/brain/types";

interface PromotionDialogProps {
  isOpen: boolean;
  color: "white" | "black";
  onChoose: (pieceType: PieceTypes) => void;
  onClose: () => void;
}

const CHARACTER_MAP: Record<
  Exclude<PieceTypes, PieceTypes.KING | PieceTypes.PAWN>,
  { white: string; black: string }
> = {
  [PieceTypes.QUEEN]: { white: "♕", black: "♛" },
  [PieceTypes.ROOK]: { white: "♖", black: "♜" },
  [PieceTypes.BISHOP]: { white: "♗", black: "♝" },
  [PieceTypes.KNIGHT]: { white: "♘", black: "♞" },
};

const PromotionDialog: React.FC<PromotionDialogProps> = ({ isOpen, color, onChoose, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "20px",
          padding: "40px 30px",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
          border: "2px solid #333",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Choose Promotion
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "30px" }}>
          {([
            PieceTypes.QUEEN,
            PieceTypes.ROOK,
            PieceTypes.BISHOP,
            PieceTypes.KNIGHT,
          ] as const).map((type) => (
            <button
              key={type}
              onClick={() => onChoose(type)}
              style={{
                background: "none",
                border: "2px solid #4A9782",
                borderRadius: "10px",
                padding: "15px 20px",
                cursor: "pointer",
                fontSize: "2.5rem",
                color: color === "white" ? "#fff" : "#222",
                backgroundColor: color === "white" ? "#4A9782" : "#FCEF91",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = color === "white" ? "#5BA892" : "#FCEF91CC";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = color === "white" ? "#4A9782" : "#FCEF91";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {CHARACTER_MAP[type][color]}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 25px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#444";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#333";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Cancel
        </button>
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PromotionDialog; 