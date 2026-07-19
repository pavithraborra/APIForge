// src/components/ui/PrimaryButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { colors, spacing, radii, shadows, fonts } from "../../theme/theme";

/**
 * Primary button matching Warm Peach design.
 * Props: children, onClick, disabled, className, ...rest
 */
const PrimaryButton = ({ children, onClick, disabled = false, className = "", ...rest }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2, backgroundColor: colors.gold }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: colors.primary,
        color: colors.primaryText,
        fontFamily: fonts.primary,
        fontWeight: 600,
        padding: `${spacing.sm} ${spacing.md}`,
        borderRadius: radii.md,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.subtle,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background 0.2s ease",
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryButton;
