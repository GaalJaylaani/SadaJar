/* Reusable Islamic geometric corner ornament — pure SVG, no images */

function CornerSVG({ color, size }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} style={{ display: 'block', color }} aria-hidden="true">

      {/* ── Outer bracket lines ── */}
      <line x1="18" y1="6" x2="90" y2="6"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75"/>
      <line x1="6"  y1="18" x2="6"  y2="90" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75"/>

      {/* ── Inner bracket lines (inset) ── */}
      <line x1="18" y1="16" x2="78" y2="16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>
      <line x1="16" y1="18" x2="16" y2="78" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.35"/>

      {/* ── 8-pointed star at corner intersection ── */}
      <polygon
        points="
          11,2  12.3,7.2  16.5,4.5  13.8,8.7
          19,10 13.8,11.3 16.5,15.5 12.3,12.8
          11,18 9.7,12.8  5.5,15.5  8.2,11.3
          3,10  8.2,8.7   5.5,4.5   9.7,7.2
        "
        fill="currentColor" opacity="0.95"
      />

      {/* ── Small filled diamonds on outer horizontal line ── */}
      <rect width="6" height="6" transform="rotate(45 42 6) translate(-3 -3)" fill="currentColor" opacity="0.55"/>
      <rect width="6" height="6" transform="rotate(45 66 6) translate(-3 -3)" fill="currentColor" opacity="0.38"/>

      {/* ── Small filled diamonds on outer vertical line ── */}
      <rect width="6" height="6" transform="rotate(45 6 42) translate(-3 -3)" fill="currentColor" opacity="0.55"/>
      <rect width="6" height="6" transform="rotate(45 6 66) translate(-3 -3)" fill="currentColor" opacity="0.38"/>

      {/* ── Outline diamonds at line ends ── */}
      <rect width="7" height="7" transform="rotate(45 90 6) translate(-3.5 -3.5)" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45"/>
      <rect width="7" height="7" transform="rotate(45 6 90) translate(-3.5 -3.5)" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45"/>

      {/* ── Inner bracket corner: small diamond ornament ── */}
      <rect width="5" height="5" transform="rotate(45 18 16) translate(-2.5 -2.5)" fill="currentColor" opacity="0.4"/>

      {/* ── Tiny accent dots ── */}
      <circle cx="90" cy="16" r="1.8" fill="currentColor" opacity="0.3"/>
      <circle cx="16" cy="90" r="1.8" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

/**
 * Four corner ornaments using pure SVG geometry.
 * @param {string}  color  – CSS color
 * @param {number}  size   – px
 * @param {boolean} fixed  – position:fixed (full page) vs position:absolute (card)
 * @param {number}  inset  – px offset from edge
 */
export default function CornerDecor({ color = '#c9a227', size = 80, isFixed = false, inset = 0 }) {
  const pos = isFixed ? 'fixed' : 'absolute';
  const base = { position: pos, pointerEvents: 'none', zIndex: 0 };

  return (
    <>
      {/* Top-left */}
      <div style={{ ...base, top: inset, left: inset }}>
        <CornerSVG color={color} size={size} />
      </div>

      {/* Top-right — mirror X */}
      <div style={{ ...base, top: inset, right: inset, transform: 'scaleX(-1)' }}>
        <CornerSVG color={color} size={size} />
      </div>

      {/* Bottom-left — mirror Y */}
      <div style={{ ...base, bottom: inset, left: inset, transform: 'scaleY(-1)' }}>
        <CornerSVG color={color} size={size} />
      </div>

      {/* Bottom-right — mirror both */}
      <div style={{ ...base, bottom: inset, right: inset, transform: 'scale(-1,-1)' }}>
        <CornerSVG color={color} size={size} />
      </div>
    </>
  );
}
