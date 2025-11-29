"use client";

import { useEffect, useState } from "react";

// shared audio globally
let audio: HTMLAudioElement | null = null;

export default function useBackgroundMusic() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!audio) {
      audio = new Audio("/music/8bit_bg.mp3");
      audio.loop = true;
      audio.volume = 0.4;

      audio.play().catch(() => {
        // browser may block autoplay — user will unmute later
      });
    }

    setMuted(audio.muted);
  }, []);

  const toggleMute = () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return { muted, toggleMute };
}
