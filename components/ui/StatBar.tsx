"use client";

export function StatBar({
  label,
  value,
  max = 10,
  color = "green",
}: {
  label: string;
  value?: number | null; // allow undefined/null
  max?: number;
  color?: string;
}) {
  const safeValue = value ?? 0; // fallback to 0 if undefined/null/NaN
  const percentage = Math.min(100, (safeValue / max) * 100);

  return (
    <div style={{ width: "100%", marginBottom: "0.4rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.7rem",
          marginBottom: "2px",
        }}
      >
        <span>{label}</span>
        <span>{`${Math.round(percentage)}/100`}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "12px",
          backgroundColor: "#111",
          border: "2px solid white",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
