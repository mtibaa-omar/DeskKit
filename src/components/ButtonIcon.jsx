import React from "react";
import { motion } from "framer-motion";
import { getColorScheme } from "../styles/colorSchemes";
import { LoaderCircle } from "lucide-react";
export default function ButtonIcon({
  id,
  name,
  icon: Icon,
  onSelectTimer,
  disabled = false,
  colorTheme,
  selectedTimer,
}) {
  const isSelected = selectedTimer === id;
  const colors = getColorScheme(colorTheme);

  return (
    <motion.button
      key={id}
      onClick={() => !disabled && onSelectTimer(id)}
      disabled={disabled}
      className={`relative p-3.5 rounded-2xl transition-all duration-300
                ${
                  isSelected
                    ? "bg-white/90 backdrop-blur-xl shadow-xl border-2 border-white/60"
                    : "bg-white/40 backdrop-blur-md hover:bg-white/60 border-2 border-white/30 hover:border-white/50"
                }
                ${
                  disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
      whileHover={!disabled ? { scale: 1.08, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      title={name}
    >
      <Icon
        className={`w-5 h-5 transition-transform duration-200 ${
          isSelected ? "scale-110" : ""
        }`}
        color={colors.icon}
      />
      {isSelected && (
        <motion.div
          layoutId="timerSelector"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: colors.icon }}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
