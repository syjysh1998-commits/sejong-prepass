import { useState, useEffect, useRef, useCallback } from "react";

const MAP_IMG = "/map.png";
const CI_IMG = "/ci.jpg";

const DONG_DATA = [
  { id: "haemil", name: "해밀동", x: 40, y: 12, waiting: 3 },
  { id: "goun", name: "고운동", x: 11, y: 22, waiting: 7 },
  { id: "areum", name: "아름동", x: 20, y: 30, waiting: 2 },
  { id: "dodam", name: "도담동", x: 31, y: 28, waiting: 5 },
  { id: "jongchon", name: "종촌동", x: 21, y: 43, waiting: 12, isMain: true },
  { id: "eojin", name: "어진동", x: 32, y: 44, waiting: 4 },
  { id: "naseong", name: "나성동", x: 33, y: 63, waiting: 1 },
  { id: "dajeong", name: "다정동", x: 21, y: 54, waiting: 6 },
  { id: "saerom", name: "새롬동", x: 24, y: 67, waiting: 9 },
  { id: "hansol", name: "한솔동", x: 26, y: 78, waiting: 8 },
  { id: "boram", name: "보람동", x: 57, y: 78, waiting: 3 },
  { id: "daepyeong", name: "대평동", x: 44, y: 89, waiting: 2 },
  { id: "bangok", name: "반곡동", x: 72, y: 53, waiting: 4 },
  { id: "sodam", name: "소담동", x: 65, y: 68, waiting: 1 },
];

function getCongestion(w) {
  if (w >= 10) return { level: "혼잡", color: "#DC2626", bg: "#FEE2E2", ring: "#FECACA", pulse: true };
  if (w >= 5) return { level: "보통", color: "#EA580C", bg: "#FFF7ED", ring: "#FED7AA", pulse: false };
  return { level: "원활", color: "#16A34A", bg: "#F0FDF4", ring: "#BBF7D0", pulse: false };
}
function formatTime(m) { return m < 1 ? "즉시" : `약 ${m}분`; }

function MapPin({ dong, isSelected, onClick, scale }) {
  const c = getCongestion(dong.waiting);
  const size = isSelected ? 38 : 32;
  const invScale = 1 / scale;
  return (
    <div onClick={(e) => { e.stopPropagation(); onClick(dong.id); }}
      style={{ position: "absolute", left: `${dong.x}%`, top: `${dong.y}%`,
        zIndex: isSelected ? 15 : 10, cursor: "pointer",
        transform: `translate(-50%, -50%) scale(${invScale})`, transformOrigin: "center center",
      }}>
      {c.pulse && <div style={{ position: "absolute", left: "50%", top: "50%",
        width: size + 16, height: size + 16, marginLeft: -(size + 16) / 2, marginTop: -(size + 16) / 2,
        borderRadius: "50%", border: `2px solid ${c.color}`, animation: "pulseRing 2s ease-out infinite",
      }} />}
      <div style={{ width: size, height: size, borderRadius: "50%",
        background: isSelected ? c.color : "white", border: `2.5px solid ${c.color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: isSelected ? `0 3px 14px ${c.color}77, 0 0 0 3px ${c.color}22` : "0 2px 8px rgba(0,0,0,0.25), 0 0 0 2px white",
        transition: "all 0.2s ease",
      }}>
        <span style={{ fontSize: isSelected ? 17 : 14, fontWeight: 800,
          color: isSelected ? "white" : c.color, lineHeight: 1,
        }}>{dong.waiting}</span>
      </div>
      <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
        marginTop: 3, whiteSpace: "nowrap",
        background: dong.isMain ? "#0057B8" : "rgba(0,0,0,0.72)",
        color: "white", padding: "2px 6px", borderRadius: 5, fontSize: 10, fontWeight: 700,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}>
        {dong.name}{dong.isMain && <span style={{ fontSize: 8, marginLeft: 2, opacity: 0.8 }}>★</span>}
      </div>
    </div>
  );
}

function ZoomableMap({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef({ active: false, moved: false, startX: 0, startY: 0, posX: 0, posY: 0 });
  const pinchState = useRef({ dist: null, cx: null, cy: null });
  const scaleRef = useRef(1);
  const posRef = useRef({ x: 0, y: 0 });

  // Keep refs in sync with state
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { posRef.current = pos; }, [pos]);

  const clamp = useCallback((x, y, s) => {
    const el = ref.current; if (!el) return { x, y };
    const w = el.clientWidth, h = el.clientHeight;
    const mx = (w * s - w) / 2, my = (h * s - h) / 2;
    return { x: Math.max(-mx, Math.min(mx, x)), y: Math.max(-my, Math.min(my, y)) };
  }, []);

  // Register all native event listeners to avoid React synthetic event issues
  useEffect(() => {
    const el = ref.current; if (!el) return;

    // Wheel zoom
    const handleWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2, cy = e.clientY - r.top - r.height / 2;
      const d = e.deltaY > 0 ? 0.9 : 1.1;
      const prev = scaleRef.current;
      const next = Math.max(1, Math.min(4, prev * d));
      const ratio = next / prev;
      const p = posRef.current;
      const np = clamp(cx - ratio * (cx - p.x), cy - ratio * (cy - p.y), next);
      scaleRef.current = next; posRef.current = np;
      setScale(next); setPos(np);
    };

    // Mouse drag
    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      dragState.current = { active: true, moved: false, startX: e.clientX, startY: e.clientY,
        posX: posRef.current.x, posY: posRef.current.y };
    };
    const handleMouseMove = (e) => {
      const ds = dragState.current; if (!ds.active) return;
      const dx = e.clientX - ds.startX, dy = e.clientY - ds.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) ds.moved = true;
      if (ds.moved) {
        const np = clamp(ds.posX + dx, ds.posY + dy, scaleRef.current);
        posRef.current = np; setPos(np);
      }
    };
    const handleMouseUp = () => { dragState.current.active = false; };

    // Touch: drag + pinch
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchState.current = {
          dist: Math.hypot(dx, dy),
          cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        dragState.current.active = false;
      } else if (e.touches.length === 1) {
        dragState.current = { active: true, moved: false,
          startX: e.touches[0].clientX, startY: e.touches[0].clientY,
          posX: posRef.current.x, posY: posRef.current.y };
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const ps = pinchState.current;
        if (!ps.dist) return;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ncx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const ncy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        // Zoom
        const r = el.getBoundingClientRect();
        const cx = ps.cx - r.left - r.width / 2;
        const cy = ps.cy - r.top - r.height / 2;
        const prev = scaleRef.current;
        const next = Math.max(1, Math.min(4, prev * (dist / ps.dist)));
        const ratio = next / prev;
        const p = posRef.current;
        let np = { x: cx - ratio * (cx - p.x) + (ncx - ps.cx), y: cy - ratio * (cy - p.y) + (ncy - ps.cy) };
        np = clamp(np.x, np.y, next);

        scaleRef.current = next; posRef.current = np;
        setScale(next); setPos(np);
        pinchState.current = { dist, cx: ncx, cy: ncy };
      } else if (e.touches.length === 1 && dragState.current.active && scaleRef.current > 1) {
        const ds = dragState.current;
        const dx = e.touches[0].clientX - ds.startX;
        const dy = e.touches[0].clientY - ds.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) ds.moved = true;
        if (ds.moved) {
          e.preventDefault();
          const np = clamp(ds.posX + dx, ds.posY + dy, scaleRef.current);
          posRef.current = np; setPos(np);
        }
      }
    };
    const handleTouchEnd = () => {
      dragState.current.active = false;
      pinchState.current = { dist: null, cx: null, cy: null };
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [clamp]);

  const isDragging = dragState.current.active && dragState.current.moved;

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref}
        style={{ position: "relative", width: "100%", paddingBottom: "74.3%", overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab", touchAction: scale > 1 ? "none" : "pan-y" }}>
        <div style={{ position: "absolute", inset: 0,
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out" }}>
          <img src={MAP_IMG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", userSelect: "none", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)" }} />
          {children(scale)}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 20, display: "flex", flexDirection: "column", gap: 4 }}>
        {[{l:"+",f:()=>{const n=Math.min(4,scaleRef.current*1.3);const np=clamp(posRef.current.x,posRef.current.y,n);scaleRef.current=n;posRef.current=np;setScale(n);setPos(np);}},
          {l:"−",f:()=>{const n=Math.max(1,scaleRef.current/1.3);const np=clamp(posRef.current.x,posRef.current.y,n);scaleRef.current=n;posRef.current=np;setScale(n);setPos(np);}}
        ].map((b,i)=>(
          <button key={i} onClick={b.f} style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid #ccc", background: "white",
            fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)", color: "#333" }}>{b.l}</button>
        ))}
        {scale > 1.05 && <button onClick={()=>{scaleRef.current=1;posRef.current={x:0,y:0};setScale(1);setPos({x:0,y:0});}} style={{ width: 32, height: 32, borderRadius: 6,
          border: "1px solid #ccc", background: "white", fontSize: 10, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", color: "#888" }}>↺</button>}
      </div>
      {scale > 1.05 && <div style={{ position: "absolute", top: 8, left: 8, zIndex: 20, background: "rgba(0,0,0,0.55)",
        color: "white", padding: "2px 7px", borderRadius: 5, fontSize: 10, fontWeight: 600 }}>×{scale.toFixed(1)}</div>}
    </div>
  );
}

function DetailSheet({ dong, onClose }) {
  if (!dong) return null;
  const c = getCongestion(dong.waiting);
  return (
    <div onClick={(e)=>e.stopPropagation()} style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 520, background: "white", borderRadius: "24px 24px 0 0",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", padding: "20px 20px 28px", zIndex: 50,
      animation: "sheetUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd", margin: "0 auto 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111" }}>{dong.name}</h3>
            {dong.isMain && <span style={{ fontSize: 10, fontWeight: 700, background: "#0057B8", color: "white", padding: "3px 8px", borderRadius: 4 }}>내 동</span>}
            <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, padding: "3px 10px", borderRadius: 12, border: `1px solid ${c.ring}` }}>● {c.level}</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>행정복지센터 민원실</p>
        </div>
        <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", borderRadius: 20, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "#aaa" }}>✕</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "#f8f9fa", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>대기 인원</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{dong.waiting}<span style={{ fontSize: 13 }}>명</span></div>
        </div>
        <div style={{ background: "#f8f9fa", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>예상 대기</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{formatTime(dong.waiting * 3)}</div>
        </div>
      </div>
      <button onClick={()=>window.open(`https://map.naver.com/v5/search/${dong.name} 행정복지센터`,"_blank")}
        style={{ width: "100%", background: "white", color: "#333", border: "2px solid #e0e0e0", borderRadius: 14,
          padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📍 길찾기</button>
    </div>
  );
}

/* ─── Sejong Header (from sejong.go.kr) ─── */
function SejongHeader() {
  return (
    <>
      {/* g-header-top: 전자정부 인증 바 */}
      <div id="g-header-top" style={{ background: "#f5f5f5", borderBottom: "1px solid #e5e5e5" }}>
        <div style={{ padding: "7px 15px", display: "flex", alignItems: "center", gap: 6 }}>
          <img src="https://www.gov.kr/images/web/common/govKrSymbol.png"
            alt="대한민국 정부" style={{ width: 22, height: 16 }}
            onError={(e)=>{e.target.style.display="none"}} />
          <span className="nuri-txt" style={{ fontSize: 12, color: "#333", fontFamily: "'NanumGothic','맑은 고딕',sans-serif" }}>
            ※ 본 페이지는 실제 서비스가 아닌 데모 목업입니다.
          </span>
        </div>
      </div>

      {/* top_layout: 메인 헤더 */}
      <header id="top_layout" style={{ background: "#fff" }}>
        <div style={{ padding: "12px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* 햄버거 메뉴 버튼 */}
          <button style={{ width: 44, height: 44, borderRadius: 10, background: "#C13B68", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(193,59,104,0.25)", flexShrink: 0 }}>
            <span style={{ width: 22, height: 2.5, background: "white", borderRadius: 2, display: "block" }} />
            <span style={{ width: 22, height: 2.5, background: "white", borderRadius: 2, display: "block" }} />
            <span style={{ width: 22, height: 2.5, background: "white", borderRadius: 2, display: "block" }} />
          </button>

          {/* 로고: CI 이미지 + 분야별정보 */}
          <div id="logo" style={{ display: "flex", alignItems: "center", gap: 0, textDecoration: "none", minWidth: 0, overflow: "hidden" }}>
            <img src={CI_IMG} alt="세종특별자치시" style={{ height: 44 }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: "#333", marginLeft: 6, letterSpacing: "-0.5px",
              fontFamily: "'NanumGothic','맑은 고딕',sans-serif", whiteSpace: "nowrap" }}>분야별정보</span>
          </div>

          {/* 검색 버튼 */}
          <button style={{ width: 44, height: 44, borderRadius: 10, background: "#3831AC", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(56,49,172,0.25)", flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="8" x2="13" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="12" x2="10" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="14" r="4.5" stroke="white" strokeWidth="2" />
              <line x1="19.5" y1="17.5" x2="22" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* 브레드크럼 */}
      <nav style={{ background: "#f5f5f5", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #e5e5e5",
        padding: "11px 15px", fontFamily: "'NanumGothic','맑은 고딕',sans-serif" }}>
        <ul style={{ display: "flex", alignItems: "center", gap: 0, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
          {[
            { label: "HOME", href: "https://www.sejong.go.kr/depart/index.do", isHome: true },
            { label: "분야별정보" },
            { label: "열린행정" },
{ label: "실시간 민원현황", isCurrent: true },
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span style={{ margin: "0 6px", color: "#999", fontSize: 10 }}>›</span>}
              {item.isHome ? (
                <a href={item.href} style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#888"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </a>
              ) : (
                <a href="#" style={{ fontSize: 13, color: item.isCurrent ? "#333" : "#555",
                  fontWeight: item.isCurrent ? 700 : 400,
                  textDecoration: "underline", textDecorationColor: "#ccc", textUnderlineOffset: "3px" }}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 페이지 타이틀 영역 */}
      <div style={{ position: "relative", padding: "28px 15px 16px" }}>
        {/* 즐겨찾기 별 */}
        <div style={{ position: "absolute", top: 12, right: 12, width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #1a6dd4, #0f4c99)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 12px rgba(15,76,153,0.35)", cursor: "pointer" }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>⭐</span>
        </div>
        <h2 className="page__title" style={{ fontSize: 26, fontWeight: 900, color: "#111", margin: "0 0 14px 0",
          fontFamily: "'NanumGothic','맑은 고딕',sans-serif", letterSpacing: "-0.5px" }}>
          실시간 민원대기현황
        </h2>
        <div className="utile_wrap" style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {[
            { icon: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13", label: "공유" },
            { icon: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71", label: "짧은URL" },
            { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "즐겨찾기" },
          ].map((u, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, color: "#888", cursor: "pointer",
              fontFamily: "'NanumGothic','맑은 고딕',sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={u.icon} />
              </svg>
              {u.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: "#e0e0e0", margin: "0 15px" }} />
    </>
  );
}

/* ─── Sejong Footer (from sejong.go.kr) ─── */
function SejongFooter() {
  return (
    <footer style={{ background: "#f5f5f5", borderTop: "3px solid #3831AC", padding: "20px 15px 30px", marginTop: 20,
      fontFamily: "'NanumGothic','맑은 고딕',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <img src={CI_IMG} alt="세종특별자치시" style={{ height: 24, opacity: 0.6 }} />
      </div>
      <div style={{ fontSize: 11, color: "#888", lineHeight: 1.8 }}>
        (30151) 세종특별자치시 한누리대로 2130 (보람동)<br />
        대표전화: 044-300-3114 | 팩스: 044-300-3699
      </div>
      <div style={{ fontSize: 10, color: "#aaa", marginTop: 10 }}>
        Copyright © Sejong Metropolitan Autonomous City. All rights reserved.
      </div>
    </footer>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [listOpen, setListOpen] = useState(false);

  const sel = DONG_DATA.find(d => d.id === selected);
  const filtered = DONG_DATA.filter(d => {
    if (filter === "smooth") return d.waiting < 5;
    if (filter === "normal") return d.waiting >= 5 && d.waiting < 10;
    if (filter === "busy") return d.waiting >= 10;
    return true;
  });

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", minHeight: "100vh", background: "#fff",
      fontFamily: "'NanumGothic','맑은 고딕','Apple SD Gothic Neo',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes sheetUp { from{transform:translate(-50%,100%)} to{transform:translate(-50%,0)} }
        *{box-sizing:border-box;margin:0;padding:0} body{background:#fff}
        a{color:inherit;text-decoration:none}
      `}</style>

      <SejongHeader />

      {/* ─── 본문 콘텐츠 ─── */}
      <div style={{ padding: "16px 15px 0" }}>

        {/* 필터 (카운트 포함) */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            {k:"all",l:"전체",count:DONG_DATA.length},
            {k:"smooth",l:"원활",count:DONG_DATA.filter(d=>d.waiting<5).length,dot:"#16A34A"},
            {k:"normal",l:"보통",count:DONG_DATA.filter(d=>d.waiting>=5&&d.waiting<10).length,dot:"#EA580C"},
            {k:"busy",l:"혼잡",count:DONG_DATA.filter(d=>d.waiting>=10).length,dot:"#DC2626"},
          ].map(f=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} style={{
              padding: "6px 14px", borderRadius: 20,
              border: filter===f.k ? "1.5px solid #3831AC" : "1.5px solid #ddd",
              background: filter===f.k ? "#EEEDF8" : "white",
              color: filter===f.k ? "#3831AC" : "#777",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              {f.dot && <span style={{width:7,height:7,borderRadius:"50%",background:f.dot}} />}
              {f.l}({f.count})
            </button>
          ))}
        </div>

        {/* 지도 */}
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #ddd" }} onClick={(e)=>{if(e.detail===1)setSelected(null);}}>
          <ZoomableMap>
            {(scale)=>filtered.map(d=>(
              <MapPin key={d.id} dong={d} isSelected={selected===d.id} onClick={setSelected} scale={scale} />
            ))}
          </ZoomableMap>
        </div>

        {/* 범례 */}
        <div style={{ padding: "10px 0", display: "flex", justifyContent: "center", gap: 16 }}>
          {[{c:"#16A34A",l:"원활 (0~4명)"},{c:"#EA580C",l:"보통 (5~9명)"},{c:"#DC2626",l:"혼잡 (10명+)"}].map((x,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} />
              <span style={{ fontSize: 11, color: "#999" }}>{x.l}</span>
            </div>
          ))}
        </div>

        {/* 리스트 */}
        <button onClick={()=>setListOpen(!listOpen)} style={{
          width: "100%", background: "#fafafa", border: "1px solid #eee", borderRadius: 10,
          padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#333" }}>📊 빠른 현황 — 대기 적은 순</span>
          <span style={{ fontSize: 16, color: "#bbb", transform: listOpen?"rotate(180deg)":"none", transition: "0.2s" }}>▾</span>
        </button>
        {listOpen && <div style={{ marginBottom: 16 }}>
          {[...DONG_DATA].sort((a,b)=>a.waiting-b.waiting).map(d=>{const c=getCongestion(d.waiting);return(
            <div key={d.id} onClick={()=>setSelected(d.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "white", borderRadius: 10, padding: "11px 12px", marginBottom: 5, cursor: "pointer", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, border: `1.5px solid ${c.ring}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: c.color }}>{d.waiting}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>
                    {d.name}{d.isMain&&<span style={{ fontSize: 9, color: "#0057B8", marginLeft: 4 }}>내 동</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>예상 대기 {formatTime(d.waiting*3)}</div>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, padding: "3px 8px", borderRadius: 8 }}>{c.level}</span>
            </div>
          );})}
        </div>}
      </div>

      <SejongFooter />
      <DetailSheet dong={sel} onClose={()=>setSelected(null)} />

      {/* 정부24 FAB */}
      <a href="https://plus.gov.kr/ai/search_beta/" target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 20, zIndex: 40, width: 54, height: 54, borderRadius: "50%",
          background: "linear-gradient(135deg, #1B64DA, #0D4A9E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(13,74,158,0.4)", textDecoration: "none" }}>
        <span style={{ fontSize: 24 }}>💬</span>
      </a>
      <div style={{ position: "fixed", bottom: 82, right: 14, zIndex: 40, background: "white",
        padding: "5px 10px", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontSize: 10, fontWeight: 700, color: "#333", pointerEvents: "none" }}>정부24 AI 상담</div>
    </div>
  );
}
