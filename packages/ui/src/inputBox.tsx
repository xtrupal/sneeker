"use client";

import React from "react";

interface InputBoxProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export default function InputBox({
  value,
  onChange,
  placeholder,
  disabled = false,
}: InputBoxProps) {
  return (
    <textarea
      className="clean-scroll"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      style={{
        minHeight: "60px",
        maxHeight: "140px",
        width: "400px",
        padding: "14px",
        borderRadius: "12px",
        fontSize: "15px",
        fontFamily: "Inter, system-ui, sans-serif",
        border: "1px solid #2a2f3a",
        background: "#0f1117",
        color: "#e5e7eb",
        outline: "none",
        resize: "none",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
    />
  );
}
