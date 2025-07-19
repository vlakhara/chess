"use client";

import { useEffect } from "react";

interface WinnerDialogProps {
  winner: "white" | "black" | null;
  isOpen: boolean;
  onClose: () => void;
  isStalemate?: boolean;
}

const WinnerDialog = ({ winner, isOpen, onClose, isStalemate }: WinnerDialogProps) => {
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

  if (!isOpen || (!winner && !isStalemate)) return null;

  if (isStalemate) {
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
            padding: "40px",
            textAlign: "center",
            maxWidth: "500px",
            width: "90%",
            border: "2px solid #333",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            animation: "slideIn 0.3s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "20px",
              color: "#FFD700",
              textShadow: `0 0 20px #FFD70040`,
            }}
          >
            
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Stalemate!
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#CCCCCC",
              marginBottom: "30px",
              lineHeight: "1.5",
            }}
          >
            The game is a draw by stalemate. No legal moves remain, and the king is not in check.
          </p>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#4A9782",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "15px 30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5BA892";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4A9782";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Close
          </button>
        </div>
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
    );
  }

  const winnerColor = winner === "white" ? "#FFFFFF" : "#000000";
  const winnerText = winner === "white" ? "White" : "Black";

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
          padding: "40px",
          textAlign: "center",
          maxWidth: "500px",
          width: "90%",
          border: "2px solid #333",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "20px",
            color: winnerColor,
            textShadow: `0 0 20px ${winnerColor}40`,
          }}
        >
          {winner === "white" ? "♔" : "♚"}
        </div>
        
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {winnerText} Wins!
        </h1>
        
        <p
          style={{
            fontSize: "1.2rem",
            color: "#CCCCCC",
            marginBottom: "30px",
            lineHeight: "1.5",
          }}
        >
          Congratulations! {winnerText} has achieved checkmate and won the game.
        </p>
        
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#4A9782",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "15px 30px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5BA892";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4A9782";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Close
        </button>
      </div>
      
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
  );
};

export default WinnerDialog; 