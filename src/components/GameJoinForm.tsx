"use client";

import { GameState, Player } from "@/brain/types";
import { SocketMessage, joinGame, onMessage } from "@/lib/socket";
import { useEffect, useState } from "react";
import styles from "@/styles/GameJoinForm.module.css";

interface GameJoinFormProps {
  setPlayer: (player: Player) => void;
  setGame: (game: GameState) => void;
}

const GameJoinForm = ({
  setPlayer,
  setGame,
}: GameJoinFormProps) => {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate initial game ID on component mount
  useEffect(() => {
    generateGameId();
  }, []);

  useEffect(() => {
    const handleMessage = (data: SocketMessage) => {
      const { payload } = data;

      if (data.type === "SELF_JOIN" && payload) {
        const { game, player } = payload as { game: GameState; player: Player };
        setGame(game);
        setPlayer(player);
      }
    };

    onMessage(handleMessage);

    return () => {
      // Note: In a real implementation, you might want to remove the message listener
      // but for simplicity, we'll keep it active
    };
  }, [setGame, setPlayer]);

  const generateGameId = () => {
    // Generate a random 8-character ID similar to the backend
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGameId(result);
  };

  const copyGameId = async () => {
    if (!gameId) return;

    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy game ID:", err);
    }
  };

  const handleJoinGame = () => {
    if (!username.trim() || !gameId.trim()) {
      setError("Please enter both username and game ID");
      return;
    }

    setIsJoining(true);
    setError("");

    // Join the game
    joinGame(gameId, username);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Join Chess Game</h1>

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gameId" className={styles.label}>
            Game ID
          </label>
          <div className={styles.gameIdContainer}>
            <input
              id="gameId"
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter game ID or create a new one"
              className={styles.input}
            />
            <button
              onClick={generateGameId}
              className={styles.refreshButton}
              type="button"
              title="Generate new game ID"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>
          </div>
          {gameId && (
            <div className={styles.copyContainer}>
              <span className={styles.gameIdDisplay}>
                Game ID: <strong>{gameId}</strong>
              </span>
              <button
                onClick={copyGameId}
                className={`${styles.copyButton} ${
                  copied ? styles.copied : ""
                }`}
                type="button"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          onClick={handleJoinGame}
          disabled={isJoining}
          className={styles.button}
        >
          {isJoining ? "Joining..." : "Join Game"}
        </button>
      </div>
    </div>
  );
};

export default GameJoinForm; 