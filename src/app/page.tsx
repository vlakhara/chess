import Board from "@/components/Board";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        <Board />
      </h1>
    </div>
  );
}
