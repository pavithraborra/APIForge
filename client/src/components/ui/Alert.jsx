// src/components/ui/Alert.jsx
import React from "react";
import { cn } from "./Button";
import { motion, AnimatePresence } from "framer-motion";
import { colors, radii, shadows, spacing } from "../../theme/theme";

/**
 * Alert component for inline messages.
 * Props:
 *  - variant: 'info' | 'warning' | 'error' | 'success'
 *  - title: optional bold title
 *  - children: message body
 *  - onClose: optional callback to dismiss
 */
const variantMap = {
  info: {
    bg: colors.secondary,
    border: colors.border,
    text: colors.primaryText,
  },
  success: {
    bg: colors.success,
    border: colors.success,
    text: colors.primaryText,
  },
  warning: {
    bg: colors.warning,
    border: colors.warning,
    text: colors.primaryText,
  },
  error: {
    bg: colors.danger,
    border: colors.danger,
    text: colors.primaryText,
  },
};

const Alert = ({ variant = "info", title, children, onClose, className }) => {
  const styles = variantMap[variant] || variantMap.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(
          "relative rounded-xl border p-4", // base
          className
        )}
        style={{
          background: styles.bg,
          borderColor: styles.border,
          color: styles.text,
        }}
      >
        {title && (
          <div className="font-medium mb-1" style={{ color: styles.text }}>
            {title}
          </div>
        )}
        <div className="text-sm" style={{ color: styles.text }}>
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
