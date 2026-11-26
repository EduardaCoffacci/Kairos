
export default function PecaIndustrial() {
  return (
    <svg
      viewBox="0 0 320 260"
      width="100%"
      role="img"
      aria-label="Ilustração de uma engrenagem industrial metálica"
    >
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4F6F8" />
          <stop offset="35%" stopColor="#8995A3" />
          <stop offset="65%" stopColor="#465363" />
          <stop offset="100%" stopColor="#D5DCE3" />
        </linearGradient>

        <linearGradient id="center" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DCE3E9" />
          <stop offset="100%" stopColor="#566474" />
        </linearGradient>

        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="3"
            dy="9"
            stdDeviation="7"
            floodColor="#000000"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      <ellipse
        cx="160"
        cy="222"
        rx="100"
        ry="13"
        fill="#0F172A"
        opacity="0.18"
      />

      <g transform="translate(160 125)" filter="url(#shadow)">
        <g fill="url(#metal)" stroke="#344253" strokeWidth="2">
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x="-13"
              y="-91"
              width="26"
              height="34"
              rx="4"
              transform={`rotate(${i * 30})`}
            />
          ))}
          <circle r="77" />
        </g>

        <circle r="59" fill="#526171" stroke="#D8E0E7" strokeWidth="5" />
        <circle r="43" fill="url(#center)" stroke="#344253" strokeWidth="3" />
        <circle r="17" fill="#263445" stroke="#D8E0E7" strokeWidth="5" />
        <circle r="7" fill="#AAB6C2" />

        {Array.from({ length: 6 }, (_, i) => (
          <circle
            key={i}
            cx={Math.cos((i * Math.PI) / 3) * 50}
            cy={Math.sin((i * Math.PI) / 3) * 50}
            r="4"
            fill="#DCE3E9"
          />
        ))}
      </g>
    </svg>
  );
}
