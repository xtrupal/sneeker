"use client";

import React from "react";

interface InputBoxProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function InputBox({
  value,
  onChange,
  placeholder,
}: InputBoxProps) {
  return (
    <textarea
      style={{
        maxHeight: "140px",
        minHeight: "40px",
        width: "400px",
        padding: "14px",
        borderRadius: "12px",
        fontSize: "16px",
        fontFamily: "sans-serif",
        border: "2px solid black",
        background: "transparent",
        color: "black",
        resize: "vertical",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "white transparent",
      }}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
