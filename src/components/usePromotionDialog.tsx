import { useCallback, useRef, useState } from "react";
import { PieceTypes } from "@/brain/types";
import PromotionDialog from "./PromotionDialog";

export function usePromotionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<"white" | "black">("white");
  const resolver = useRef<((piece: PieceTypes | null) => void) | undefined>(undefined);

  const askPromotion = useCallback((color: "white" | "black") => {
    setColor(color);
    setIsOpen(true);
    return new Promise<PieceTypes | null>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleChoose = (piece: PieceTypes) => {
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