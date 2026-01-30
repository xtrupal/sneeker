"use client";

import React from "react";

interface MsgBoxProps {
  data: string;
}

export default function MsgBox({ data }: MsgBoxProps) {
  return (
    <div
      className="msgbox-scroll"
      style={{
        width: "470px",
        height: "270px",
        borderRadius: "14px",
        padding: "18px",
        background: "#161a23",
        border: "1px solid #2a2f3a",
        color: "#e5e7eb",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: "16px",
        lineHeight: "1.6",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {data}
    </div>
  );
}
