"use client";

import { useState, useEffect } from "react";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(typeof Audio !== "undefined" ? new Audio("/music/8bit_bg") : null);

  useEffect(() => {
    if (audio) {
      audio.loop = true; // loop background music
    }
  }, [audio]);

  const togglePlay = () => {
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <button onClick={togglePlay} style={{ padding: "0.5rem", margin: "1rem" }}>
      {playing ? "Pause Music" : "Play Music"}
    </button>
  );
}
