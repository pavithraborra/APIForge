// src/components/ui/EmptyState.jsx
import React from "react";
import { cn } from "./Button";
import { motion } from "framer-motion";
import { colors, spacing, radii } from "../../theme/theme";

/**
 * EmptyState component – shows an illustration and a call‑to‑action.
 * Props:
 *   - icon: React element (e.g., an SVG) – optional
 *   - title: string – required
 *   - description: string – optional
 *   - actionLabel: string – label for the button
 *   - onAction: () => void – click handler for the button
 */
const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        "bg-white/60 backdrop-blur-sm",
        "rounded-2xl border border-borders",
        "max-w-md mx-auto"
      )}
    >
      {icon && (
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mb-4"
        >
          {icon}
        </motion.div>
      )}
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-text-secondary mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className={cn(
            "px-5 py-2 rounded-lg",
            "bg-primary text-white hover:bg-[#D47E70] transition-colors"
          )}
        >
          {actionLabel}
        </motion.button>
      )}
    </div>
  );
};

export default EmptyState;
