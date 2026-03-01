import { useState, useCallback, useRef } from "react";

// ─── Base64 Images ───
const CHAR_IMG = "data:image/webp;base64,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";
const CI_IMG = "data:image/webp;base64,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";

// ─── DATA ───
const CATS = [
  { id: "주민등록", icon: "📋", sub: "등·초본, 전입세대" },
  { id: "인감·본인서명", icon: "🔏", sub: "인감증명서, 본인서명" },
  { id: "가족관계", icon: "👨‍👩‍👧", sub: "가족관계, 기본증명서" },
  { id: "토지·건축", icon: "🏠", sub: "토지대장, 건축물대장" },
  { id: "세금·수수료", icon: "💰", sub: "납세·과세증명서" },
  { id: "복지·지원", icon: "🤝", sub: "기초연금, 아동수당" },
  { id: "자동차", icon: "🚗", sub: "등록원부, 주소변경" },
  { id: "병무·기타", icon: "🎖️", sub: "병적, 출입국증명" },
];

const ITEMS = [
  { id:"r1", cat:"주민등록", name:"주민등록등본", tp:"제증명", fee:400, desc:"세대원 전체 주소·인적사항" },
  { id:"r2", cat:"주민등록", name:"주민등록초본", tp:"제증명", fee:400, desc:"본인 주소변동 이력" },
  { id:"r3", cat:"주민등록", name:"주민등록증 발급사실확인서", tp:"제증명", fee:0, desc:"주민등록증 발급 이력" },
  { id:"ra1", cat:"주민등록", name:"전입신고", tp:"신청", fee:0, desc:"이사 후 주소 변경" },
  { id:"ra2", cat:"주민등록", name:"주민등록증 발급신청", tp:"신청", fee:0, desc:"만 17세 최초 발급" },
  { id:"ra3", cat:"주민등록", name:"주민등록증 재발급", tp:"신청", fee:5000, desc:"분실·훼손 시 재발급" },
  { id:"ra4", cat:"주민등록", name:"주민등록 정정신고", tp:"신청", fee:0, desc:"등록사항 정정" },
  { id:"ra5", cat:"주민등록", name:"세대주 변경신고", tp:"신청", fee:0, desc:"세대주 변경" },
  { id:"ra6", cat:"주민등록", name:"세대합가·분리신고", tp:"신청", fee:0, desc:"세대 합가 또는 분리" },
  { id:"s1", cat:"인감·본인서명", name:"인감증명서", tp:"제증명", fee:600, desc:"인감도장 증명" },
  { id:"s2", cat:"인감·본인서명", name:"본인서명사실확인서", tp:"제증명", fee:0, desc:"본인 서명 증명 (인감 대체)" },
  { id:"sa1", cat:"인감·본인서명", name:"인감(변경)신고", tp:"신청", fee:0, desc:"인감 신규등록·변경" },
  { id:"f1", cat:"가족관계", name:"가족관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"가족관계 사항 증명" },
  { id:"f2", cat:"가족관계", name:"기본증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"출생·사망·국적 등 기본사항" },
  { id:"f3", cat:"가족관계", name:"혼인관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"혼인·이혼 사항 증명" },
  { id:"f4", cat:"가족관계", name:"입양관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"입양 사항 증명" },
  { id:"f5", cat:"가족관계", name:"친양자입양관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"친양자입양 사항 증명" },
  { id:"fa1", cat:"가족관계", name:"출생신고", tp:"신청", fee:0, desc:"출생 사실 신고" },
  { id:"fa2", cat:"가족관계", name:"사망신고", tp:"신청", fee:0, desc:"사망 사실 신고" },
  { id:"fa3", cat:"가족관계", name:"혼인신고", tp:"신청", fee:0, desc:"혼인 사실 신고" },
  { id:"fa4", cat:"가족관계", name:"이혼신고(협의)", tp:"신청", fee:0, desc:"협의이혼 신고" },
  { id:"l1", cat:"토지·건축", name:"토지대장 등본", tp:"제증명", fee:400, desc:"토지 소재·면적·소유자" },
  { id:"l2", cat:"토지·건축", name:"임야대장 등본", tp:"제증명", fee:400, desc:"임야 소재·면적·소유자" },
  { id:"l3", cat:"토지·건축", name:"건축물대장", tp:"제증명", fee:500, desc:"건축물 현황 증명" },
  { id:"l4", cat:"토지·건축", name:"지적도 등본", tp:"제증명", fee:700, desc:"토지 경계·형상" },
  { id:"l5", cat:"토지·건축", name:"토지이용계획확인서", tp:"제증명", fee:1000, desc:"토지 이용계획·규제사항" },
  { id:"l6", cat:"토지·건축", name:"개별공시지가확인서", tp:"제증명", fee:800, desc:"개별 토지 공시지가" },
  { id:"l7", cat:"토지·건축", name:"개별주택가격확인서", tp:"제증명", fee:800, desc:"개별주택 공시가격" },
  { id:"l10", cat:"토지·건축", name:"전입세대열람확인서", tp:"제증명", fee:400, desc:"해당 주소 전입세대 열람" },
  { id:"t1", cat:"세금·수수료", name:"지방세 납세증명서", tp:"제증명", fee:0, desc:"지방세 납부 증명" },
  { id:"t2", cat:"세금·수수료", name:"세목별 과세증명서", tp:"제증명", fee:800, desc:"세목별 과세 내역" },
  { id:"t3", cat:"세금·수수료", name:"자동차세 납세증명서", tp:"제증명", fee:0, desc:"자동차세 납부 증명" },
  { id:"w1", cat:"복지·지원", name:"수급자증명서", tp:"제증명", fee:0, desc:"기초생활수급 증명" },
  { id:"w2", cat:"복지·지원", name:"장애인증명서", tp:"제증명", fee:0, desc:"장애인 등록 증명" },
  { id:"wa1", cat:"복지·지원", name:"기초생활보장 신청", tp:"신청", fee:0, desc:"기초생활보장 수급 신청" },
  { id:"wa2", cat:"복지·지원", name:"장애인등록 신청", tp:"신청", fee:0, desc:"장애인 등록 신청" },
  { id:"wa3", cat:"복지·지원", name:"기초연금 신청", tp:"신청", fee:0, desc:"65세 이상 기초연금" },
  { id:"wa4", cat:"복지·지원", name:"양육수당 신청", tp:"신청", fee:0, desc:"영유아 양육수당" },
  { id:"wa5", cat:"복지·지원", name:"아동수당 신청", tp:"신청", fee:0, desc:"만 8세 미만 아동수당" },
  { id:"wa6", cat:"복지·지원", name:"한부모가족 지원 신청", tp:"신청", fee:0, desc:"한부모가족 복지급여" },
  { id:"wa7", cat:"복지·지원", name:"긴급복지 지원 신청", tp:"신청", fee:0, desc:"위기상황 긴급지원" },
  { id:"a1", cat:"자동차", name:"자동차등록원부(갑)", tp:"제증명", fee:300, desc:"소유자 등 상세정보" },
  { id:"a2", cat:"자동차", name:"자동차등록원부(을)", tp:"제증명", fee:300, desc:"저당·압류 등 권리관계" },
  { id:"aa1", cat:"자동차", name:"자동차 주소변경 신고", tp:"신청", fee:0, desc:"이전 후 주소변경" },
  { id:"m1", cat:"병무·기타", name:"병적증명서", tp:"제증명", fee:0, desc:"병역 이행 사항 증명" },
  { id:"m2", cat:"병무·기타", name:"출입국사실증명서", tp:"제증명", fee:2000, desc:"출입국 기록 증명" },
  { id:"ma1", cat:"병무·기타", name:"대형폐기물 처리 신청", tp:"신청", fee:0, desc:"대형폐기물 배출 신고" },
];

const QUALS = {
  r1: [
    { qid:"r1q1", nm:"본인 및 세대원", docs:[], ex:false, nt:false, tg:[], nc:false },
    { qid:"r1q2", nm:"가족관계등록부상 가족", docs:["신청서"], ex:true, nt:false, tg:[], nc:false },
  ],
  r2: [
    { qid:"r2q1", nm:"본인", docs:[], ex:false, nt:false, tg:[], nc:false },
    { qid:"r2q2", nm:"세대원 (위임)", docs:["위임장","위임인 신분증 사본"], ex:false, nt:false, tg:[], nc:false },
  ],
  s1: [
    { qid:"s1q1", nm:"본인", docs:[], ex:false, nt:false, tg:[], nc:false, note:"본인 직접 방문 필수" },
  ],
  f1: [
    { qid:"f1q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f1q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f2: [
    { qid:"f2q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f2q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f3: [
    { qid:"f3q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f3q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f4: [
    { qid:"f4q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f4q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f5: [
    { qid:"f5q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f5q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  l10: [
    { qid:"l10q1", nm:"소유자", docs:["신청서"], ex:false, nt:false, tg:[], nc:false },
    { qid:"l10q2", nm:"임차인", docs:["신청서","임대차계약서"], ex:false, nt:false, tg:[], nc:false },
    { qid:"l10q3", nm:"경매참가자", docs:["신청서","경매공고문"], ex:false, nt:false, tg:[], nc:false },
  ],
};

const OPTIONS = {
  f1: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f2: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f3: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f4: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f5: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  r1: [{ name: "과거주소 변동사항", choices: ["포함", "미포함"] }],
  r2: [{ name: "과거주소 변동사항", choices: ["포함", "미포함"] }],
  l10: [{ name: "말소·사망자 표시", choices: ["표시", "미표시"] }],
  s1: [{ name: "사용 용도", choices: ["매매용", "금융기관 제출용", "기타 일반용"] }],
};

const AI_DATA = [
  { q: "전세 대출 필요서류 발급", ids: ["r1","r2","s1","s2"] },
  { q: "집 팔려고 하는데 서류", ids: ["s1","r2","s2"] },
  { q: "아이 어린이집 보내려고요", ids: ["r1","f1"] },
  { q: "이사해서 전입신고 하러 왔어요", ids: ["ra1"] },
  { q: "출생신고 하러 왔어요", ids: ["fa1","wa5","wa4"] },
  { q: "등본 떼러 왔어요", ids: ["r1"] },
  { q: "인감증명서 떼러 왔어요", ids: ["s1"] },
  { q: "취업서류 발급해주세요", ids: ["r1","f1","m1"] },
  { q: "기초연금 신청하려고요", ids: ["wa3"] },
  { q: "전입세대열람확인서 떼려고요", ids: ["l10"] },
];

// ─── STYLES ───
const C = {
  bg: "#F5F5F5", card: "#FFFFFF", mint: "#2AC1BC", mintLight: "#E6F7F6", mintDark: "#1A9E99",
  text: "#1A1A1A", sub: "#999999", desc: "#666666", amber: "#D97706", amberBg: "#FFF7E6",
  red: "#E84545", redBg: "#FFF0F0", green: "#22B573", greenBg: "#ECFBF3", border: "#EEEEEE",
  font: "'Pretendard Variable', Pretendard, -apple-system, 'Noto Sans KR', sans-serif",
};

const fmtFee = (f) => f === 0 ? "무료" : f.toLocaleString() + "원";

export default function App() {
  // ─── STATE ───
  const [page, setPage] = useState("home"); // home | cat | order
  const [selCat, setSelCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [exempt, setExempt] = useState(false);

  // Modal: single state
  const [modal, setModal] = useState(null); // null | "cart" | "detail" | "ai" | "aiLoad" | "docs"
  const [modalAnim, setModalAnim] = useState(false);

  // Detail sheet state
  const [detailItem, setDetailItem] = useState(null);
  const [detOpt, setDetOpt] = useState(null); // 유형(일반/상세/특정)
  const [detQual, setDetQual] = useState(null);
  const [detTarget, setDetTarget] = useState(null);
  const [detCount, setDetCount] = useState(1);
  const [detOptions, setDetOptions] = useState({});
  const [detQty, setDetQty] = useState(1);

  // AI state
  const [aiInput, setAiInput] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [showHints, setShowHints] = useState(false);

  // Docs modal
  const [docsContent, setDocsContent] = useState([]);

  const inputRef = useRef(null);
  const blurTimer = useRef(null);

  // ─── MODAL HELPERS ───
  const openModal = useCallback((type) => {
    setModalAnim(true);
    setModal(type);
    setTimeout(() => setModalAnim(false), 300);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  // ─── DETAIL SHEET ───
  const openDetail = useCallback((item) => {
    setDetailItem(item);
    setDetOpt(item.opts ? item.opts.split(",")[0] : null);
    const quals = QUALS[item.id];
    setDetQual(quals && quals.length === 1 ? quals[0] : null);
    setDetTarget(null);
    setDetCount(1);
    setDetOptions({});
    setDetQty(1);
    openModal("detail");
  }, [openModal]);

  // ─── CART ───
  const addToCart = useCallback(() => {
    if (!detailItem) return;
    const qual = detQual;
    const entry = {
      key: Date.now(),
      item: detailItem,
      opt: detOpt,
      qual,
      target: detTarget,
      count: detCount,
      options: { ...detOptions },
      qty: detQty,
    };
    setCart(prev => [...prev, entry]);
    closeModal();
  }, [detailItem, detOpt, detQual, detTarget, detCount, detOptions, detQty, closeModal]);

  const removeFromCart = useCallback((key) => {
    setCart(prev => prev.filter(c => c.key !== key));
  }, []);

  const updateCartQty = useCallback((key, delta) => {
    setCart(prev => prev.map(c => c.key === key ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  }, []);

  const totalFee = cart.reduce((s, c) => {
    const base = c.item.fee * c.qty * (c.count || 1);
    if (exempt) return 0;
    if (c.qual?.ex) return s;
    return s + base;
  }, 0);

  // ─── AI ───
  const runAI = useCallback((q) => {
    setAiQuery(q);
    setAiInput("");
    openModal("aiLoad");
    setTimeout(() => {
      const match = AI_DATA.find(d => d.q === q);
      const ids = match ? match.ids : [];
      // fuzzy: if no exact match, try keyword
      let finalIds = ids;
      if (!match) {
        const kw = q.toLowerCase();
        const found = AI_DATA.find(d => kw.includes(d.q.slice(0,4)) || d.q.includes(kw.slice(0,4)));
        finalIds = found ? found.ids : ["r1"];
      }
      setAiResults(finalIds.map(id => ITEMS.find(it => it.id === id)).filter(Boolean));
      setModal("ai");
      setModalAnim(true);
      setTimeout(() => setModalAnim(false), 300);
    }, 1500);
  }, [openModal]);

  // ─── NAVIGATION ───
  const goHome = useCallback(() => { setPage("home"); setSelCat(null); closeModal(); }, [closeModal]);
  const goCat = useCallback((catId) => { setSelCat(catId); setPage("cat"); }, []);
  const goOrder = useCallback(() => { closeModal(); setPage("order"); }, [closeModal]);

  // ─── COMPUTED ───
  const catItems = selCat ? ITEMS.filter(i => i.cat === selCat) : [];
  const certs = catItems.filter(i => i.tp === "제증명");
  const apps = catItems.filter(i => i.tp === "신청");
  const quals = detailItem ? (QUALS[detailItem.id] || [{ qid:"default", nm:"본인", docs:[], ex:false, nt:false, tg:[], nc:false }]) : [];
  const itemOpts = detailItem ? (OPTIONS[detailItem.id] || []) : [];
  const cartCount = cart.length;

  // Validation for detail sheet
  const detailValid = (() => {
    if (!detailItem) return false;
    if (detailItem.opts && !detOpt) return false;
    if (quals.length > 1 && !detQual) return false;
    if (detQual?.nt && !detTarget) return false;
    for (const o of itemOpts) {
      if (!detOptions[o.name]) return false;
    }
    return true;
  })();

  const detailFee = (() => {
    if (!detailItem) return 0;
    if (detQual?.ex) return 0;
    return detailItem.fee * detQty * (detQual?.nc ? detCount : 1);
  })();

  // ─── SHEET STYLE ───
  const sheetBase = {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: C.card, borderRadius: "22px 22px 0 0",
    maxHeight: "88%", display: "flex", flexDirection: "column",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
    ...(modalAnim ? { animation: "slideUp .25s ease-out" } : {}),
  };

  // ─── RENDER ───
  const renderNavBar = (title, showBack) => (
    <div style={{ display:"flex", alignItems:"center", padding:"14px 16px", background:C.card, borderBottom:`1px solid ${C.border}`, position:"relative", zIndex:2 }}>
      {showBack && (
        <button onClick={page === "order" ? () => setPage("home") : goHome} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", padding:"4px 8px 4px 0", color:C.text }}>←</button>
      )}
      <span style={{ flex:1, fontWeight:700, fontSize:17, color:C.text, textAlign: showBack ? "left" : "center" }}>{title}</span>
      {page !== "order" && (
        <button onClick={() => openModal("cart")} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", position:"relative", padding:4, color:C.text }}>
          🛒
          {cartCount > 0 && (
            <span style={{ position:"absolute", top:-2, right:-4, background:C.red, color:"#fff", fontSize:10, fontWeight:700, borderRadius:10, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px" }}>{cartCount}</span>
          )}
        </button>
      )}
    </div>
  );

  const renderHome = () => (
    <div style={{ flex:1, overflow:"auto", padding:16 }}>
      {/* AI Section */}
      <div style={{ background:C.card, borderRadius:16, padding:16, marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <img src={CHAR_IMG} alt="" style={{ width:44, height:44, borderRadius:12, objectFit:"cover" }} />
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:C.text }}>AI에게 물어보기</div>
            <div style={{ fontSize:12, color:C.sub }}>무엇을 하러 오셨나요?</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input
            ref={inputRef}
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onFocus={() => setShowHints(true)}
            onBlur={() => { blurTimer.current = setTimeout(() => setShowHints(false), 200); }}
            onKeyDown={e => { if (e.key === "Enter" && aiInput.trim()) runAI(aiInput.trim()); }}
            placeholder="예: 전세 대출 서류 발급해주세요"
            style={{ flex:1, padding:"10px 14px", borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", fontFamily:C.font, transition:"border .2s" }}
            onFocusCapture={e => { e.target.style.borderColor = C.mint; }}
            onBlurCapture={e => { e.target.style.borderColor = C.border; }}
          />
          <button onClick={() => aiInput.trim() && runAI(aiInput.trim())} style={{ background: aiInput.trim() ? C.mint : C.border, color:"#fff", border:"none", borderRadius:12, padding:"10px 16px", fontWeight:700, fontSize:14, cursor:"pointer", whiteSpace:"nowrap" }}>전송</button>
        </div>
        {showHints && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
            {AI_DATA.slice(0,5).map(d => (
              <button
                key={d.q}
                onMouseDown={e => { e.preventDefault(); clearTimeout(blurTimer.current); runAI(d.q); }}
                style={{ background:C.mintLight, color:C.mintDark, border:`1px solid ${C.mint}33`, borderRadius:20, padding:"6px 12px", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:C.font }}
              >{d.q}</button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 16px", color:C.sub, fontSize:13 }}>
        <div style={{ flex:1, height:1, background:C.border }} />
        <span>직접 선택</span>
        <div style={{ flex:1, height:1, background:C.border }} />
      </div>

      {/* Categories Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {CATS.map(cat => (
          <button key={cat.id} onClick={() => goCat(cat.id)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 14px", textAlign:"left", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", fontFamily:C.font, transition:"transform .15s" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ fontSize:28, marginBottom:8 }}>{cat.icon}</div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:2 }}>{cat.id}</div>
            <div style={{ fontSize:11, color:C.sub }}>{cat.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  const renderCat = () => (
    <div style={{ flex:1, overflow:"auto", padding:16 }}>
      {certs.length > 0 && (
        <>
          <div style={{ display:"inline-block", background:C.mintLight, color:C.mintDark, fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:10, marginBottom:10 }}>제증명 발급</div>
          {certs.map(it => (
            <button key={it.id} onClick={() => openDetail(it)} style={{ display:"block", width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, textAlign:"left", cursor:"pointer", fontFamily:C.font, boxShadow:"0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:600, fontSize:15, color:C.text }}>{it.name}</div>
                <div style={{ fontSize:13, fontWeight:700, color: it.fee === 0 ? C.green : C.text }}>{fmtFee(it.fee)}</div>
              </div>
              <div style={{ fontSize:12, color:C.desc, marginTop:3 }}>{it.desc}</div>
            </button>
          ))}
        </>
      )}
      {apps.length > 0 && (
        <>
          <div style={{ display:"inline-block", background:C.amberBg, color:C.amber, fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:10, marginTop:certs.length ? 14 : 0, marginBottom:10 }}>신청 민원</div>
          {apps.map(it => (
            <button key={it.id} onClick={() => openDetail(it)} style={{ display:"block", width:"100%", background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, textAlign:"left", cursor:"pointer", fontFamily:C.font, boxShadow:"0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontWeight:600, fontSize:15, color:C.text }}>{it.name}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.green }}>무료</div>
              </div>
              <div style={{ fontSize:12, color:C.desc, marginTop:3 }}>{it.desc}</div>
            </button>
          ))}
        </>
      )}
      <div style={{ height: 20 }} />
    </div>
  );

  const renderOrder = () => (
    <div style={{ flex:1, overflow:"auto", padding:16 }}>
      {/* Header Card */}
      <div style={{ background:`linear-gradient(135deg, ${C.mint}, ${C.mintDark})`, borderRadius:18, padding:"24px 20px", marginBottom:16, color:"#fff" }}>
        <div style={{ fontSize:13, opacity:.85, marginBottom:4 }}>요청서 완성</div>
        <div style={{ fontSize:22, fontWeight:800 }}>총 {cart.length}건 · {exempt ? "면제" : fmtFee(totalFee)}</div>
      </div>
      {/* Items */}
      {cart.map(c => (
        <div key={c.key} style={{ background:C.card, borderRadius:14, padding:16, marginBottom:10, border:`1px solid ${C.border}` }}>
          <div style={{ fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>{c.item.name}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, fontSize:12 }}>
            {c.opt && <span style={{ background:C.mintLight, color:C.mintDark, padding:"2px 8px", borderRadius:8 }}>{c.opt}</span>}
            {c.qual && <span style={{ background:"#F0F0F0", color:C.desc, padding:"2px 8px", borderRadius:8 }}>{c.qual.nm}</span>}
            {c.target && <span style={{ background:"#F0F0F0", color:C.desc, padding:"2px 8px", borderRadius:8 }}>{c.target}{c.count > 1 ? ` ${c.count}명` : ""}</span>}
            <span style={{ background:"#F0F0F0", color:C.desc, padding:"2px 8px", borderRadius:8 }}>{c.qty}부</span>
          </div>
          {Object.entries(c.options).map(([k,v]) => (
            <div key={k} style={{ fontSize:11, color:C.sub, marginTop:4 }}>{k}: {v}</div>
          ))}
          {c.qual?.docs?.length > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setDocsContent(c.qual.docs.map(d => c.qual.nc ? `${d} ${c.count}장` : d)); openModal("docs"); }}
              style={{ marginTop:8, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}33`, borderRadius:10, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:C.font }}>
              📋 필요서류 확인
            </button>
          )}
          <div style={{ textAlign:"right", fontSize:14, fontWeight:700, color: c.qual?.ex || exempt ? C.green : C.text, marginTop:8 }}>
            {c.qual?.ex || exempt ? "면제" : fmtFee(c.item.fee * c.qty * (c.qual?.nc ? c.count : 1))}
          </div>
        </div>
      ))}
      {/* Footer */}
      <div style={{ padding:"16px 0", display:"flex", gap:10, marginTop:8 }}>
        <button onClick={goHome} style={{ flex:1, padding:"14px", borderRadius:14, border:`2px solid ${C.mint}`, background:"#fff", color:C.mint, fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:C.font }}>수정하기</button>
        <button style={{ flex:1, padding:"14px", borderRadius:14, border:"none", background:C.mint, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:C.font }}>QR 출력</button>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  // ─── Chip component ───
  const Chip = ({ label, selected, onClick }) => (
    <button onClick={e => { e.stopPropagation(); onClick(); }} style={{
      background: selected ? C.mintLight : "#F7F7F7",
      color: selected ? C.mintDark : C.desc,
      border: `1.5px solid ${selected ? C.mint : C.border}`,
      borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: selected ? 700 : 500,
      cursor: "pointer", fontFamily: C.font, transition: "all .15s",
    }}>{label}</button>
  );

  const Stepper = ({ value, onChange, min = 1 }) => (
    <div style={{ display:"flex", alignItems:"center", gap:0, borderRadius:10, border:`1.5px solid ${C.border}`, overflow:"hidden", height:34 }}>
      <button onClick={e => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }} style={{ width:34, height:34, background:"#F7F7F7", border:"none", fontSize:16, fontWeight:700, cursor:"pointer", color:C.text }}>−</button>
      <span style={{ width:36, textAlign:"center", fontSize:14, fontWeight:700, color:C.text }}>{value}</span>
      <button onClick={e => { e.stopPropagation(); onChange(value + 1); }} style={{ width:34, height:34, background:"#F7F7F7", border:"none", fontSize:16, fontWeight:700, cursor:"pointer", color:C.text }}>+</button>
    </div>
  );

  // ─── DETAIL SHEET ───
  const renderDetailSheet = () => {
    if (!detailItem) return null;
    return (
      <div style={sheetBase} onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#DDD" }} />
        </div>
        <div style={{ padding:"0 20px 8px" }}>
          <div style={{ fontSize:18, fontWeight:800, color:C.text }}>{detailItem.name}</div>
          <div style={{ fontSize:13, color:C.desc, marginTop:2 }}>{detailItem.desc}</div>
        </div>
        <div style={{ flex:1, overflow:"auto", padding:"0 20px 20px" }}>
          {/* 1. 유형 옵션 */}
          {detailItem.opts && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>증명서 유형 <span style={{ color:C.red, fontSize:11 }}>필수</span></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {detailItem.opts.split(",").map(o => (
                  <Chip key={o} label={o} selected={detOpt === o} onClick={() => setDetOpt(o)} />
                ))}
              </div>
            </div>
          )}

          {/* 2. 자격 */}
          {quals.length > 1 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>신청자격 <span style={{ color:C.red, fontSize:11 }}>필수</span></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {quals.map(q => (
                  <Chip key={q.qid} label={q.nm} selected={detQual?.qid === q.qid} onClick={() => { setDetQual(q); setDetTarget(null); setDetCount(1); }} />
                ))}
              </div>
            </div>
          )}

          {/* 3. 대상자 */}
          {detQual?.nt && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>발급대상자 <span style={{ color:C.red, fontSize:11 }}>필수</span></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {detQual.tg.map(t => (
                  <Chip key={t} label={t} selected={detTarget === t} onClick={() => setDetTarget(t)} />
                ))}
              </div>
            </div>
          )}

          {/* 4. 대상자 수 */}
          {detQual?.nc && detTarget && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>대상자 수</div>
                <Stepper value={detCount} onChange={setDetCount} />
              </div>
            </div>
          )}

          {/* 5. 옵션 */}
          {itemOpts.map(o => (
            <div key={o.name} style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>{o.name} <span style={{ color:C.red, fontSize:11 }}>필수</span></div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {o.choices.map(ch => (
                  <Chip key={ch} label={ch} selected={detOptions[o.name] === ch} onClick={() => setDetOptions(prev => ({ ...prev, [o.name]: ch }))} />
                ))}
              </div>
            </div>
          ))}

          {/* 6. 부수 */}
          {detailItem.tp === "제증명" && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>부수 (발급 수량)</div>
                <Stepper value={detQty} onChange={setDetQty} />
              </div>
            </div>
          )}

          {/* 7. 요약 */}
          <div style={{ background:"#F9F9F9", borderRadius:12, padding:14, marginBottom:8 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.sub, marginBottom:6 }}>요청 요약</div>
            {detQual?.ex && <div style={{ fontSize:12, color:C.green, fontWeight:700 }}>✓ 수수료 면제 대상</div>}
            {detQual?.docs?.length > 0 && (
              <div style={{ fontSize:12, color:C.amber, fontWeight:600, marginTop:2 }}>
                📋 필요서류: {detQual.docs.map(d => detQual.nc && detCount > 1 ? `${d} ${detCount}장` : d).join(", ")}
              </div>
            )}
            {detQual?.note && <div style={{ fontSize:11, color:C.desc, marginTop:2 }}>※ {detQual.note}</div>}
            {Object.entries(detOptions).map(([k, v]) => (
              <div key={k} style={{ fontSize:12, color:C.desc, marginTop:2 }}>{k}: {v}</div>
            ))}
          </div>
        </div>

        {/* 8. CTA */}
        <div style={{ padding:"12px 20px 24px", borderTop:`1px solid ${C.border}` }}>
          <button onClick={addToCart} disabled={!detailValid} style={{
            width:"100%", padding:"14px", borderRadius:14, border:"none",
            background: detailValid ? C.mint : "#DDD", color:"#fff",
            fontWeight:700, fontSize:15, cursor: detailValid ? "pointer" : "default",
            fontFamily:C.font, transition:"background .2s",
          }}>
            {detailValid ? `${fmtFee(detailFee)} · 담기` : "옵션을 선택해주세요"}
          </button>
        </div>
      </div>
    );
  };

  // ─── CART SHEET ───
  const renderCartSheet = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"#DDD" }} />
      </div>
      <div style={{ padding:"0 20px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.text }}>민원목록</div>
        <button onClick={closeModal} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.sub }}>✕</button>
      </div>
      <div style={{ flex:1, overflow:"auto", padding:"0 20px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:C.sub }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
            <div style={{ fontSize:14 }}>아직 담은 민원이 없습니다</div>
            <div style={{ fontSize:12, marginTop:4 }}>카테고리에서 민원을 선택해주세요</div>
          </div>
        ) : (
          cart.map(c => (
            <div key={c.key} style={{ background:"#F9F9F9", borderRadius:12, padding:14, marginBottom:8, position:"relative" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{c.item.name}</div>
                  <div style={{ fontSize:11, color:C.desc, marginTop:2 }}>
                    {[c.opt, c.qual?.nm, c.target && `${c.target}${c.count > 1 ? ` ${c.count}명` : ""}`].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); removeFromCart(c.key); }} style={{ background:C.redBg, color:C.red, border:"none", borderRadius:8, width:28, height:28, fontSize:14, cursor:"pointer", fontWeight:700 }}>✕</button>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                {c.item.tp === "제증명" && (
                  <Stepper value={c.qty} onChange={v => updateCartQty(c.key, v - c.qty)} />
                )}
                <div style={{ fontSize:14, fontWeight:700, color: c.qual?.ex || exempt ? C.green : C.text, marginLeft:"auto" }}>
                  {c.qual?.ex || exempt ? "면제" : fmtFee(c.item.fee * c.qty * (c.qual?.nc ? c.count : 1))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div style={{ padding:"12px 20px 24px", borderTop:`1px solid ${C.border}` }}>
          {/* 면제 체크 */}
          <label onClick={e => e.stopPropagation()} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, cursor:"pointer", fontSize:13, color:C.desc }}>
            <input type="checkbox" checked={exempt} onChange={e => { e.stopPropagation(); setExempt(e.target.checked); }} style={{ width:18, height:18, accentColor:C.green }} />
            <span>국가유공자, 장애인, 기초생활수급자 등 <span style={{ color:C.green, fontWeight:700 }}>수수료 면제</span></span>
          </label>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:14, color:C.desc }}>예상 수수료</span>
            <span style={{ fontSize:18, fontWeight:800, color: exempt ? C.green : C.text }}>{exempt ? "면제" : fmtFee(totalFee)}</span>
          </div>
          <button onClick={goOrder} style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", background:C.mint, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:C.font }}>
            요청서 완성하기
          </button>
        </div>
      )}
    </div>
  );

  // ─── AI Loading ───
  const renderAILoad = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px" }}>
        <img src={CHAR_IMG} alt="" style={{ width:80, height:80, objectFit:"contain", animation:"float 2s ease-in-out infinite" }} />
        <div style={{ fontSize:16, fontWeight:700, color:C.text, marginTop:16 }}>분석 중...</div>
        <div style={{ display:"flex", gap:4, marginTop:12 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:4, background:C.mint, animation:`bounce 1s infinite`, animationDelay:`${i * 0.16}s` }} />
          ))}
        </div>
        <div style={{ fontSize:13, color:C.sub, marginTop:12 }}>"{aiQuery}"</div>
      </div>
    </div>
  );

  // ─── AI Result ───
  const renderAIResult = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"#DDD" }} />
      </div>
      <div style={{ padding:"0 20px 8px" }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.text }}>AI 분석 결과</div>
        <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>"{aiQuery}"</div>
      </div>
      <div style={{ flex:1, overflow:"auto", padding:"0 20px 20px" }}>
        <div style={{ fontSize:13, color:C.desc, marginBottom:10 }}>필요한 민원 {aiResults.length}건을 찾았습니다</div>
        {aiResults.map(it => (
          <button key={it.id} onClick={() => { setModal(null); setTimeout(() => openDetail(it), 50); }}
            style={{ display:"block", width:"100%", background:"#F9F9F9", border:`1.5px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:8, textAlign:"left", cursor:"pointer", fontFamily:C.font, transition:"border .15s" }}
            onMouseDown={e => e.currentTarget.style.borderColor = C.mint}
            onMouseUp={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{it.name}</div>
              <div style={{ fontSize:12, fontWeight:700, color: it.fee === 0 ? C.green : C.text }}>{fmtFee(it.fee)}</div>
            </div>
            <div style={{ fontSize:12, color:C.desc, marginTop:2 }}>{it.desc}</div>
            <div style={{ fontSize:11, color:C.mint, fontWeight:600, marginTop:4 }}>옵션 선택 →</div>
          </button>
        ))}
      </div>
      <div style={{ padding:"12px 20px 24px", borderTop:`1px solid ${C.border}` }}>
        <button onClick={closeModal} style={{ width:"100%", padding:"12px", borderRadius:14, border:`2px solid ${C.border}`, background:"#fff", color:C.desc, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:C.font }}>닫기</button>
      </div>
    </div>
  );

  // ─── Docs Modal ───
  const renderDocsModal = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:"#DDD" }} />
      </div>
      <div style={{ padding:"16px 20px 24px" }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:12 }}>📋 필요서류 안내</div>
        {docsContent.map((d, i) => (
          <div key={i} style={{ background:C.amberBg, borderRadius:10, padding:"10px 14px", marginBottom:6, fontSize:14, color:C.amber, fontWeight:600 }}>
            {i + 1}. {d}
          </div>
        ))}
        <button onClick={closeModal} style={{ width:"100%", padding:"12px", borderRadius:14, border:"none", background:C.mint, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:C.font, marginTop:10 }}>확인</button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", padding:20, fontFamily:C.font }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes bounce { 0%,80%,100% { transform: scale(.6); opacity:.4 } 40% { transform: scale(1); opacity:1 } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      {/* iPhone Frame */}
      <div style={{ width:390, height:780, background:"#000", borderRadius:44, padding:4, position:"relative", boxShadow:"0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #333" }}>
        <div style={{ width:"100%", height:"100%", background:C.bg, borderRadius:40, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>
          {/* Status bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 24px 0", background:C.card }}>
            <span style={{ fontSize:12, fontWeight:600, color:C.text }}>9:41</span>
            <div style={{ width:100, height:28, background:"#000", borderRadius:14 }} />
            <div style={{ display:"flex", gap:4, fontSize:11 }}>
              <span>📶</span><span>🔋</span>
            </div>
          </div>

          {/* Logo bar (home only) */}
          {page === "home" && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"6px 16px 2px", background:C.card }}>
              <img src={CI_IMG} alt="" style={{ height:36, objectFit:"contain" }} />
              <span style={{ marginLeft:8, fontSize:14, fontWeight:800, color:C.mintDark }}>민원 프리패스</span>
            </div>
          )}

          {/* Nav Bar */}
          {renderNavBar(
            page === "home" ? "세종 민원 프리패스" : page === "order" ? "요청서" : selCat || "",
            page !== "home"
          )}

          {/* Content */}
          {page === "home" && renderHome()}
          {page === "cat" && renderCat()}
          {page === "order" && renderOrder()}

          {/* Modal Backdrop + Sheet */}
          {modal && (
            <div onClick={closeModal} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", zIndex:10, borderRadius:40 }}>
              {modal === "detail" && renderDetailSheet()}
              {modal === "cart" && renderCartSheet()}
              {modal === "aiLoad" && renderAILoad()}
              {modal === "ai" && renderAIResult()}
              {modal === "docs" && renderDocsModal()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
