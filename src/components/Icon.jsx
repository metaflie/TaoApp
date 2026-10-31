// SVG აიქონების ნაკრები (Figma-ს აიქონების სტილში — მარტივი ხაზოვანი ფორმები)
const PATHS = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /><circle cx="12" cy="16" r="1.2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  id: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14 10h4M14 13.5h3" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" /></>,
  play: <path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" />,
  starFill: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z" fill="currentColor" />,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M19 19v2H6" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  left: <path d="M15 5 8 12l7 7" />,
  right: <path d="m9 5 7 7-7 7" />,
  triLeft: <path d="M17 4v16L5 12z" fill="currentColor" stroke="none" />,
  triRight: <path d="M7 4v16l12-8z" fill="currentColor" stroke="none" />,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5v4h-5z" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />,
  logout: <><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 16l-4-4 4-4M6 12h10" /></>,
  pen: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  eraser: <><path d="m7 21-4-4L14 6l7 7-8 8z" /><path d="M7 21h13M9 11l7 7" /></>,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  bookmarkFill: <path d="M6 3h12v18l-6-4-6 4z" fill="currentColor" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></>,
  feather: <><path d="M20 4c-8 0-14 6-14 14v2h2c8 0 14-6 14-14z" /><path d="M4 20 15 9" /></>,
  scroll: <><path d="M7 4h11a2 2 0 0 1 2 2v1h-4M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" /><path d="M9 9h6M9 13h6M9 17h4" /></>,
  column: <path d="M4 6h16L12 2zM6 8v10M10 8v10M14 8v10M18 8v10M3 21h18M4 18h16" />,
  crown: <path d="m3 7 4.5 4L12 4l4.5 7L21 7l-2 12H5z" />,
  gem: <><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M12 21 8 9l4-6 4 6z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17" cy="9" r="2.6" /><path d="M16.5 14c2.8 0 5 1.9 5 5" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
}

export default function Icon({ name, size = 22, className = '', label }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {PATHS[name]}
    </svg>
  )
}

// დროშები ენის გადამრთველისთვის
export function Flag({ code }) {
  if (code === 'en')
    return (
      <svg width="26" height="17" viewBox="0 0 30 20" aria-hidden="true" className="flag">
        <rect width="30" height="20" fill="#fff" />
        <path d="M13 0h4v20h-4zM0 8h30v4H0z" fill="#CE1124" />
      </svg>
    )
  return (
    <svg width="26" height="17" viewBox="0 0 30 20" aria-hidden="true" className="flag">
      <rect width="30" height="20" fill="#fff" />
      <path d="M13 0h4v20h-4zM0 8h30v4H0z" fill="#E8112D" />
      <g fill="#E8112D">
        <path d="M5.2 2.5h1.6v1.4h1.4v1.6H6.8v1.4H5.2V5.5H3.8V3.9h1.4zM23.2 2.5h1.6v1.4h1.4v1.6h-1.4v1.4h-1.6V5.5h-1.4V3.9h1.4zM5.2 13.1h1.6v1.4h1.4v1.6H6.8v1.4H5.2v-1.4H3.8v-1.6h1.4zM23.2 13.1h1.6v1.4h1.4v1.6h-1.4v1.4h-1.6v-1.4h-1.4v-1.6h1.4z" />
      </g>
    </svg>
  )
}
