import React from "react";

const FeedbackMessage = ({ message, type = "success" }) => {
  if (!message) return null;

  const styles = {
    success: {
      background: "#065f46",
      color: "#ecfdf5",
      border: "1px solid #059669",
    },
    error: {
      background: "#7f1d1d",
      color: "#fef2f2",
      border: "1px solid #dc2626",
    },
    warning: {
      background: "#92400e",
      color: "#fffbeb",
      border: "1px solid #d97706",
    },
  };

  return (
    <div
      style={{
        ...styles[type],
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 16,
        fontSize: "0.9em",
        fontWeight: "500",
        animation: "fade-in 0.3s ease-out",
      }}
    >
      {type === "success" && "✅ "}
      {type === "error" && "❌ "}
      {type === "warning" && "⚠️ "}
      {message}
    </div>
  );
};

export default FeedbackMessage;
