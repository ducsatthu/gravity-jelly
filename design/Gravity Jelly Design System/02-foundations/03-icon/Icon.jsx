import React from 'react';

/**
 * Icon — the Gravity Jelly glyph set. Lucide-style: 24x24 viewBox,
 * 2px round stroke, no fill. Inline so the bundle stays dependency-free.
 */

const PATHS = {
  pause:    <><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></>,
  play:     <path d="M7 5l12 7-12 7V5z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
  rotate:   <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v4h4" /></>,
  rotateCw: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v4h-4" /></>,
  volume:   <><path d="M5 9v6h4l5 4V5L9 9H5z" /><path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" /></>,
  mute:     <><path d="M5 9v6h4l5 4V5L9 9H5z" /><path d="M21 9l-6 6M15 9l6 6" /></>,
  music:    <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  vibrate:  <><rect x="9" y="4" width="6" height="16" rx="2" /><path d="M4 9v6M20 9v6" /></>,
  globe:    <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
  info:     <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  close:    <path d="M6 6l12 12M18 6L6 18" />,
  back:     <path d="M15 5l-7 7 7 7" />,
  home:     <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></>,
  refresh:  <><path d="M4 12a8 8 0 0 1 13.6-5.7L20 8" /><path d="M20 4v4h-4" /><path d="M20 12a8 8 0 0 1-13.6 5.7L4 16" /><path d="M4 20v-4h4" /></>,
  heart:    <path d="M12 20s-7-4.7-9.3-9C1.2 8.3 2.6 5 5.8 5 8 5 9.4 6.6 12 9c2.6-2.4 4-4 6.2-4 3.2 0 4.6 3.3 3.1 6-2.3 4.3-9.3 9-9.3 9z" />,
  star:     <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z" />,
  trophy:   <><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M10 20v-3M14 20v-3" /></>,
  x2:       <><path d="M4 8l5 8M9 8l-5 8" /><path d="M14 9a2 2 0 1 1 4 0c0 2-4 3.5-4 7h4" /></>,
  chevron:  <path d="M9 6l6 6-6 6" />,
  check:    <path d="M5 12.5l4 4L19 7" />,
};

export function Icon({ name = 'info', size = 24, color = 'currentColor', strokeWidth = 2, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {PATHS[name] || PATHS.info}
    </svg>
  );
}
