// src/components/ui/Card.jsx
import React from "react";
import { motion } from "framer-motion";
import { colors, radii, shadows, spacing } from "../../theme/theme";

/**
 * Premium Card component with optional hover effect.
 * Props:
 *   - children: content inside the card
 *   - hoverable (default true): enables subtle lift on hover
 *   - className: additional class names
 */
const Card = ({ children, hoverable = true, className = "" }) => {
  const baseStyle = {
    background: "rgba(255,255,255,0.75)", // semi‑transparent for glass‑morphism
    backdropFilter: "blur(12px)",
    borderRadius: radii.lg,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.soft,
    padding: spacing.md,
    color: colors.textPrimary,
  };

  return hoverable ? (
    <motion.div
      whileHover={{ y: -4, scale: 1.01, boxShadow: shadows.elevated }}
      style={baseStyle}
      className={className}
    >
      {children}
    </motion.div>
  ) : (
    <div style={baseStyle} className={className}>
      {children}
    </div>
  );
};

export default Card;
