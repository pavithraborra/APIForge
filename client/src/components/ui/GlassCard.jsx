// src/components/ui/GlassCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { colors, spacing, radii, shadows } from "../../theme/theme";

/**
 * Glass‑morphism card used throughout the premium UI.
 * Props:
 *   - children: content inside the card
 *   - onClick (optional): makes the card interactive
 *   - className (optional): extra class names
 */
const GlassCard = ({ children, onClick, className = "" }) => {
  const interactive = typeof onClick === "function";
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        borderRadius: radii.lg,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.soft,
        padding: spacing.md,
        color: colors.primaryText,
        fontFamily: "inherit",
        cursor: interactive ? "pointer" : "default",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
