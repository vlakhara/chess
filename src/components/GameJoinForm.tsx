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

  useEffect(() => {
    const handleMessage = (data: SocketMessage) => {
      const { payload } = data;

      if (data.type === "SELF_JOIN" && payload) {
        const { game, player } = payload as { game: GameState, player: Player };
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
        <h1 className={styles.title}>
          Join Chess Game
        </h1>

        <div className={styles.formGroup}>
          <label
            htmlFor="username"
            className={styles.label}
          >
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
          <label
            htmlFor="gameId"
            className={styles.label}
          >
            Game ID
          </label>
          <input
            id="gameId"
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Enter game ID"
            className={styles.input}
          />
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

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