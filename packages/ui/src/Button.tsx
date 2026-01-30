"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 500,
        background: "#1f2937",
        color: "#e5e7eb",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "#374151";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = "#1f2937";
      }}
    >
      {children}
    </button>
  );
}
