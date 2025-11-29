'use client';

import React from 'react';

type RetroMuteButtonProps = {
  muted: boolean;
  onClick: () => void;
  size?: number; // default 32px
};

export default function PixelSilenceButton({ muted, onClick, size = 32 }: RetroMuteButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speaker base */}
        <polygon points="16,24 32,24 40,16 40,48 32,40 16,40" fill="#f4f4f4" stroke="#000" strokeWidth="2" />
        
        {/* Sound waves (only when unmuted) */}
        {!muted && (
          <>
            <path d="M44 24 C48 28, 48 36, 44 40" stroke="#f4f4f4" strokeWidth="2" fill="none" />
            <path d="M50 18 C56 24, 56 40, 50 46" stroke="#f4f4f4" strokeWidth="2" fill="none" />
          </>
        )}

        {/* Red slash when muted */}
        {muted && (
          <line x1="12" y1="12" x2="52" y2="52" stroke="#ff2b2b" strokeWidth="4" />
        )}
      </svg>
    </button>
  );
}
