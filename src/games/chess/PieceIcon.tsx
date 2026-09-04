import React from 'react';
import { PieceType, PieceColor } from './types';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  theme: 'walnut' | 'cyberpunk' | 'sakura';
  className?: string;
}

export const ChessPieceIcon: React.FC<ChessPieceProps> = ({ type, color, theme, className = '' }) => {
  // Theme styling palettes
  const isWhite = color === 'w';

  let fillPrimary = isWhite ? '#FFFFFF' : '#1E293B';
  let strokeColor = isWhite ? '#475569' : '#0F172A';
  let accentColor = isWhite ? '#CBD5E1' : '#334155';
  let glowFilter = '';

  if (theme === 'walnut') {
    if (isWhite) {
      fillPrimary = '#FFFDF5';
      strokeColor = '#573318';
      accentColor = '#DEB887';
    } else {
      fillPrimary = '#2B1708';
      strokeColor = '#C4A482';
      accentColor = '#3D220F';
    }
  } else if (theme === 'cyberpunk') {
    if (isWhite) {
      fillPrimary = '#06B6D4';
      strokeColor = '#E0F2FE';
      accentColor = '#22D3EE';
      glowFilter = 'drop-shadow(0 0 6px rgba(6,182,212,0.9))';
    } else {
      fillPrimary = '#C026D3';
      strokeColor = '#FDF4FF';
      accentColor = '#E879F9';
      glowFilter = 'drop-shadow(0 0 6px rgba(192,38,211,0.9))';
    }
  } else if (theme === 'sakura') {
    if (isWhite) {
      fillPrimary = '#FFF5F7';
      strokeColor = '#E11D48';
      accentColor = '#FECDD3';
    } else {
      fillPrimary = '#4C0519';
      strokeColor = '#FDA4AF';
      accentColor = '#881337';
    }
  }

  // Common SVG wrapper
  const svgProps = {
    viewBox: '0 0 45 45',
    className: `w-4/5 h-4/5 select-none transition-transform duration-150 ${className}`,
    style: glowFilter ? { filter: glowFilter } : undefined,
  };

  switch (type) {
    case 'p': // PAWN
      return (
        <svg {...svgProps}>
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 12,39.5 L 33,39.5"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 17,21 C 17,19 19,17.5 22.5,17.5 C 26,17.5 28,19 28,21"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.2"
          />
        </svg>
      );

    case 'r': // ROOK
      return (
        <svg {...svgProps}>
          <path
            d="M 9,39 L 36,39 L 36,36 L 9,36 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 12,36 L 12,32 L 33,32 L 33,36 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 12,14 L 33,14 L 31,32 L 14,32 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 14,29.5 L 31,29.5"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'n': // KNIGHT
      return (
        <svg {...svgProps}>
          <path
            d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.95,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.99,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,7.4 17.5,7 17.5,7 C 17.5,7 20.5,6.5 22,10 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="15" r="1.5" fill={strokeColor} />
          <path
            d="M 9.5,39.5 L 35.5,39.5"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'b': // BISHOP
      return (
        <svg {...svgProps}>
          <path
            d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,22 30,22 C 30,22 25.5,17.5 22.5,10.5 C 19.5,17.5 15,22 15,22 C 15,22 14.5,30.5 15,32 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <circle cx="22.5" cy="8" r="2" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 17.5,26 L 27.5,26 M 22.5,21 L 22.5,31" stroke={accentColor} strokeWidth="1.2" />
        </svg>
      );

    case 'q': // QUEEN
      return (
        <svg {...svgProps}>
          <path
            d="M 9,39 L 36,39 L 36,36 L 9,36 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 9,26 L 9,14 L 14,21 L 22.5,10 L 31,21 L 36,14 L 36,26 C 36,32 9,32 9,26 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="12" r="2" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="14" cy="19" r="1.5" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="22.5" cy="8" r="2.5" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="31" cy="19" r="1.5" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="36" cy="12" r="2" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 11,32.5 L 34,32.5" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      );

    case 'k': // KING
      return (
        <svg {...svgProps}>
          <path
            d="M 22.5,11.5 L 22.5,4.5 M 19,8 L 26,8"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 9,39 L 36,39 L 36,36 L 9,36 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 11.5,32 C 17,27 15,19 22.5,14 C 30,19 28,27 33.5,32 C 34,33 33.5,36 33.5,36 L 11.5,36 C 11.5,36 11,33 11.5,32 z"
            fill={fillPrimary}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <circle cx="22.5" cy="13.5" r="2" fill={fillPrimary} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 12.5,32.5 L 32.5,32.5" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      );

    default:
      return null;
  }
};
