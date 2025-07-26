"use client";

import React, { useEffect } from "react";
import { PieceType } from "@/brain/types";

interface PromotionDialogProps {
  isOpen: boolean;
  color: "white" | "black";
  onChoose: (pieceType: PieceType) => void;
  onClose: () => void;
}

const CHARACTER_MAP: Record<
  Exclude<PieceType, PieceType.KING | PieceType.PAWN>,
  { white: string; black: string }
> = {
  [PieceType.QUEEN]: { white: "♕", black: "♛" },
  [PieceType.ROOK]: { white: "♖", black: "♜" },
  [PieceType.BISHOP]: { white: "♗", black: "♝" },
  [PieceType.KNIGHT]: { white: "♘", black: "♞" },
};

const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  onChoose,
  onClose,
}) => {
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
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "20px",
          padding: "clamp(20px, 5vw, 40px) clamp(15px, 3vw, 30px)",
          textAlign: "center",
          maxWidth: "min(90vw, 400px)",
          width: "100%",
          border: "2px solid #333",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Choose Promotion
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(15px, 3vw, 30px)",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          {(
            [
              PieceType.QUEEN,
              PieceType.ROOK,
              PieceType.BISHOP,
              PieceType.KNIGHT,
            ] as const
          ).map((type) => (
            <button
              key={type}
              onClick={() => onChoose(type)}
              style={{
                background: "none",
                border: "2px solid #4A9782",
                borderRadius: "10px",
                padding: "clamp(10px, 2vw, 15px) clamp(15px, 3vw, 20px)",
                cursor: "pointer",
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                color: color === "white" ? "#fff" : "#222",
                backgroundColor: color === "white" ? "#4A9782" : "#FCEF91",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                minWidth: "clamp(50px, 12vw, 80px)",
                minHeight: "clamp(50px, 12vw, 80px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  color === "white" ? "#5BA892" : "#FCEF91CC";
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  color === "white" ? "#4A9782" : "#FCEF91";
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
            padding: "clamp(8px, 2vw, 10px) clamp(15px, 3vw, 25px)",
            fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#444";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
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