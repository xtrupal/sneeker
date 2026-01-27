"use client";

import React from "react";
import InputBox from "@repo/ui/inputBox";
import MsgBox from "@repo/ui/msgBox";

export default function HomePage() {
  const [userInput, setUserInput] = React.useState("");

  function handleInputChange(value: string) {
    setUserInput(value);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <MsgBox data={userInput} />
      </div>
      <div>
        <InputBox
          value={userInput}
          onChange={handleInputChange}
          placeholder="yooo..."
        />
        <button
          style={{
            color: "white",
            padding: "14px",
            backgroundColor: "blue",
            marginLeft: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setUserInput("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
