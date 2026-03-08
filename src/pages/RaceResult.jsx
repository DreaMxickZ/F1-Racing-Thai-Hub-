import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Zap, Flag, Timer, AlertTriangle, Clock, Loader } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Russo+One&family=DM+Mono:wght@400;500&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,800&display=swap');

.rr4 { font-family:'Barlow',sans-serif; color:#e8e8e8; }
.rr4 *,.rr4 *::before,.rr4 *::after { box-sizing:border-box; margin:0; padding:0; }

.rr4-shell { background:#080809; min-height:100vh; position:relative; overflow-x:hidden; }
.rr4-noise {
  position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px;
}
.rr4-scan {
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.006) 2px,rgba(255,255,255,0.006) 4px);
}
.rr4-glow {
  position:fixed; top:-200px; left:50%; transform:translateX(-50%);
  width:1000px; height:600px;
  background:radial-gradient(ellipse,rgba(225,6,0,0.08) 0%,transparent 65%);
  pointer-events:none; z-index:0;
}
.rr4-inner { max-width:1100px; margin:0 auto; padding:0 1.5rem 7rem; position:relative; z-index:1; }

/* ── BACK ── */
.rr4-back {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.9rem; font-weight:700;
  letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.4);
  background:none; border:1px solid rgba(255,255,255,0.1); border-radius:2px;
  padding:0.55rem 1.1rem; cursor:pointer; margin-top:2rem; margin-bottom:2.5rem; transition:all 0.2s;
}
.rr4-back:hover { color:#fff; border-color:rgba(255,255,255,0.3); }

/* ── HERO ── */
.rr4-hero { padding-bottom:2.5rem; border-bottom:1px solid rgba(255,255,255,0.07); margin-bottom:2.5rem; }
.rr4-round-tag {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'DM Mono',monospace; font-size:0.85rem; font-weight:500;
  color:#e10600; letter-spacing:0.1em; margin-bottom:1rem;
}
.rr4-round-tag::before { content:''; display:block; width:28px; height:2px; background:#e10600; }
.rr4-hero-name {
  font-family:'Russo One',sans-serif;
  font-size:clamp(3rem,8vw,6.5rem); line-height:0.92;
  color:#fff; text-transform:uppercase; letter-spacing:-0.02em; margin-bottom:0.6rem;
}
.rr4-hero-name em { color:#e10600; font-style:normal; }
.rr4-hero-sub {
  font-family:'Barlow Condensed',sans-serif; font-size:1.25rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:1.5rem;
}
.rr4-hero-meta { display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center; font-family:'DM Mono',monospace; font-size:0.82rem; color:rgba(255,255,255,0.3); }
.rr4-hero-meta > span { display:flex; align-items:center; gap:0.4rem; }
.rr4-sprint-badge {
  background:#e10600; color:#fff; font-family:'Barlow Condensed',sans-serif;
  font-size:0.8rem; font-weight:800; letter-spacing:0.15em; text-transform:uppercase;
  padding:0.25rem 0.75rem; border-radius:2px;
}

/* ── TAB GROUPS ── */
.rr4-tab-groups { display:flex; flex-direction:column; gap:6px; margin-bottom:2.5rem; }
.rr4-group-label {
  font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800;
  letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.2);
  padding:0 2px; margin-bottom:2px;
}
.rr4-tab-row { display:flex; gap:2px; background:rgba(255,255,255,0.04); border-radius:3px; padding:3px; flex-wrap:wrap; }
.rr4-tab {
  flex:1; font-family:'Barlow Condensed',sans-serif;
  font-size:0.95rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;
  background:transparent; border:none; border-radius:2px;
  color:rgba(255,255,255,0.3); cursor:pointer; padding:0.72rem 0.75rem; transition:all 0.2s;
  white-space:nowrap; display:flex; align-items:center; justify-content:center; gap:0.35rem;
}
.rr4-tab:hover { color:rgba(255,255,255,0.75); background:rgba(255,255,255,0.04); }
.rr4-tab.active          { background:#e10600; color:#fff; }
.rr4-tab.sprint-tab.active  { background:#ff8c00; }
.rr4-tab.practice-tab.active{ background:rgba(80,180,255,0.8); color:#000; }
/* "loaded" dot — green dot shows data is cached */
.rr4-tab-dot {
  width:5px; height:5px; border-radius:50%; background:rgba(0,210,120,0.7); flex-shrink:0;
}
.rr4-tab.active .rr4-tab-dot { background:rgba(255,255,255,0.6); }

/* ── SECTION HEADER ── */
.rr4-sec-hd { display:flex; align-items:center; gap:0.75rem; margin-bottom:1.35rem; }
.rr4-sec-title {
  font-family:'Barlow Condensed',sans-serif; font-size:0.85rem; font-weight:800;
  letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.25); white-space:nowrap;
}
.rr4-sec-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
.rr4-sec-badge {
  font-family:'DM Mono',monospace; font-size:0.72rem; color:rgba(255,255,255,0.18);
  white-space:nowrap; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
  padding:0.2rem 0.5rem; border-radius:2px;
}
.rr4-api-source {
  font-family:'DM Mono',monospace; font-size:0.68rem;
  color:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.07);
  padding:0.2rem 0.5rem; border-radius:2px; white-space:nowrap;
}

/* ── PODIUM ── */
.rr4-podium { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-bottom:2px; }
.rr4-pod-card {
  background:#111115; border:1px solid rgba(255,255,255,0.06);
  padding:1.75rem 1.5rem; position:relative; overflow:hidden;
  animation:rr4-rise 0.5s ease both;
}
.rr4-pod-card.p1 { border-top:3px solid #FFD700; animation-delay:.05s; }
.rr4-pod-card.p2 { border-top:3px solid #C0C0C0; animation-delay:.10s; }
.rr4-pod-card.p3 { border-top:3px solid #CD7F32; animation-delay:.15s; }
.rr4-pod-ghost {
  position:absolute; right:0.5rem; bottom:-0.5rem;
  font-family:'Russo One',sans-serif; font-size:5.5rem; line-height:1;
  color:rgba(255,255,255,0.03); user-select:none;
}
.rr4-pod-pos { font-family:'Barlow Condensed',sans-serif; font-size:1rem; font-weight:800; letter-spacing:0.1em; margin-bottom:0.6rem; }
.rr4-pod-card.p1 .rr4-pod-pos { color:#FFD700; }
.rr4-pod-card.p2 .rr4-pod-pos { color:#C0C0C0; }
.rr4-pod-card.p3 .rr4-pod-pos { color:#CD7F32; }
.rr4-pod-driver { font-family:'Russo One',sans-serif; font-size:clamp(1.1rem,2.5vw,1.6rem); text-transform:uppercase; color:#fff; line-height:1; margin-bottom:0.3rem; }
.rr4-pod-team { font-size:0.85rem; color:rgba(255,255,255,0.35); margin-bottom:1rem; font-weight:500; }
.rr4-pod-time { font-family:'DM Mono',monospace; font-size:1.05rem; font-weight:500; color:rgba(255,255,255,0.7); }
.rr4-pod-card.p1 .rr4-pod-time { color:#fff; font-size:1.15rem; }
.rr4-pod-laps { font-family:'DM Mono',monospace; font-size:0.78rem; color:rgba(255,255,255,0.22); margin-top:0.35rem; }

/* ── TABLE BASE ── */
.rr4-tbl-wrap { overflow-x:auto; }
.rr4-tbl { width:100%; border-collapse:collapse; min-width:540px; }
.rr4-tbl thead tr { border-bottom:2px solid rgba(255,255,255,0.08); }
.rr4-tbl th {
  font-family:'Barlow Condensed',sans-serif; font-size:0.82rem; font-weight:800;
  letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.25);
  padding:0.8rem 0.9rem; text-align:left;
}
.rr4-tbl th.c { text-align:center; }
.rr4-tbl th.r { text-align:right; }
.rr4-tbl tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); transition:background 0.15s; animation:rr4-rise 0.35s ease both; }
.rr4-tbl tbody tr:hover { background:rgba(255,255,255,0.025); }
.rr4-tbl td { padding:1rem 0.9rem; vertical-align:middle; }

/* pos */
.rr4-pos { font-family:'Russo One',sans-serif; font-size:1.4rem; text-align:center; width:52px; color:rgba(255,255,255,0.22); }
.rr4-pos.p1 { color:#FFD700; } .rr4-pos.p2 { color:#C0C0C0; } .rr4-pos.p3 { color:#CD7F32; }
.rr4-pos.dnf { font-family:'DM Mono',monospace; font-size:0.72rem; letter-spacing:0.08em; color:rgba(255,80,80,0.5); line-height:1.3; }

/* DNF row dim */
.rr4-tbl tbody tr.row-dnf { opacity:0.5; }
.rr4-tbl tbody tr.row-dnf:hover { opacity:0.75; }
.rr4-tbl tbody tr.row-dns { opacity:0.35; }
.rr4-tbl tbody tr.row-dns:hover { opacity:0.6; }

/* status badge (Retired / Lapped / DNS etc.) */
.rr4-status-badge {
  display:inline-flex; align-items:center;
  font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800;
  letter-spacing:0.1em; text-transform:uppercase;
  padding:0.18rem 0.45rem; border-radius:2px; white-space:nowrap;
}
.rr4-status-badge.ret  { background:rgba(255,60,60,0.12);  border:1px solid rgba(255,60,60,0.3);  color:rgba(255,100,100,0.85); }
.rr4-status-badge.lap  { background:rgba(255,140,0,0.10);  border:1px solid rgba(255,140,0,0.28); color:rgba(255,160,60,0.85); }
.rr4-status-badge.dns  { background:rgba(160,160,160,0.08);border:1px solid rgba(160,160,160,0.2);color:rgba(200,200,200,0.5); }
.rr4-status-badge.dsq  { background:rgba(180,78,255,0.10); border:1px solid rgba(180,78,255,0.3); color:rgba(180,78,255,0.85); }

/* qual eliminated zone separators */
.rr4-tbl tbody tr.q-elim-q1 td { opacity:0.45; }
.rr4-tbl tbody tr.q-elim-q2 td { opacity:0.6; }
.rr4-tbl tbody tr.q-zone-sep td:first-child {
  border-top:2px solid rgba(255,255,255,0.12);
}

/* driver */
.rr4-drv { display:flex; align-items:center; gap:0.75rem; }
.rr4-bar { width:4px; border-radius:2px; flex-shrink:0; }
.rr4-drv-last { font-family:'Barlow Condensed',sans-serif; font-size:1.2rem; font-weight:900; text-transform:uppercase; letter-spacing:0.03em; color:#fff; line-height:1; }
.rr4-drv-first { font-size:0.82rem; color:rgba(255,255,255,0.35); line-height:1.5; font-weight:500; }
.rr4-drv-num { font-family:'DM Mono',monospace; font-size:0.82rem; color:rgba(255,255,255,0.18); margin-left:auto; padding-left:0.5rem; }
.rr4-team-td { font-size:0.88rem; font-weight:600; color:rgba(255,255,255,0.35); white-space:nowrap; }

/* time */
.rr4-t { font-family:'DM Mono',monospace; font-size:1rem; font-weight:500; text-align:right; white-space:nowrap; color:rgba(255,255,255,0.5); }
.rr4-t.win   { color:#fff; font-size:1.05rem; }
.rr4-t.gap   { color:rgba(255,255,255,0.32); }
.rr4-t.fl    { color:#b44eff; }
.rr4-t.dnf-t { color:rgba(255,80,80,0.5); font-style:italic; font-size:0.82rem; }
.rr4-t.p1t   { color:#FFD700; }
.rr4-fl {
  display:inline-flex; align-items:center; gap:0.2rem;
  background:rgba(180,78,255,0.12); border:1px solid rgba(180,78,255,0.3); color:#b44eff;
  border-radius:2px; font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800;
  letter-spacing:0.1em; padding:0.15rem 0.4rem; margin-left:0.4rem; vertical-align:middle;
}
.rr4-laps-td { font-family:'DM Mono',monospace; font-size:0.88rem; color:rgba(255,255,255,0.25); text-align:center; }
.rr4-pts-td  { font-family:'Russo One',sans-serif; font-size:1.1rem; text-align:right; color:#fff; }
.rr4-pts-td.zero { color:rgba(255,255,255,0.12); font-family:'DM Mono',monospace; font-size:0.85rem; }

/* qual */
.rr4-qh.q1 { color:rgba(255,255,255,0.25); }
.rr4-qh.q2 { color:rgba(255,200,0,0.5); }
.rr4-qh.q3 { color:rgba(255,120,0,0.6); }
.rr4-qtd { font-family:'DM Mono',monospace; font-size:0.95rem; font-weight:500; text-align:right; white-space:nowrap; color:rgba(255,255,255,0.45); }
.rr4-qtd.pole   { color:#FFD700; font-size:1rem; }
.rr4-qtd.q2best { color:#ffa500; }
.rr4-qtd.elim   { color:rgba(255,255,255,0.15); }
.rr4-qtd.none   { color:rgba(255,255,255,0.1); font-style:italic; font-size:0.78rem; }

/* practice note */
.rr4-prac-note {
  display:flex; align-items:center; gap:0.6rem;
  background:rgba(80,180,255,0.06); border:1px solid rgba(80,180,255,0.15);
  border-radius:3px; padding:0.75rem 1rem; margin-bottom:1.25rem;
  font-size:0.83rem; color:rgba(255,255,255,0.35); line-height:1.5;
}
.rr4-prac-note strong { color:rgba(80,180,255,0.8); }

/* lap filter */
.rr4-lap-filter { display:flex; gap:0.5rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center; }
.rr4-filter-lbl { font-family:'Barlow Condensed',sans-serif; font-size:0.85rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-right:0.25rem; }
.rr4-fbtn {
  font-family:'Barlow Condensed',sans-serif; font-size:0.82rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
  background:#111115; border:1px solid rgba(255,255,255,0.1); border-radius:2px;
  color:rgba(255,255,255,0.4); cursor:pointer; padding:0.45rem 0.85rem; transition:all 0.2s;
}
.rr4-fbtn:hover { color:#fff; border-color:rgba(255,255,255,0.3); }
.rr4-fbtn.active { background:rgba(225,6,0,0.15); border-color:rgba(225,6,0,0.5); color:#ff7070; }
.rr4-lap-num-td { font-family:'DM Mono',monospace; font-size:0.85rem; color:rgba(255,255,255,0.2); text-align:center; width:60px; }
.rr4-lap-t-td { font-family:'DM Mono',monospace; font-size:1rem; font-weight:500; color:rgba(255,255,255,0.65); text-align:right; }
.rr4-lap-t-td.fastest { color:#b44eff; }
.rr4-bar-wrap { padding:0 0.9rem; min-width:80px; }
.rr4-bar-bg { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
.rr4-bar-fill { height:100%; border-radius:2px; }
.rr4-sec-td { font-family:'DM Mono',monospace; font-size:0.82rem; text-align:center; color:rgba(255,255,255,0.28); }

/* pit */
.rr4-pit-n-td { font-family:'Russo One',sans-serif; font-size:1rem; color:rgba(255,255,255,0.2); text-align:center; width:60px; }
.rr4-pit-dur { font-family:'DM Mono',monospace; font-size:1rem; font-weight:500; text-align:right; }
.rr4-pit-dur.fast   { color:#00d4aa; }
.rr4-pit-dur.slow   { color:rgba(255,140,0,0.7); }
.rr4-pit-dur.normal { color:rgba(255,255,255,0.5); }
.rr4-pit-lbl { font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800; letter-spacing:0.1em; margin-left:6px; }

/* loading states */
.rr4-loading-main { min-height:40vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.25rem; }
.rr4-load-track { width:220px; height:2px; background:rgba(255,255,255,0.07); overflow:hidden; border-radius:2px; }
.rr4-load-bar { height:100%; background:#e10600; animation:rr4-slide 1.4s ease-in-out infinite; border-radius:2px; }
.rr4-load-txt { font-family:'DM Mono',monospace; font-size:0.78rem; color:rgba(255,255,255,0.2); letter-spacing:0.2em; }

.rr4-tab-loading {
  display:flex; align-items:center; justify-content:center; gap:0.75rem;
  min-height:20vh; color:rgba(255,255,255,0.25);
  font-family:'DM Mono',monospace; font-size:0.82rem; letter-spacing:0.1em;
}
.rr4-spin { animation:rr4-spin 1s linear infinite; }
@keyframes rr4-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

/* empty / warn */
.rr4-empty { text-align:center; padding:4rem 2rem; font-family:'Barlow Condensed',sans-serif; font-size:1.15rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.15); }
.rr4-warn {
  display:flex; align-items:flex-start; gap:0.75rem;
  background:rgba(255,140,0,0.07); border:1px solid rgba(255,140,0,0.2); border-radius:3px;
  padding:0.9rem 1.1rem; margin-bottom:1.5rem;
  font-size:0.88rem; color:rgba(255,255,255,0.4); line-height:1.6;
}
.rr4-warn strong { color:rgba(255,200,0,0.8); display:block; margin-bottom:0.1rem; }

@keyframes rr4-rise  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes rr4-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }

@media(max-width:680px) {
  .rr4-podium { grid-template-columns:1fr; }
  .rr4-hero-name { font-size:2.8rem; }
  .rr4-tab { font-size:0.82rem; padding:0.6rem 0.5rem; letter-spacing:0.04em; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════ */
const TEAM_COLORS = {
  'Red Bull':'#3671C6','Ferrari':'#E8002D','Mercedes':'#27F4D2',
  'McLaren':'#FF8000','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','Kick Sauber':'#52E252','Haas':'#B6BABD',
};
const teamColor = (n='') => { for(const[k,v] of Object.entries(TEAM_COLORS)) if(n.includes(k)) return v; return '#555'; };

/* Maps tab key → OpenF1 session_name string */
const OF1_SESSION = {
  fp1:      'Practice 1',
  fp2:      'Practice 2',
  fp3:      'Practice 3',
  qual:     'Qualifying',
  sprint_q: 'Sprint Shootout',
  sprint:   'Sprint',
  race:     'Race',
};

/* Which tabs need OpenF1 (lazy load laps/pit from OpenF1) */
const OF1_TABS = new Set(['fp1','fp2','fp3','laps','pits','sprint_laps']);

/* ═══════════════════════════════════════════════════════════════════
   API
═══════════════════════════════════════════════════════════════════ */
const OF1_BASE = 'https://api.openf1.org/v1';
const JOL_BASE = 'https://api.jolpi.ca/ergast/f1';

const of1Get = (path) =>
  fetch(`${OF1_BASE}${path}`).then(r => r.ok ? r.json() : []).catch(() => []);

const jolGet = (path) =>
  fetch(`${JOL_BASE}${path}`).then(r => r.json()).catch(() => ({}));

/* ═══════════════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════════════ */
const posClass = p => ({'1':'p1','2':'p2','3':'p3'}[p] ?? '');
const fmtDate  = d => d ? new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'}) : '';
const toMMSS   = sec => { const m=Math.floor(sec/60); const s=(sec%60).toFixed(3).padStart(6,'0'); return `${m}:${s}`; };

/* ═══════════════════════════════════════════════════════════════════
   SHARED DRIVER CELL
═══════════════════════════════════════════════════════════════════ */
const DrvCell = ({ last, first, num, color, h=40 }) => (
  <div className="rr4-drv">
    <div className="rr4-bar" style={{ background:color, height:h }} />
    <div>
      <div className="rr4-drv-last">{last}</div>
      {first && <div className="rr4-drv-first">{first}</div>}
    </div>
    {num && <span className="rr4-drv-num">#{num}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   TAB LOADING SPINNER
═══════════════════════════════════════════════════════════════════ */
const TabSpinner = ({ label='กำลังโหลด...' }) => (
  <div className="rr4-tab-loading">
    <Loader size={16} className="rr4-spin" />
    <span>{label}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   PODIUM
═══════════════════════════════════════════════════════════════════ */
const Podium = ({ results }) => {
  const labels=['🥇 P1','🥈 P2','🥉 P3'], cls=['p1','p2','p3'];
  return (
    <div className="rr4-podium">
      {results.slice(0,3).map((r,i) => {
        const gap = i===0?(r.Time?.time??r.status):(r.Time?.time?`+${r.Time.time}`:r.status);
        return (
          <div key={i} className={`rr4-pod-card ${cls[i]}`}>
            <div className="rr4-pod-ghost">{i+1}</div>
            <div className="rr4-pod-pos">{labels[i]}</div>
            <div className="rr4-pod-driver">{r.Driver?.familyName}</div>
            <div className="rr4-pod-team">{r.Constructor?.name}</div>
            <div className="rr4-pod-time">{gap}</div>
            <div className="rr4-pod-laps">{r.laps} laps · {r.points} pts</div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   RACE / SPRINT TABLE  — Jolpica  (full grid, DNF with status badges)
═══════════════════════════════════════════════════════════════════ */

/* Classify status string from Jolpica into badge type */
const classifyStatus = (status='') => {
  const s = status.toLowerCase();
  // Finished cleanly
  if (status === 'Finished') return 'finished';
  // Lapped — still finished the race, just behind by 1+ laps e.g. "+1 Lap", "+2 Laps"
  if (/^\+\d+\s*lap/i.test(status)) return 'lap';
  // Did Not Start — never left the grid
  if (s.includes('did not start') || s === 'dns' || s === 'withdrew') return 'dns';
  // Disqualified
  if (s.includes('disqualified') || s === 'dsq') return 'dsq';
  // Everything else = mechanical/crash retirement
  return 'ret';
};

/* Badge label mapping — keeps it short */
const statusLabel = (status='') => {
  const s = status.toLowerCase();
  if (s.includes('did not start') || s === 'dns') return 'DNS';
  if (s.includes('lapped') || /^\+\d+ lap/i.test(status)) return status; // "+1 Lap"
  if (s.includes('disqualified') || s === 'dsq') return 'DSQ';
  // Retired with reason e.g. "Engine", "Gearbox", "Accident" — show as-is (max 12 chars)
  return status.length > 14 ? 'Retired' : status;
};

const StatusBadge = ({ status }) => {
  const type = classifyStatus(status);
  if (type === 'finished') return null;
  return (
    <span className={`rr4-status-badge ${type}`}>
      {statusLabel(status)}
    </span>
  );
};

const RaceTable = ({ results, showPts=true }) => {
  if (!results.length) return <div className="rr4-empty">ยังไม่มีผลการแข่งขัน</div>;

  // Sort by finishing position (Jolpica already sorts, but make sure)
  const sorted = [...results].sort((a,b) => parseInt(a.position)-parseInt(b.position));

  return (
    <>
      <Podium results={sorted}/>
      <div className="rr4-tbl-wrap" style={{marginTop:'2px'}}>
        <table className="rr4-tbl">
          <thead>
            <tr>
              <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
              <th className="r">เวลา / ห่าง / สาเหตุ</th><th className="r">Fastest Lap</th>
              <th className="c">รอบ</th>{showPts&&<th className="r">คะแนน</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r,i)=>{
              const pos      = r.position;
              const status   = r.status ?? '';
              const type     = classifyStatus(status);
              const finished = type === 'finished';
              const isLapped = type === 'lap';
              const isDns    = type === 'dns';
              const isFl     = r.FastestLap?.rank === '1';

              // Time / gap cell
              const timeCell = finished
                ? (pos==='1' ? (r.Time?.time ?? '—') : (r.Time?.time ? `+${r.Time.time}` : '—'))
                : null; // non-finishers show badge instead

              // Row CSS class
              const rowCls = isDns ? 'row-dns' : (!finished && !isLapped) ? 'row-dnf' : '';

              return (
                <tr key={i} className={rowCls} style={{animationDelay:`${i*0.025}s`}}>
                  <td className={`rr4-pos ${posClass(pos)}`}>
                    {pos}
                  </td>
                  <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
                  <td className="rr4-team-td">{r.Constructor?.name}</td>
                  <td className={`rr4-t ${pos==='1'?'win':'gap'}`} style={{textAlign:'right'}}>
                    {finished
                      ? timeCell
                      : isLapped
                        ? <StatusBadge status={status}/>   /* "+1 Lap" badge, orange */
                        : <StatusBadge status={status}/>   /* Retired / DNS / DSQ */
                    }
                  </td>
                  <td className={`rr4-t ${isFl?'fl':''}`}>
                    {r.FastestLap?.Time?.time??'—'}
                    {isFl&&<span className="rr4-fl"><Zap size={9}/> FL</span>}
                  </td>
                  <td className="rr4-laps-td">{r.laps}</td>
                  {showPts&&<td className={`rr4-pts-td ${r.points==='0'?'zero':''}`}>{r.points!=='0'?r.points:'—'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   QUALIFYING TABLE  — Jolpica  (Q1 Q2 Q3, full grid with zone lines)
   allDrivers = raceRes — used to fill drivers who have no qual time (DNS/no time)
═══════════════════════════════════════════════════════════════════ */
const QualTable = ({ results, allDrivers=[], label='Qualifying' }) => {
  if (!results.length) return <div className="rr4-empty">ยังไม่มีข้อมูล {label}</div>;
  const hasQ2=results.some(r=>r.Q2), hasQ3=results.some(r=>r.Q3);
  const fastest=key=>results.reduce((b,r)=>(!r[key]?b:(!b||r[key]<b)?r[key]:b),null);
  const fQ1=fastest('Q1'),fQ2=fastest('Q2'),fQ3=fastest('Q3');

  // Sort qual results by position
  const sorted=[...results].sort((a,b)=>parseInt(a.position)-parseInt(b.position));

  // Find drivers in race entry list that are NOT in qual results
  const qualDriverIds = new Set(sorted.map(r=>r.Driver?.driverId));
  const missing = allDrivers
    .filter(r => r.Driver?.driverId && !qualDriverIds.has(r.Driver.driverId))
    .map(r => ({
      // Build a fake qual entry with no times
      Driver:      r.Driver,
      Constructor: r.Constructor,
      number:      r.number,
      position:    '—',
      Q1: null, Q2: null, Q3: null,
      _noTime: true,
    }));

  const colSpan = 3 + 1 + (hasQ2?1:0) + (hasQ3?1:0);

  const QCell=({val,best,elim,isPole})=>{
    if(!val) return <td className="rr4-qtd none">—</td>;
    return <td className={`rr4-qtd ${val===best&&isPole?'pole':val===best?'q2best':elim?'elim':''}`}>{val}{val===best&&isPole?' ★':''}</td>;
  };

  const ZoneRow=({label:zl,color})=>(
    <tr style={{background:'transparent'}}>
      <td colSpan={colSpan} style={{
        padding:'0.3rem 0.9rem',
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:'0.68rem', fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase',
        color, borderTop:`1px solid ${color}44`, borderBottom:`1px solid rgba(255,255,255,0.04)`,
        background:`${color}08`,
      }}>── {zl}</td>
    </tr>
  );

  const q3cutoff = hasQ3 ? 10 : null;
  const q2cutoff = hasQ2 ? 15 : null;

  const rows=[];

  // ── Drivers with qual times ──
  sorted.forEach((r,i)=>{
    const pos=parseInt(r.position);
    if(hasQ3 && pos===q3cutoff+1) rows.push(<ZoneRow key="div-q2" label="ตกรอบ Q3 · อันดับ 11–15" color="#ffa500"/>);
    if(hasQ2 && pos===q2cutoff+1) rows.push(<ZoneRow key="div-q1" label="ตกรอบ Q2 · อันดับ 16+" color="rgba(255,255,255,0.3)"/>);

    const elimQ2 = hasQ3 && pos > (q3cutoff??99);
    const elimQ1 = hasQ2 && pos > (q2cutoff??99);
    const rowCls = elimQ1 ? 'q-elim-q1' : elimQ2 ? 'q-elim-q2' : '';

    rows.push(
      <tr key={`q-${r.Driver?.driverId}`} className={rowCls} style={{animationDelay:`${i*0.025}s`}}>
        <td className={`rr4-pos ${pos<=3?`p${pos}`:''}`} style={pos>3?{fontSize:'1.1rem',color:'rgba(255,255,255,0.3)'}:{}}>{pos}</td>
        <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
        <td className="rr4-team-td">{r.Constructor?.name}</td>
        <QCell val={r.Q1} best={fQ1} elim={false} isPole={false}/>
        {hasQ2&&<QCell val={r.Q2} best={fQ2} elim={elimQ1} isPole={false}/>}
        {hasQ3&&<QCell val={r.Q3} best={fQ3} elim={elimQ2} isPole={true}/>}
      </tr>
    );
  });

  // ── Drivers with NO qual time — append at bottom with separator ──
  if (missing.length > 0) {
    rows.push(<ZoneRow key="div-notime" label={`ไม่มีเวลา / ไม่ได้ออกรถ · ${missing.length} คน`} color="rgba(120,120,120,0.5)"/>);
    missing.forEach((r,i)=>(
      rows.push(
        <tr key={`m-${r.Driver?.driverId}`} className="row-dns" style={{animationDelay:`${(sorted.length+i)*0.025}s`}}>
          <td className="rr4-pos" style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.15)',fontFamily:"'DM Mono',monospace"}}>—</td>
          <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
          <td className="rr4-team-td">{r.Constructor?.name}</td>
          <td className="rr4-qtd none">—</td>
          {hasQ2&&<td className="rr4-qtd none">—</td>}
          {hasQ3&&<td className="rr4-qtd none">—</td>}
        </tr>
      )
    ));
  }

  return (
    <div className="rr4-tbl-wrap">
      <table className="rr4-tbl">
        <thead>
          <tr>
            <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
            <th className="r rr4-qh q1">Q1</th>
            {hasQ2&&<th className="r rr4-qh q2">Q2</th>}
            {hasQ3&&<th className="r rr4-qh q3">Q3 / Pole</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PRACTICE TABLE  — OpenF1  (best lap per driver)
═══════════════════════════════════════════════════════════════════ */
const PracticeTable = ({ laps, drivers, sessionName }) => {
  if (!laps.length) return <div className="rr4-empty">ไม่พบข้อมูล {sessionName} จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const best={};
  laps.forEach(l=>{
    if(!l.lap_duration||l.lap_duration<=0) return;
    if(!best[l.driver_number]||l.lap_duration<best[l.driver_number].lap_duration) best[l.driver_number]=l;
  });
  const sorted=Object.values(best).sort((a,b)=>a.lap_duration-b.lap_duration);
  if(!sorted.length) return <div className="rr4-empty">ไม่มีข้อมูล Lap Time ที่ถูกต้องใน {sessionName}</div>;
  const ref=sorted[0].lap_duration;
  const fmtS=v=>v!=null?v.toFixed(3):'—';
  return (
    <>
      <div className="rr4-prac-note">
        <Clock size={14} color="rgba(80,180,255,0.8)" style={{flexShrink:0,marginTop:1}}/>
        <div><strong>Practice Best Lap</strong>เวลา Lap ที่ดีที่สุดของแต่ละนักแข่งใน {sessionName}</div>
      </div>
      <div className="rr4-tbl-wrap">
        <table className="rr4-tbl">
          <thead>
            <tr>
              <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
              <th className="r">Best Lap</th><th className="r">ห่าง P1</th>
              <th className="c">รอบที่</th><th className="c">S1</th><th className="c">S2</th><th className="c">S3</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((lap,i)=>{
              const d=dMap[lap.driver_number];
              const color=d?.team_colour?`#${d.team_colour}`:'#555';
              return (
                <tr key={i} style={{animationDelay:`${i*0.025}s`}}>
                  <td className={`rr4-pos ${i===0?'p1':i===1?'p2':i===2?'p3':''}`}>{i+1}</td>
                  <td>
                    <DrvCell
                      last={d?.last_name??d?.full_name?.split(' ').pop()??`#${lap.driver_number}`}
                      first={d?.first_name??''}
                      num={lap.driver_number} color={color}
                    />
                  </td>
                  <td className="rr4-team-td">{d?.team_name??'—'}</td>
                  <td className={`rr4-t ${i===0?'p1t':''}`}>
                    {toMMSS(lap.lap_duration)}
                    {i===0&&<span className="rr4-fl"><Zap size={9}/> P1</span>}
                  </td>
                  <td className="rr4-t gap">{i===0?'—':`+${(lap.lap_duration-ref).toFixed(3)}`}</td>
                  <td className="rr4-laps-td">{lap.lap_number}</td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_1)}</td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_2)}</td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   LAP TIMES TABLE  — OpenF1 Race
═══════════════════════════════════════════════════════════════════ */
const LapTable = ({ laps, drivers }) => {
  const [sel,setSel]=useState('ALL');
  if(!laps.length) return <div className="rr4-empty">ไม่พบข้อมูล Lap Times จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const filtered=sel==='ALL'?laps:laps.filter(l=>String(l.driver_number)===sel);
  const durs=laps.map(l=>l.lap_duration).filter(v=>v&&v>0);
  const gMin=Math.min(...durs), gMax=Math.max(...durs.filter(v=>v<gMin*1.15));
  const range=gMax-gMin||1;
  const uniq=[...new Set(laps.map(l=>String(l.driver_number)))].sort((a,b)=>+a-+b);
  const fmtS=v=>v!=null?v.toFixed(3):'—';
  return (
    <>
      <div className="rr4-lap-filter">
        <span className="rr4-filter-lbl">นักแข่ง :</span>
        <button className={`rr4-fbtn ${sel==='ALL'?'active':''}`} onClick={()=>setSel('ALL')}>ทั้งหมด</button>
        {uniq.map(num=>{
          const d=dMap[num];
          const color=d?.team_colour?`#${d.team_colour}`:undefined;
          return (
            <button key={num} className={`rr4-fbtn ${sel===num?'active':''}`}
              onClick={()=>setSel(num)}
              style={sel===num&&color?{borderColor:color,color}:{}}>
              {d?.name_acronym??`#${num}`}
            </button>
          );
        })}
      </div>
      <div className="rr4-tbl-wrap">
        <table className="rr4-tbl">
          <thead>
            <tr>
              <th className="c">Lap</th>
              {sel==='ALL'&&<th>นักแข่ง</th>}
              <th className="r">เวลา (วิ)</th><th>กราฟ</th>
              <th className="c">S1</th><th className="c">S2</th><th className="c">S3</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,100).map((lap,i)=>{
              const dur=lap.lap_duration;
              const isFastest=dur===gMin;
              const barW=dur?Math.max(4,(1-(dur-gMin)/range)*100):0;
              const d=dMap[lap.driver_number];
              const color=d?.team_colour?`#${d.team_colour}`:'#555';
              return (
                <tr key={i} style={{animationDelay:`${Math.min(i,30)*0.015}s`}}>
                  <td className="rr4-lap-num-td">{lap.lap_number}</td>
                  {sel==='ALL'&&(
                    <td>
                      <div className="rr4-drv">
                        <div className="rr4-bar" style={{background:color,height:28}}/>
                        <div className="rr4-drv-last" style={{fontSize:'0.95rem'}}>{d?.name_acronym??`#${lap.driver_number}`}</div>
                      </div>
                    </td>
                  )}
                  <td className={`rr4-lap-t-td ${isFastest?'fastest':''}`}>
                    {dur!=null?dur.toFixed(3):'—'}
                    {isFastest&&<span className="rr4-fl"><Zap size={9}/> FL</span>}
                  </td>
                  <td className="rr4-bar-wrap">
                    <div className="rr4-bar-bg">
                      <div className="rr4-bar-fill" style={{width:`${barW}%`,background:isFastest?'#b44eff':'#e10600'}}/>
                    </div>
                  </td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_1)}</td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_2)}</td>
                  <td className="rr4-sec-td">{fmtS(lap.duration_sector_3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length>100&&(
          <div style={{textAlign:'center',padding:'0.85rem',fontSize:'0.75rem',color:'rgba(255,255,255,0.18)',fontFamily:'DM Mono'}}>
            แสดง 100 รอบแรก / {filtered.length} รอบทั้งหมด
          </div>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PIT TABLE  — OpenF1
═══════════════════════════════════════════════════════════════════ */
const PitTable = ({ pits, drivers }) => {
  if(!pits.length) return <div className="rr4-empty">ไม่พบข้อมูล Pit Stops จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const times=pits.map(p=>p.pit_duration).filter(Boolean);
  const minP=Math.min(...times), maxP=Math.max(...times);
  const pitCls=dur=>!dur?'normal':dur<=minP*1.06?'fast':dur>=maxP*0.9?'slow':'normal';
  return (
    <div className="rr4-tbl-wrap">
      <table className="rr4-tbl">
        <thead>
          <tr><th className="c">#</th><th>นักแข่ง</th><th className="c">รอบที่</th><th className="r">เวลา (วิ)</th></tr>
        </thead>
        <tbody>
          {pits.map((p,i)=>{
            const d=dMap[p.driver_number];
            const cls=pitCls(p.pit_duration);
            const color=d?.team_colour?`#${d.team_colour}`:'#555';
            return (
              <tr key={i} style={{animationDelay:`${i*0.025}s`}}>
                <td className="rr4-pit-n-td">{i+1}</td>
                <td><DrvCell last={d?.full_name??`Driver #${p.driver_number}`} first={d?.team_name??''} color={color} h={32}/></td>
                <td className="rr4-laps-td">{p.lap_number}</td>
                <td className={`rr4-pit-dur ${cls}`}>
                  {p.pit_duration!=null?p.pit_duration.toFixed(3):'—'}
                  {cls==='fast'&&<span className="rr4-pit-lbl" style={{color:'#00d4aa'}}>FAST</span>}
                  {cls==='slow'&&<span className="rr4-pit-lbl" style={{color:'#ff8c00'}}>SLOW</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN  RaceResult  — LAZY LOAD per tab
═══════════════════════════════════════════════════════════════════ */
const RaceResult = ({ race, season=2025, onBack }) => {
  const [tab, setTab]           = useState('race');
  const [initLoading, setInit]  = useState(true);  // first load (Jolpica only)
  const [tabLoading, setTabLoading] = useState(false);  // per-tab OpenF1 load
  const [warn, setWarn]         = useState(null);

  // ── Jolpica (loaded immediately, small payloads) ──
  const [raceRes,   setRaceRes]   = useState([]);
  const [qualRes,   setQualRes]   = useState([]);
  const [sprintRes, setSprintRes] = useState([]);

  // ── OpenF1 (lazy, loaded on tab click) ──
  const [raceLaps,   setRaceLaps]   = useState([]);
  const [racePits,   setRacePits]   = useState([]);
  const [sprintLaps, setSprintLaps] = useState([]);
  const [fp1Laps,    setFp1Laps]    = useState([]);
  const [fp2Laps,    setFp2Laps]    = useState([]);
  const [fp3Laps,    setFp3Laps]    = useState([]);
  const [drivers,    setDrivers]    = useState([]);

  // track which OF1 tabs already fetched (avoid re-fetch)
  const fetched    = useRef(new Set());
  // cache all sessions for this weekend
  const sessionsRef = useRef(null);

  const isSprint = !!(race?.Sprint);
  const hasFP3   = !!(race?.ThirdPractice) && !isSprint;
  const round    = race?.round;

  /* ── Step 1: Load Jolpica data (small, always needed) ── */
  useEffect(() => {
    if (!round) return;
    fetched.current.clear();
    sessionsRef.current = null;
    setInit(true);
    setWarn(null);
    // Reset OF1 data when race changes
    setRaceLaps([]); setRacePits([]); setSprintLaps([]);
    setFp1Laps([]); setFp2Laps([]); setFp3Laps([]); setDrivers([]);

    const fetches = [
      jolGet(`/${season}/${round}/results.json?limit=30`)
        .then(d => setRaceRes(d?.MRData?.RaceTable?.Races?.[0]?.Results ?? [])),
      jolGet(`/${season}/${round}/qualifying.json?limit=30`)
        .then(d => setQualRes(d?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? [])),
      ...(isSprint ? [
        jolGet(`/${season}/${round}/sprint.json?limit=30`)
          .then(d => setSprintRes(d?.MRData?.RaceTable?.Races?.[0]?.SprintResults ?? []))
      ] : []),
    ];

    Promise.allSettled(fetches.map(p => p.catch(()=>{}))).finally(() => setInit(false));
  }, [season, round, isSprint]);

  /* ── Step 2: Lazy-load OpenF1 sessions list (once per race weekend) ── */
  const ensureSessions = useCallback(async () => {
    if (sessionsRef.current) return sessionsRef.current;
    const all = await of1Get(`/sessions?year=${season}`);
    if (!Array.isArray(all)) { sessionsRef.current = []; return []; }
    const raceTs = new Date(race.date).getTime();
    const FIVE_DAYS = 5 * 86400000;
    sessionsRef.current = all.filter(s => Math.abs(new Date(s.date_start).getTime() - raceTs) < FIVE_DAYS);
    return sessionsRef.current;
  }, [season, race?.date]);

  const getSessionKey = (sessions, name) =>
    sessions.find(s => s.session_name?.toLowerCase() === name.toLowerCase())?.session_key ?? null;

  /* ── Step 3: Fetch OF1 data only when tab is clicked ── */
  const loadTab = useCallback(async (newTab) => {
    if (fetched.current.has(newTab)) return; // already loaded
    if (!OF1_TABS.has(newTab)) return;        // Jolpica tab, skip

    setTabLoading(true);
    try {
      const sessions = await ensureSessions();

      // Also fetch drivers once (for all OF1 tabs)
      if (!fetched.current.has('_drivers') && sessions.length) {
        const raceKey = getSessionKey(sessions, OF1_SESSION.race);
        if (raceKey) {
          const drvData = await of1Get(`/drivers?session_key=${raceKey}`);
          setDrivers(Array.isArray(drvData) ? drvData : []);
          fetched.current.add('_drivers');
        }
      }

      if (!sessions.length) {
        setWarn('ไม่พบ session ใน OpenF1 สำหรับสนามนี้');
        fetched.current.add(newTab);
        return;
      }

      const sessionName = {
        laps:        OF1_SESSION.race,
        pits:        OF1_SESSION.race,
        fp1:         OF1_SESSION.fp1,
        fp2:         OF1_SESSION.fp2,
        fp3:         OF1_SESSION.fp3,
        sprint_laps: OF1_SESSION.sprint,
      }[newTab];

      const key = getSessionKey(sessions, sessionName);
      if (!key) {
        setWarn(`ไม่พบ session "${sessionName}" ใน OpenF1`);
        fetched.current.add(newTab);
        return;
      }

      // Fetch laps for tab; fetch pits alongside when tab=laps
      if (newTab === 'laps') {
        const [lapData, pitData] = await Promise.all([
          of1Get(`/laps?session_key=${key}`),
          of1Get(`/pit?session_key=${key}`),
        ]);
        setRaceLaps(Array.isArray(lapData) ? lapData : []);
        setRacePits(Array.isArray(pitData) ? pitData : []);
        fetched.current.add('laps');
        fetched.current.add('pits'); // mark pits as done too (same session)
      } else if (newTab === 'pits') {
        // already fetched with laps if user went laps first;
        // if coming here directly fetch just pit
        if (!fetched.current.has('pits')) {
          const pitData = await of1Get(`/pit?session_key=${key}`);
          setRacePits(Array.isArray(pitData) ? pitData : []);
        }
      } else if (newTab === 'fp1') {
        const d = await of1Get(`/laps?session_key=${key}`);
        setFp1Laps(Array.isArray(d) ? d : []);
      } else if (newTab === 'fp2') {
        const d = await of1Get(`/laps?session_key=${key}`);
        setFp2Laps(Array.isArray(d) ? d : []);
      } else if (newTab === 'fp3') {
        const d = await of1Get(`/laps?session_key=${key}`);
        setFp3Laps(Array.isArray(d) ? d : []);
      } else if (newTab === 'sprint_laps') {
        const d = await of1Get(`/laps?session_key=${key}`);
        setSprintLaps(Array.isArray(d) ? d : []);
      }

      fetched.current.add(newTab);
    } catch {
      setWarn('ดึงข้อมูลจาก OpenF1 ไม่สำเร็จ');
    } finally {
      setTabLoading(false);
    }
  }, [ensureSessions]);

  /* ── Handle tab change ── */
  const handleTab = (key) => {
    setTab(key);
    setWarn(null);
    loadTab(key);
  };

  /* ── Tab config ── */
  const TAB_GROUPS = [
    {
      label: '🏎  Race Weekend',
      tabs: [
        { key:'race',      label:'🏁 Race Result' },
        { key:'qual',      label:'⏱ Qualifying' },
        ...(isSprint ? [
          { key:'sprint',    label:'🏃 Sprint Race',  cls:'sprint-tab' },
          { key:'sprint_q',  label:'⚡ Sprint Quali', cls:'sprint-tab' },
        ] : []),
      ],
    },
    {
      label: '🔬  Race Data · OpenF1 (โหลดเมื่อกด)',
      tabs: [
        { key:'laps',  label:'📊 Lap Times' },
        { key:'pits',  label:'🔧 Pit Stops' },
      ],
    },
    {
      label: '🧪  Practice · OpenF1 (โหลดเมื่อกด)',
      tabs: [
        { key:'fp1', label:'FP 1', cls:'practice-tab' },
        { key:'fp2', label:'FP 2', cls:'practice-tab' },
        ...(!isSprint ? [{ key:'fp3', label:'FP 3', cls:'practice-tab' }] : []),
      ],
    },
  ];

  const SEC_LABELS = {
    race:'ผลการแข่งขัน', qual:'Qualifying — Q1 · Q2 · Q3',
    sprint:'Sprint Race', sprint_q:'Sprint Qualifying / Shootout',
    laps:'Lap Times · OpenF1', pits:'Pit Stops · OpenF1',
    fp1:'Practice 1 — Best Laps · OpenF1',
    fp2:'Practice 2 — Best Laps · OpenF1',
    fp3:'Practice 3 — Best Laps · OpenF1',
  };

  const isLoaded = (key) => fetched.current.has(key);

  const nameShort = (race?.raceName??'').replace('Grand Prix','').trim();
  const circuit   = race?.Circuit?.circuitName??'';
  const loc       = [race?.Circuit?.Location?.locality, race?.Circuit?.Location?.country].filter(Boolean).join(', ');

  /* count badge per tab */
  const countBadge = { laps: raceLaps.length, pits: racePits.length, fp1: fp1Laps.length, fp2: fp2Laps.length, fp3: fp3Laps.length };

  return (
    <div className="rr4">
      <style>{CSS}</style>
      <div className="rr4-shell">
        <div className="rr4-noise"/><div className="rr4-scan"/><div className="rr4-glow"/>
        <div className="rr4-inner">

          <button className="rr4-back" onClick={onBack}><ChevronLeft size={14}/> ตารางแข่ง</button>

          {/* HERO */}
          <div className="rr4-hero">
            <div className="rr4-round-tag">Round {round} · {season}</div>
            <h1 className="rr4-hero-name"><em>{nameShort}</em><br/>Grand Prix</h1>
            <div className="rr4-hero-sub">{circuit}</div>
            <div className="rr4-hero-meta">
              <span><Flag size={13}/> {loc}</span>
              <span><Timer size={13}/> {fmtDate(race?.date)}</span>
              {isSprint&&<span className="rr4-sprint-badge">🏃 Sprint Weekend</span>}
            </div>
          </div>

          {/* TAB GROUPS */}
          <div className="rr4-tab-groups">
            {TAB_GROUPS.map((grp,gi) => (
              <div key={gi}>
                <div className="rr4-group-label">{grp.label}</div>
                <div className="rr4-tab-row">
                  {grp.tabs.map(t => (
                    <button
                      key={t.key}
                      className={`rr4-tab ${t.cls??''} ${tab===t.key?'active':''}`}
                      onClick={() => handleTab(t.key)}
                    >
                      {/* green dot = data cached */}
                      {isLoaded(t.key) && tab!==t.key && <span className="rr4-tab-dot"/>}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* WARN */}
          {warn && (
            <div className="rr4-warn">
              <AlertTriangle size={16} color="#ffa500" style={{flexShrink:0,marginTop:2}}/>
              <div><strong>OpenF1 Notice</strong>{warn} — ข้อมูลพร้อมใช้งานเฉพาะซีซั่นล่าสุด</div>
            </div>
          )}

          {/* MAIN LOADING (Jolpica first load) */}
          {initLoading ? (
            <div className="rr4-loading-main">
              <div className="rr4-load-track"><div className="rr4-load-bar"/></div>
              <p className="rr4-load-txt">loading race data...</p>
            </div>
          ) : (
            <>
              {/* Section header */}
              <div className="rr4-sec-hd">
                <span className="rr4-sec-title">{SEC_LABELS[tab]}</span>
                <div className="rr4-sec-line"/>
                {countBadge[tab] > 0 && <span className="rr4-sec-badge">{countBadge[tab].toLocaleString()} rows</span>}
                {OF1_TABS.has(tab) && <span className="rr4-api-source">OpenF1</span>}
              </div>

              {/* TAB LOADING SPINNER */}
              {tabLoading ? (
                <TabSpinner label={`กำลังโหลดจาก OpenF1...`}/>
              ) : (
                <>
                  {tab==='race'     && <RaceTable   results={raceRes}   showPts={true}/>}
                  {tab==='qual'     && <QualTable   results={qualRes}   allDrivers={raceRes} label="Qualifying"/>}
                  {tab==='sprint'   && <RaceTable   results={sprintRes} showPts={true}/>}
                  {tab==='sprint_q' && <QualTable   results={qualRes}   allDrivers={raceRes} label="Sprint Qualifying"/>}
                  {tab==='laps'     && <LapTable    laps={raceLaps}  drivers={drivers}/>}
                  {tab==='pits'     && <PitTable    pits={racePits}  drivers={drivers}/>}
                  {tab==='fp1'      && <PracticeTable laps={fp1Laps} drivers={drivers} sessionName="Practice 1"/>}
                  {tab==='fp2'      && <PracticeTable laps={fp2Laps} drivers={drivers} sessionName="Practice 2"/>}
                  {tab==='fp3'      && <PracticeTable laps={fp3Laps} drivers={drivers} sessionName="Practice 3"/>}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default RaceResult;