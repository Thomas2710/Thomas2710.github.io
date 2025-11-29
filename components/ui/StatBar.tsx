"use client";


export const ShieldFull = () => (
  <svg width="20" height="20" viewBox="0 0 16 16">
    <path d="M8 0 L12 2 L14 5 L12 10 L8 16 L4 10 L2 5 L4 2 Z" fill="#00aaff" />
  </svg>
);

export const ShieldEmpty = () => (
  <svg width="20" height="20" viewBox="0 0 16 16">
    <path
      d="M8 0 L12 2 L14 5 L12 10 L8 16 L4 10 L2 5 L4 2 Z"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);



export const HeartFull = () => (
  <svg width="20" height="20" viewBox="0 0 16 16">
    <path
      d="M8 14 L2 8 C0 6 1 3 3 3 C5 3 8 5 8 5 C8 5 11 3 13 3 C15 3 16 6 14 8 L8 14 Z"
      fill="#ff0000"
    />
  </svg>
);

export const HeartEmpty = () => (
  <svg width="20" height="20" viewBox="0 0 16 16">
    <path
      d="M8 14 L2 8 C0 6 1 3 3 3 C5 3 8 5 8 5 C8 5 11 3 13 3 C15 3 16 6 14 8 L8 14 Z"
      fill="none"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);




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


export function StatIcons({
  label,
  value = 0,
  max = 10,
  fullIcon: FullIcon,
  emptyIcon: EmptyIcon,
}: {
  label: string;
  value?: number | null;
  max?: number;
  fullIcon: React.ComponentType;
  emptyIcon: React.ComponentType;
}) {
  const safeValue = value ?? 0;
  const ratio = safeValue / max;
  const filled = Math.round(ratio * 5);

  return (
    <div style={{ width: "100%", marginBottom: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          marginBottom: "2px",
        }}
      >
        <span>{label}</span>
        <span>{`${Math.round(ratio * 100)}/100`}</span>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: 5 }).map((_, i) =>
          i < filled ? <FullIcon key={i} /> : <EmptyIcon key={i} />
        )}
      </div>
    </div>
  );
}
