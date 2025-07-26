import React from "react";
import styles from "@/styles/BoardLabel.module.css";

interface BoardLabelProps {
  text: string;
  position: "top-left" | "bottom-right";
  dark?: boolean;
}

const BoardLabel: React.FC<BoardLabelProps> = ({ text, position, dark }) => {
  const className = `${styles.label} ${
    position === "top-left" ? styles.topLeft : styles.bottomRight
  } ${dark ? styles.dark : styles.light}`;

  return <div className={className}>{text}</div>;
};

export default BoardLabel; 