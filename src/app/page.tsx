"use client";

import { GameState, GameStatus, Player } from "@/brain/types";
import Board from "@/components/Board";
import GameJoinForm from "@/components/GameJoinForm";
import ServerOffline from "@/components/ServerOffline";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { initializeSocket, getReconnectAttempts } from "@/lib/socket";

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  useEffect(() => {
    const socket = initializeSocket();

    if (socket) {
      setIsSocketConnected(socket.readyState === WebSocket.OPEN);

      // Add event listeners for connection state changes
      const handleOpen = () => {
        console.log("Socket connected");
        setIsSocketConnected(true);
        setReconnectAttempts(0);
      };

      const handleClose = () => {
        console.log("Socket disconnected");
        setIsSocketConnected(false);
      };

      const handleError = (error: Event) => {
        console.error("Socket error:", error);
        setIsSocketConnected(false);
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("close", handleClose);
      socket.addEventListener("error", handleError);

      // If socket is already open, set connected state
      if (socket.readyState === WebSocket.OPEN) {
        setIsSocketConnected(true);
      } else if (socket.readyState === WebSocket.CONNECTING) {
        // Socket is connecting, show as connected to avoid "server offline" message
        setIsSocketConnected(true);
      }

      // Cleanup function
      return () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("close", handleClose);
        socket.removeEventListener("error", handleError);
      };
    } else {
      setIsSocketConnected(false);
    }
  }, []);

  // Monitor reconnection attempts
  useEffect(() => {
    const interval = setInterval(() => {
      setReconnectAttempts(getReconnectAttempts());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    return <GameJoinForm setPlayer={setPlayer} setGame={setGame} />;
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
