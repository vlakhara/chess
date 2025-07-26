import { useCallback, useRef, useState } from "react";
import { PieceType } from "@/brain/types";
import PromotionDialog from "./PromotionDialog";

export function usePromotionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<"white" | "black">("white");
  const resolver = useRef<((piece: PieceType | null) => void) | undefined>(
    undefined
  );

  const askPromotion = useCallback((color: "white" | "black") => {
    setColor(color);
    setIsOpen(true);
    return new Promise<PieceType | null>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleChoose = (piece: PieceType) => {
    setIsOpen(false);
    resolver.current?.(piece);
  };

  const handleClose = () => {
    setIsOpen(false);
    resolver.current?.(null);
  };

  const dialog = (
    <PromotionDialog
      isOpen={isOpen}
      color={color}
      onChoose={handleChoose}
      onClose={handleClose}
      key="promotion-dialog"
    />
  );

  return { askPromotion, dialog };
} 