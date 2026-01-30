import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.6em 1.2em",
        fontSize: "18px",
        fontWeight: "600",
        margin: "5px",
        borderRadius: "8px",
        boxShadow: "0.1em 0.1e",
        border: "3px solid black",
        color: "black",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: variant === "primary" ? "#fbca1f" : "gray",
      }}
    >
      {children}
    </button>
  );
}
