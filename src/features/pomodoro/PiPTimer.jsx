import { Pause, Play, X } from "lucide-react";

export default function PiPTimerContent({
  timeLeft,
  phase,
  taskName,
  isRunning,
  onPause,
  onResume,
  onClose,
}) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const iconButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        backgroundColor: "#18181b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
        gap: "12px",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#a1a1aa",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: "1",
          minWidth: 0,
        }}
      >
        {taskName || (phase === "focus" ? "Focus" : "Break")}
      </span>

      <span
        style={{
          fontSize: "18px",
          fontWeight: 600,
          fontFamily: "ui-monospace, monospace",
          color: "#ffffff",
          letterSpacing: "0.02em",
        }}
      >
        {formattedTime}
      </span>

      <div style={{ display: "flex", gap: "6px", marginLeft: "8px" }}>
        <button
          onClick={isRunning ? onPause : onResume}
          style={iconButtonStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          title={isRunning ? "Pause" : "Resume"}
        >
          {isRunning ? (
            <Pause size={14} color="#ffffff" />
          ) : (
            <Play size={14} color="#ffffff" />
          )}
        </button>

        <button
          onClick={onClose}
          style={iconButtonStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "rgba(239,68,68,0.3)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          title="Close"
        >
          <X size={14} color="#f87171" />
        </button>
      </div>
    </div>
  );
}
