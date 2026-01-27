"use client";

import React from "react";

interface MsgBoxProps {
  data: string;
}

export default function MsgBox({ data }: MsgBoxProps) {
  return (
    <div
      style={{
        width: "450px",
        height: "200px",
        border: "2px solid black",
        borderRadius: "12px",
        padding: "16px",
        color: "orange",
        fontSize: "18px",
        fontFamily: "sans-serif monospace",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        scrollbarWidth: "thin",
        scrollbarColor: "white transparent",
      }}
    >
      {data}
    </div>
  );
}
