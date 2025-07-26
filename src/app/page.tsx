"use client";

import { GameState, GameStatus, Player } from "@/brain/types";
import Board from "@/components/Board";
import GameJoinForm from "@/components/GameJoinForm";
import ServerOffline from "@/components/ServerOffline";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  initializeSocket,
  getReconnectAttempts,
  getSocketState,
} from "@/lib/socket";

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [socketState, setSocketState] = useState<string>("UNKNOWN");

  useEffect(() => {
    const socket = initializeSocket();

    if (socket) {
      const currentState = getSocketState();
      setSocketState(currentState);
      setIsSocketConnected(socket.readyState === WebSocket.OPEN);

      // Add event listeners for connection state changes
      const handleOpen = () => {
        console.log("Socket connected");
        setIsSocketConnected(true);
        setSocketState("OPEN");
        setReconnectAttempts(0);
      };

      const handleClose = () => {
        console.log("Socket disconnected");
        setIsSocketConnected(false);
        setSocketState("CLOSED");
      };

      const handleError = (error: Event) => {
        console.error("Socket error:", error);
        setIsSocketConnected(false);
        setSocketState("ERROR");
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("close", handleClose);
      socket.addEventListener("error", handleError);

      // If socket is already open, set connected state
      if (socket.readyState === WebSocket.OPEN) {
        setIsSocketConnected(true);
        setSocketState("OPEN");
      } else if (socket.readyState === WebSocket.CONNECTING) {
        // Socket is connecting, show as connected to avoid "server offline" message
        setIsSocketConnected(true);
        setSocketState("CONNECTING");
      }

      // Cleanup function
      return () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("close", handleClose);
        socket.removeEventListener("error", handleError);
      };
    } else {
      setIsSocketConnected(false);
      setSocketState("NULL");
    }
  }, []);

  // Monitor reconnection attempts and socket state
  useEffect(() => {
    const interval = setInterval(() => {
      setReconnectAttempts(getReconnectAttempts());
      const currentState = getSocketState();
      setSocketState(currentState);

      // Update connection status based on current state
      if (currentState === "OPEN") {
        setIsSocketConnected(true);
      } else if (currentState === "CLOSED" || currentState === "ERROR") {
        setIsSocketConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Debug logging for socket state changes
  useEffect(() => {
    console.log("Socket state changed to:", socketState);
  }, [socketState]);

  useEffect(() => {
    if (game && game.black && game.white) {
      if (player?.color === "white") {
        setOpponent(game.black as Player);
      } else {
        setOpponent(game.white as Player);
      }
    }
  }, [game, player]);

  if (!isSocketConnected) {
    return <ServerOffline reconnectAttempts={reconnectAttempts} />;
  }

  if (!game || !player) {
    return (
      <>
        <GameJoinForm setPlayer={setPlayer} setGame={setGame} />

        {/* Built by credit - only shown on join form */}
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          <a
            href="https://github.com/vlakhara"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#666",
              textDecoration: "none",
              fontSize: "12px",
              padding: "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>Built by</span>
            <span style={{ fontWeight: "bold", color: "#333" }}>
              Vipul Lakhara
            </span>
          </a>
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      {game.status === GameStatus.WAITING_FOR_PLAYER && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "clamp(20px, 5vw, 40px)",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "min(90vw, 400px)",
              width: "100%",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                color: "#333",
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              }}
            >
              Waiting for Opponent
            </h2>
            <p
              style={{
                color: "#666",
                marginBottom: "20px",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              Please wait for another player to join the game.
            </p>
            <div
              style={{
                width: "clamp(30px, 6vw, 40px)",
                height: "clamp(30px, 6vw, 40px)",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </div>
      )}

      <Board
        player={player}
        opponent={opponent as Player}
        game={game}
        setGame={setGame}
        isGameReady={
          game.status === GameStatus.IN_PROGRESS &&
          Boolean(player) &&
          Boolean(opponent)
        }
      />
    </div>
  );
}
