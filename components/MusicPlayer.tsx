"use client";

import useBackgroundMusic from "@/hooks/useBackgroundMusic";

export default function MusicPlayer() {
  // Initializes and runs music globally
  useBackgroundMusic();
  return null;
}
