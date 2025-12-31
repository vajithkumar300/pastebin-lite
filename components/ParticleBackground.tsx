// src/components/ParticleBackground.tsx
"use client";

import React, { useMemo } from "react";

const BUBBLES = 220;
const STARS = 60;
const DRIFTERS = 40;

const ParticleBackground: React.FC = () => {
  const elements = useMemo(() => {
    const items = [];

    // 1️⃣ UPWARD BUBBLES / DUST
    for (let i = 0; i < BUBBLES; i++) {
      items.push(
        <div
          key={`bubble-${i}`}
          className="particle bubble"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            width: `${Math.random() * 3 + 2}px`,
            height: `${Math.random() * 3 + 2}px`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      );
    }

    // 2️⃣ DIAGONAL STARS
    for (let i = 0; i < STARS; i++) {
      items.push(
        <div
          key={`star-${i}`}
          className="particle star"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            opacity: Math.random() * 0.8 + 0.3,
          }}
        />
      );
    }

    // 3️⃣ HORIZONTAL DRIFTERS
    for (let i = 0; i < DRIFTERS; i++) {
      const direction = Math.random() > 0.5 ? "ltr" : "rtl";

      items.push(
        <div
          key={`drifter-${i}`}
          className={`particle drifter ${direction}`}
          style={{
            top: `${Math.random() * 100}vh`,
            animationDuration: `${Math.random() * 15 + 20}s`,
            animationDelay: `${Math.random() * 20}s`,
            opacity: Math.random() * 0.4 + 0.1,
          }}
        />
      );
    }

    return items;
  }, []);

  return <div className="particle-layer">{elements}</div>;
};

export default ParticleBackground;
