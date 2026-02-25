"use client";

import { motion, useReducedMotion } from "framer-motion";

type FilterValue = "all" | "verified" | "contact";

type FilterChipsProps = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
};

const chips: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "verified", label: "Con verificación" },
  { value: "contact", label: "Con contacto" }
];

export function FilterChips({ value, onChange }: FilterChipsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const active = value === chip.value;

        return (
          <motion.button
            key={chip.value}
            type="button"
            onClick={() => onChange(chip.value)}
            whileTap={reduceMotion ? { opacity: 0.92 } : { scale: 0.97 }}
            whileHover={reduceMotion ? { opacity: 0.98 } : { y: -1 }}
            className={`kc-filter-chip ${active ? "kc-filter-chip--active" : ""}`}
            aria-pressed={active}
          >
            {chip.label}
          </motion.button>
        );
      })}
    </div>
  );
}
