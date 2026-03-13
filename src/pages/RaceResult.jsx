import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Zap, Flag, Timer, AlertTriangle, Clock, Loader, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { jolpicaApi } from '../services/f1Api';
import { getRaceBySlug } from '../data/races2026';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Russo+One&family=DM+Mono:wght@400;500&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,800&display=swap');
.rr4 { font-family:'Barlow',sans-serif; color:#e8e8e8; }
.rr4 *,.rr4 *::before,.rr4 *::after { box-sizing:border-box; margin:0; padding:0; }
.rr4-shell { background:#080809; min-height:100vh; position:relative; overflow-x:hidden; }
.rr4-noise { position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px; }
.rr4-scan { position:fixed;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.006) 2px,rgba(255,255,255,0.006) 4px); }
.rr4-glow { position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:1000px;height:600px;background:radial-gradient(ellipse,rgba(225,6,0,0.08) 0%,transparent 65%);pointer-events:none;z-index:0; }
.rr4-inner { max-width:1100px;margin:0 auto;padding:0 1.5rem 7rem;position:relative;z-index:1; }
.rr4-back { display:inline-flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);background:none;border:1px solid rgba(255,255,255,0.1);border-radius:2px;padding:0.55rem 1.1rem;cursor:pointer;margin-top:2rem;margin-bottom:2.5rem;transition:all 0.2s; }
.rr4-back:hover { color:#fff;border-color:rgba(255,255,255,0.3); }
.rr4-hero { padding-bottom:2.5rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:2.5rem; }
.rr4-round-tag { display:inline-flex;align-items:center;gap:0.5rem;font-family:'DM Mono',monospace;font-size:0.85rem;font-weight:500;color:#e10600;letter-spacing:0.1em;margin-bottom:1rem; }
.rr4-round-tag::before { content:'';display:block;width:28px;height:2px;background:#e10600; }
.rr4-hero-name { font-family:'Russo One',sans-serif;font-size:clamp(3rem,8vw,6.5rem);line-height:0.92;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:0.6rem; }
.rr4-hero-name em { color:#e10600;font-style:normal; }
.rr4-hero-sub { font-family:'Barlow Condensed',sans-serif;font-size:1.25rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1.5rem; }
.rr4-hero-meta { display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;font-family:'DM Mono',monospace;font-size:0.82rem;color:rgba(255,255,255,0.3); }
.rr4-hero-meta > span { display:flex;align-items:center;gap:0.4rem; }
.rr4-sprint-badge { background:#e10600;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;padding:0.25rem 0.75rem;border-radius:2px; }
.rr4-tab-groups { display:flex;flex-direction:column;gap:6px;margin-bottom:1.25rem; }
.rr4-group-label { font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:0 2px;margin-bottom:2px; }
.rr4-tab-row { display:flex;gap:2px;background:rgba(255,255,255,0.04);border-radius:3px;padding:3px;flex-wrap:wrap; }
.rr4-tab { flex:1;font-family:'Barlow Condensed',sans-serif;font-size:0.95rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;background:transparent;border:none;border-radius:2px;color:rgba(255,255,255,0.3);cursor:pointer;padding:0.72rem 0.75rem;transition:all 0.2s;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:0.35rem; }
.rr4-tab:hover { color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.04); }
.rr4-tab.active { background:#e10600;color:#fff; }
.rr4-tab.sprint-tab.active { background:#ff8c00; }
.rr4-tab.practice-tab.active { background:rgba(80,180,255,0.8);color:#000; }
.rr4-tab.tyre-tab.active { background:rgba(255,230,0,0.85);color:#000; }
.rr4-tab.grid-tab.active { background:linear-gradient(135deg,#00c97a,#0080ff);color:#fff; }
.rr4-tab-dot { width:5px;height:5px;border-radius:50%;background:rgba(0,210,120,0.7);flex-shrink:0; }
.rr4-tab.active .rr4-tab-dot { background:rgba(255,255,255,0.6); }

/* ── API Disclaimer Banner ── */
.rr4-api-disclaimer {
  display:flex;align-items:flex-start;gap:0.65rem;
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.07);
  border-left:2px solid rgba(255,200,0,0.35);
  border-radius:3px;
  padding:0.65rem 0.9rem;
  margin-bottom:2rem;
  font-family:'DM Mono',monospace;font-size:0.72rem;
  color:rgba(255,255,255,0.22);line-height:1.6;
}
.rr4-api-disclaimer-icon { flex-shrink:0;margin-top:1px;color:rgba(255,200,0,0.4); }
.rr4-api-disclaimer strong { color:rgba(255,200,0,0.5);font-size:0.74rem; }
.rr4-api-disclaimer-sep { margin:0 0.4em;color:rgba(255,255,255,0.1); }

.rr4-sec-hd { display:flex;align-items:center;gap:0.75rem;margin-bottom:1.35rem; }
.rr4-sec-title { font-family:'Barlow Condensed',sans-serif;font-size:0.85rem;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.25);white-space:nowrap; }
.rr4-sec-line { flex:1;height:1px;background:rgba(255,255,255,0.06); }
.rr4-sec-badge { font-family:'DM Mono',monospace;font-size:0.72rem;color:rgba(255,255,255,0.18);white-space:nowrap;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:0.2rem 0.5rem;border-radius:2px; }
.rr4-api-source { font-family:'DM Mono',monospace;font-size:0.68rem;color:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.07);padding:0.2rem 0.5rem;border-radius:2px;white-space:nowrap; }
.rr4-podium { display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-bottom:2px; }
.rr4-pod-card { background:#111115;border:1px solid rgba(255,255,255,0.06);padding:1.75rem 1.5rem;position:relative;overflow:hidden;animation:rr4-rise 0.5s ease both; }
.rr4-pod-card.p1 { border-top:3px solid #FFD700;animation-delay:.05s; }
.rr4-pod-card.p2 { border-top:3px solid #C0C0C0;animation-delay:.10s; }
.rr4-pod-card.p3 { border-top:3px solid #CD7F32;animation-delay:.15s; }
.rr4-pod-ghost { position:absolute;right:0.5rem;bottom:-0.5rem;font-family:'Russo One',sans-serif;font-size:5.5rem;line-height:1;color:rgba(255,255,255,0.03);user-select:none; }
.rr4-pod-pos { font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:800;letter-spacing:0.1em;margin-bottom:0.6rem; }
.rr4-pod-card.p1 .rr4-pod-pos{color:#FFD700;}.rr4-pod-card.p2 .rr4-pod-pos{color:#C0C0C0;}.rr4-pod-card.p3 .rr4-pod-pos{color:#CD7F32;}
.rr4-pod-driver { font-family:'Russo One',sans-serif;font-size:clamp(1.1rem,2.5vw,1.6rem);text-transform:uppercase;color:#fff;line-height:1;margin-bottom:0.3rem; }
.rr4-pod-team { font-size:0.85rem;color:rgba(255,255,255,0.35);margin-bottom:1rem;font-weight:500; }
.rr4-pod-time { font-family:'DM Mono',monospace;font-size:1.05rem;font-weight:500;color:rgba(255,255,255,0.7); }
.rr4-pod-card.p1 .rr4-pod-time{color:#fff;font-size:1.15rem;}
.rr4-pod-laps { font-family:'DM Mono',monospace;font-size:0.78rem;color:rgba(255,255,255,0.22);margin-top:0.35rem; }
.rr4-tbl-wrap { overflow-x:auto; }
.rr4-tbl { width:100%;border-collapse:collapse;min-width:540px; }
.rr4-tbl thead tr { border-bottom:2px solid rgba(255,255,255,0.08); }
.rr4-tbl th { font-family:'Barlow Condensed',sans-serif;font-size:0.82rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.25);padding:0.8rem 0.9rem;text-align:left; }
.rr4-tbl th.c{text-align:center;}.rr4-tbl th.r{text-align:right;}
.rr4-tbl tbody tr { border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;animation:rr4-rise 0.35s ease both; }
.rr4-tbl tbody tr:hover { background:rgba(255,255,255,0.025); }
.rr4-tbl td { padding:1rem 0.9rem;vertical-align:middle; }
.rr4-pos { font-family:'Russo One',sans-serif;font-size:1.4rem;text-align:center;width:52px;color:rgba(255,255,255,0.22); }
.rr4-pos.p1{color:#FFD700;}.rr4-pos.p2{color:#C0C0C0;}.rr4-pos.p3{color:#CD7F32;}
.rr4-tbl tbody tr.row-dnf{opacity:0.5;}.rr4-tbl tbody tr.row-dnf:hover{opacity:0.75;}
.rr4-tbl tbody tr.row-dns{opacity:0.35;}.rr4-tbl tbody tr.row-dns:hover{opacity:0.6;}
.rr4-status-badge{display:inline-flex;align-items:center;font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:0.18rem 0.45rem;border-radius:2px;white-space:nowrap;}
.rr4-status-badge.ret{background:rgba(255,60,60,0.12);border:1px solid rgba(255,60,60,0.3);color:rgba(255,100,100,0.85);}
.rr4-status-badge.lap{background:rgba(255,140,0,0.10);border:1px solid rgba(255,140,0,0.28);color:rgba(255,160,60,0.85);}
.rr4-status-badge.dns{background:rgba(160,160,160,0.08);border:1px solid rgba(160,160,160,0.2);color:rgba(200,200,200,0.5);}
.rr4-status-badge.dsq{background:rgba(180,78,255,0.10);border:1px solid rgba(180,78,255,0.3);color:rgba(180,78,255,0.85);}
.rr4-tbl tbody tr.q-elim-q1 td{opacity:0.45;}.rr4-tbl tbody tr.q-elim-q2 td{opacity:0.6;}
.rr4-drv{display:flex;align-items:center;gap:0.75rem;}
.rr4-bar{width:4px;border-radius:2px;flex-shrink:0;}
.rr4-drv-last{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;text-transform:uppercase;letter-spacing:0.03em;color:#fff;line-height:1;}
.rr4-drv-first{font-size:0.82rem;color:rgba(255,255,255,0.35);line-height:1.5;font-weight:500;}
.rr4-drv-num{font-family:'DM Mono',monospace;font-size:0.82rem;color:rgba(255,255,255,0.18);margin-left:auto;padding-left:0.5rem;}
.rr4-team-td{font-size:0.88rem;font-weight:600;color:rgba(255,255,255,0.35);white-space:nowrap;}
.rr4-t{font-family:'DM Mono',monospace;font-size:1rem;font-weight:500;text-align:right;white-space:nowrap;color:rgba(255,255,255,0.5);}
.rr4-t.win{color:#fff;font-size:1.05rem;}.rr4-t.gap{color:rgba(255,255,255,0.32);}.rr4-t.fl{color:#b44eff;}.rr4-t.p1t{color:#FFD700;}
.rr4-fl{display:inline-flex;align-items:center;gap:0.2rem;background:rgba(180,78,255,0.12);border:1px solid rgba(180,78,255,0.3);color:#b44eff;border-radius:2px;font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.1em;padding:0.15rem 0.4rem;margin-left:0.4rem;vertical-align:middle;}
.rr4-laps-td{font-family:'DM Mono',monospace;font-size:0.88rem;color:rgba(255,255,255,0.25);text-align:center;}
.rr4-pts-td{font-family:'Russo One',sans-serif;font-size:1.1rem;text-align:right;color:#fff;}
.rr4-pts-td.zero{color:rgba(255,255,255,0.12);font-family:'DM Mono',monospace;font-size:0.85rem;}
.rr4-qh.q1{color:rgba(255,255,255,0.25);}.rr4-qh.q2{color:rgba(255,200,0,0.5);}.rr4-qh.q3{color:rgba(255,120,0,0.6);}
.rr4-qtd{font-family:'DM Mono',monospace;font-size:0.95rem;font-weight:500;text-align:right;white-space:nowrap;color:rgba(255,255,255,0.45);}
.rr4-qtd.pole{color:#FFD700;font-size:1rem;}.rr4-qtd.q2best{color:#ffa500;}.rr4-qtd.elim{color:rgba(255,255,255,0.15);}.rr4-qtd.none{color:rgba(255,255,255,0.1);font-style:italic;font-size:0.78rem;}
.rr4-prac-note{display:flex;align-items:center;gap:0.6rem;background:rgba(80,180,255,0.06);border:1px solid rgba(80,180,255,0.15);border-radius:3px;padding:0.75rem 1rem;margin-bottom:1.25rem;font-size:0.83rem;color:rgba(255,255,255,0.35);line-height:1.5;}
.rr4-prac-note strong{color:rgba(80,180,255,0.8);}
.rr4-lap-filter{display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap;align-items:center;}
.rr4-filter-lbl{font-family:'Barlow Condensed',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-right:0.25rem;}
.rr4-fbtn{font-family:'Barlow Condensed',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:#111115;border:1px solid rgba(255,255,255,0.1);border-radius:2px;color:rgba(255,255,255,0.4);cursor:pointer;padding:0.45rem 0.85rem;transition:all 0.2s;}
.rr4-fbtn:hover{color:#fff;border-color:rgba(255,255,255,0.3);}
.rr4-fbtn.active{background:rgba(225,6,0,0.15);border-color:rgba(225,6,0,0.5);color:#ff7070;}
.rr4-lap-num-td{font-family:'DM Mono',monospace;font-size:0.85rem;color:rgba(255,255,255,0.2);text-align:center;width:60px;}
.rr4-lap-t-td{font-family:'DM Mono',monospace;font-size:1rem;font-weight:500;color:rgba(255,255,255,0.65);text-align:right;}
.rr4-lap-t-td.fastest{color:#b44eff;}
.rr4-bar-wrap{padding:0 0.9rem;min-width:80px;}
.rr4-bar-bg{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;}
.rr4-bar-fill{height:100%;border-radius:2px;}
.rr4-sec-td{font-family:'DM Mono',monospace;font-size:0.82rem;text-align:center;color:rgba(255,255,255,0.28);}
.rr4-pit-n-td{font-family:'Russo One',sans-serif;font-size:1rem;color:rgba(255,255,255,0.2);text-align:center;width:60px;}
.rr4-pit-dur{font-family:'DM Mono',monospace;font-size:1rem;font-weight:500;text-align:right;}
.rr4-pit-dur.fast{color:#00d4aa;}.rr4-pit-dur.slow{color:rgba(255,140,0,0.7);}.rr4-pit-dur.normal{color:rgba(255,255,255,0.5);}
.rr4-pit-lbl{font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.1em;margin-left:6px;}
.rr4-tyre-legend{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.75rem;align-items:center;}
.rr4-tyre-legend-item{display:flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);}
.rr4-strategy-grid{display:flex;flex-direction:column;gap:3px;}
.rr4-strat-row{display:grid;grid-template-columns:180px 1fr;gap:1rem;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.03);}
.rr4-strat-row:hover{background:rgba(255,255,255,0.015);border-radius:3px;}
.rr4-strat-driver{display:flex;align-items:center;gap:0.6rem;}
.rr4-strat-pos{font-family:'Russo One',sans-serif;font-size:1rem;color:rgba(255,255,255,0.2);width:24px;text-align:right;}
.rr4-strat-name{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rr4-strat-bar-area{position:relative;height:32px;}
.rr4-stint-block{position:absolute;top:4px;bottom:4px;border-radius:2px;cursor:default;transition:filter 0.15s,transform 0.15s;display:flex;align-items:center;justify-content:center;overflow:visible;}
.rr4-stint-block:hover{filter:brightness(1.3);transform:scaleY(1.15);z-index:10;}
.rr4-stint-label{font-family:'Russo One',sans-serif;font-size:0.6rem;font-weight:900;pointer-events:none;white-space:nowrap;overflow:hidden;}
.rr4-stint-tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#1a1a1f;border:1px solid rgba(255,255,255,0.12);border-radius:4px;padding:0.5rem 0.75rem;white-space:nowrap;z-index:100;pointer-events:none;font-family:'DM Mono',monospace;font-size:0.75rem;color:rgba(255,255,255,0.7);line-height:1.6;box-shadow:0 8px 24px rgba(0,0,0,0.6);}
.rr4-stint-tooltip strong{color:#fff;font-size:0.85rem;}
.rr4-compound-pill{display:inline-flex;align-items:center;gap:0.4rem;border-radius:20px;padding:0.2rem 0.6rem 0.2rem 0.4rem;font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;}
.rr4-strat-note{display:flex;align-items:center;gap:0.6rem;background:rgba(255,230,0,0.05);border:1px solid rgba(255,230,0,0.12);border-radius:3px;padding:0.75rem 1rem;margin-bottom:1.25rem;font-size:0.83rem;color:rgba(255,255,255,0.35);line-height:1.5;}
.rr4-strat-note strong{color:rgba(255,220,0,0.7);}
.rr4-strat-divider{margin:2rem 0 1.5rem;border:none;border-top:1px solid rgba(255,255,255,0.06);}
.rr4-tyre-strip{display:flex;gap:2px;align-items:center;height:14px;min-width:72px;}
.rr4-tyre-strip-seg{height:10px;border-radius:2px;min-width:6px;cursor:default;transition:filter 0.15s;}
.rr4-tyre-strip-seg:hover{filter:brightness(1.4);}
.rr4-loading-main{min-height:40vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;}
.rr4-load-track{width:220px;height:2px;background:rgba(255,255,255,0.07);overflow:hidden;border-radius:2px;}
.rr4-load-bar{height:100%;background:#e10600;animation:rr4-slide 1.4s ease-in-out infinite;border-radius:2px;}
.rr4-load-txt{font-family:'DM Mono',monospace;font-size:0.78rem;color:rgba(255,255,255,0.2);letter-spacing:0.2em;}
.rr4-tab-loading{display:flex;align-items:center;justify-content:center;gap:0.75rem;min-height:20vh;color:rgba(255,255,255,0.25);font-family:'DM Mono',monospace;font-size:0.82rem;letter-spacing:0.1em;}
.rr4-spin{animation:rr4-spin 1s linear infinite;}
@keyframes rr4-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.rr4-empty{text-align:center;padding:4rem 2rem;font-family:'Barlow Condensed',sans-serif;font-size:1.15rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.15);}
.rr4-warn{display:flex;align-items:flex-start;gap:0.75rem;background:rgba(255,140,0,0.07);border:1px solid rgba(255,140,0,0.2);border-radius:3px;padding:0.9rem 1.1rem;margin-bottom:1.5rem;font-size:0.88rem;color:rgba(255,255,255,0.4);line-height:1.6;}
.rr4-warn strong{color:rgba(255,200,0,0.8);display:block;margin-bottom:0.1rem;}

/* ── AVG lap time cell ── */
.rr4-avg-td{font-family:'DM Mono',monospace;font-size:0.9rem;font-weight:500;text-align:right;white-space:nowrap;color:rgba(255,255,255,0.38);}
.rr4-avg-td.best-avg{color:rgba(100,210,255,0.8);}
.rr4-avg-bar{display:flex;align-items:center;gap:0.75rem;background:rgba(80,180,255,0.05);border:1px solid rgba(80,180,255,0.12);border-radius:3px;padding:0.6rem 1rem;margin-bottom:1rem;font-family:'DM Mono',monospace;font-size:0.82rem;color:rgba(255,255,255,0.3);}
.rr4-avg-bar strong{color:rgba(100,210,255,0.75);font-size:0.88rem;}
.rr4-avg-label{font-family:'Barlow Condensed',sans-serif;font-size:0.75rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.18);}

/* ══════════════════════════════════════
   GRID VS FINISH
══════════════════════════════════════ */
.gvf-header-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-bottom:2rem; }
.gvf-stat-card { background:#111115;border:1px solid rgba(255,255,255,0.06);padding:1.25rem 1.5rem;animation:rr4-rise 0.4s ease both; }
.gvf-stat-label { font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.22);margin-bottom:0.4rem; }
.gvf-stat-val { font-family:'Russo One',sans-serif;font-size:1.8rem;line-height:1;margin-bottom:0.2rem; }
.gvf-stat-sub { font-family:'DM Mono',monospace;font-size:0.72rem;color:rgba(255,255,255,0.22); }
.gvf-delta-badge { display:inline-flex;align-items:center;gap:0.3rem;font-family:'Barlow Condensed',sans-serif;font-size:0.95rem;font-weight:900;letter-spacing:0.06em;padding:0.22rem 0.6rem;border-radius:3px;white-space:nowrap; }
.gvf-delta-badge.gain { background:rgba(0,200,120,0.12);border:1px solid rgba(0,200,120,0.3);color:#00d47a; }
.gvf-delta-badge.loss { background:rgba(255,60,60,0.10);border:1px solid rgba(255,60,60,0.28);color:#ff6060; }
.gvf-delta-badge.same { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.3); }
.gvf-note { display:flex;align-items:flex-start;gap:0.65rem;background:rgba(0,200,120,0.05);border:1px solid rgba(0,200,120,0.12);border-radius:3px;padding:0.75rem 1rem;margin-bottom:1.5rem;font-size:0.83rem;color:rgba(255,255,255,0.35);line-height:1.6; }
.gvf-note strong { color:rgba(0,200,120,0.7); }
.gvf-legend { display:flex;gap:1.25rem;flex-wrap:wrap;margin-bottom:1.5rem;align-items:center; }
.gvf-legend-item { display:flex;align-items:center;gap:0.45rem;font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.35); }
.gvf-row-dnf { opacity:0.55; }
.gvf-row-dnf:hover { opacity:0.80 !important; }

@keyframes rr4-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes rr4-slide{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
@media(max-width:680px){
  .rr4-podium{grid-template-columns:1fr;}
  .rr4-hero-name{font-size:2.8rem;}
  .rr4-tab{font-size:0.82rem;padding:0.6rem 0.5rem;letter-spacing:0.04em;}
  .rr4-strat-row{grid-template-columns:110px 1fr;gap:0.5rem;}
  .rr4-strat-name{font-size:0.85rem;}
  .gvf-header-cards{grid-template-columns:1fr;}
}
`;

/* ═══ CONSTANTS ═══ */
const TEAM_COLORS = {
  'Red Bull':'#3671C6','Ferrari':'#E8002D','Mercedes':'#27F4D2',
  'McLaren':'#FF8000','Aston Martin':'#229971','Alpine':'#FF87BC',
  'Williams':'#64C4FF','Racing Bulls':'#6692FF','Kick Sauber':'#52E252','Haas':'#B6BABD',
};
const teamColor = n => { for(const[k,v] of Object.entries(TEAM_COLORS)) if(n?.includes(k)) return v; return '#555'; };

const TYRE_COLORS = {
  SOFT:         { bg:'#E8002D', border:'#ff4466', text:'#fff', label:'S', name:'Soft' },
  MEDIUM:       { bg:'#FFF200', border:'#ffe000', text:'#111', label:'M', name:'Medium' },
  HARD:         { bg:'#EBEBEB', border:'#ccc',    text:'#111', label:'H', name:'Hard' },
  INTERMEDIATE: { bg:'#39B54A', border:'#2d9e3d', text:'#fff', label:'I', name:'Inter' },
  WET:          { bg:'#0067FF', border:'#0055dd', text:'#fff', label:'W', name:'Wet' },
  UNKNOWN:      { bg:'#333',    border:'#444',    text:'rgba(255,255,255,0.4)', label:'?', name:'Unknown' },
};
const tyreCol = c => TYRE_COLORS[c?.toUpperCase()] ?? TYRE_COLORS.UNKNOWN;

const OF1_SESSION = {
  fp1:'Practice 1', fp2:'Practice 2', fp3:'Practice 3',
  qual:'Qualifying', sprint_q:'Sprint Shootout', sprint:'Sprint', race:'Race',
};
const OF1_TABS = new Set(['race','fp1','fp2','fp3','qual','laps','pits','grid','sprint_laps','sprint_tyres','sprint_q_tyres']);

const OF1_BASE = 'https://api.openf1.org/v1';
const JOL_BASE = 'https://api.jolpi.ca/ergast/f1';
const of1Get = p => fetch(`${OF1_BASE}${p}`).then(r=>r.ok?r.json():[]).catch(()=>[]);
const jolGet = p => fetch(`${JOL_BASE}${p}`).then(r=>r.json()).catch(()=>({}));

/* ═══ UTILS ═══ */
const posClass = p => ({'1':'p1','2':'p2','3':'p3'}[p]??'');
const fmtDate  = d => d ? new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'}) : '';
const toMMSS   = s => { const m=Math.floor(s/60); return `${m}:${(s%60).toFixed(3).padStart(6,'0')}`; };

const computeAvgMap = (laps) => {
  const byDriver = {};
  laps.forEach(l => {
    if (!l.lap_duration || l.lap_duration <= 0) return;
    const k = String(l.driver_number);
    if (!byDriver[k]) byDriver[k] = [];
    byDriver[k].push(l.lap_duration);
  });
  const result = {};
  Object.entries(byDriver).forEach(([k, times]) => {
    if (!times.length) return;
    const fastest = Math.min(...times);
    const valid = times.filter(t => t <= fastest * 1.15);
    result[k] = valid.reduce((a, b) => a + b, 0) / valid.length;
  });
  return result;
};

/* ═══ API DISCLAIMER BANNER ═══ */
const ApiDisclaimer = () => (
  <div className="rr4-api-disclaimer">
    <Info size={13} className="rr4-api-disclaimer-icon"/>
    <div>
      <strong>Free API · ข้อมูลอาจไม่ใช่ Real-time</strong>
      {'  '}ข้อมูลนี้ดึงมาจาก OpenF1 และ Jolpica-Ergast ซึ่งเป็น API สาธารณะแบบไม่เสียค่าใช้จ่าย
      <span className="rr4-api-disclaimer-sep">·</span>
      อาจมีความล่าช้าหรือ fetch ไม่ได้บางครั้ง
      <span className="rr4-api-disclaimer-sep">·</span>
      หากข้อมูลไม่โหลด ให้ลองกดแท็บใหม่อีกครั้ง
    </div>
  </div>
);

/* ═══ SHARED UI ═══ */
const DrvCell = ({ last, first, num, color, h=40 }) => (
  <div className="rr4-drv">
    <div className="rr4-bar" style={{background:color,height:h}}/>
    <div>
      <div className="rr4-drv-last">{last}</div>
      {first && <div className="rr4-drv-first">{first}</div>}
    </div>
    {num && <span className="rr4-drv-num">#{num}</span>}
  </div>
);

const TabSpinner = ({ label='กำลังโหลด...' }) => (
  <div className="rr4-tab-loading"><Loader size={16} className="rr4-spin"/><span>{label}</span></div>
);

const TyreBadge = ({ compound, size='md' }) => {
  const t = tyreCol(compound);
  const sz = size==='sm' ? {width:18,height:18,fontSize:'0.58rem'} : {width:26,height:26,fontSize:'0.72rem'};
  return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',background:t.bg,color:t.text,borderRadius:'50%',fontFamily:"'Russo One',sans-serif",fontWeight:900,flexShrink:0,border:`2px solid ${t.border}`,boxShadow:`0 0 6px ${t.bg}55`,...sz}}>
      {t.label}
    </span>
  );
};

const CompoundPill = ({ compound, laps }) => {
  const t = tyreCol(compound);
  const txtColor = t.bg==='#EBEBEB'?'#ccc':t.bg==='#FFF200'?'#ccb800':t.bg;
  return (
    <span className="rr4-compound-pill" style={{background:`${t.bg}22`,border:`1px solid ${t.bg}55`,color:txtColor}}>
      <TyreBadge compound={compound} size="sm"/>
      {t.name}{laps!=null?` · ${laps}L`:''}
    </span>
  );
};

/* ═══ INLINE TYRE BAR ═══ */
const InlineTyreBar = ({ stintMap, driverKey, totalLaps, hovered, setHovered, minWidth='90px' }) => {
  const ds = stintMap[String(driverKey)] ?? [];
  if (!ds.length)
    return <span style={{color:'rgba(255,255,255,0.1)',fontSize:'0.7rem'}}>—</span>;

  return (
    <div style={{display:'flex',gap:'2px',alignItems:'center',height:'20px',minWidth}}>
      {ds.map((stint, si) => {
        const t     = tyreCol(stint.compound);
        const start = (stint.lap_start ?? 1) - 1;
        const end   = stint.lap_end ?? totalLaps;
        const pct   = Math.max(((end - start) / totalLaps) * 100, 5);
        const age   = stint.tyre_age_at_start ?? 0;
        const name  = TYRE_COLORS[stint.compound?.toUpperCase()]?.name ?? stint.compound ?? '?';
        const isHov = hovered?.key === String(driverKey) && hovered?.si === si;
        return (
          <div
            key={si}
            style={{position:'relative',flex:`${pct} 0 0`}}
            onMouseEnter={() => setHovered({key:String(driverKey), si})}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{
              height:'14px', borderRadius:'3px', background:t.bg, border:`1px solid ${t.border}`,
              cursor:'default', transition:'filter 0.15s', filter:isHov?'brightness(1.4)':'none',
              display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
            }}>
              {pct > 10 && (
                <span style={{fontFamily:"'Russo One',sans-serif",fontSize:'0.52rem',color:t.text,pointerEvents:'none'}}>
                  {t.label}
                </span>
              )}
            </div>
            {isHov && (
              <div style={{
                position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
                background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'4px',
                padding:'0.4rem 0.65rem', whiteSpace:'nowrap', zIndex:200, pointerEvents:'none',
                fontFamily:"'DM Mono',monospace", fontSize:'0.72rem', color:'rgba(255,255,255,0.7)',
                lineHeight:1.6, boxShadow:'0 6px 20px rgba(0,0,0,0.7)',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.2rem'}}>
                  <TyreBadge compound={stint.compound} size="sm"/>
                  <strong style={{color:'#fff',fontSize:'0.8rem'}}>{name}</strong>
                </div>
                <div>Stint {si+1} · L{stint.lap_start}–{end} ({end-start} รอบ)</div>
                <div style={{color:age===0?'rgba(100,220,100,0.8)':'rgba(255,200,0,0.7)'}}>
                  {age===0?'ยางใหม่':`ยางเก่า ${age} รอบ`}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══ TYRE STRIP ═══ */
const TyreStrip = ({ stints, totalLaps }) => {
  const [hov, setHov] = useState(null);
  if (!stints?.length) return <span style={{color:'rgba(255,255,255,0.1)',fontSize:'0.7rem'}}>—</span>;
  const total = totalLaps || Math.max(...stints.map(s=>s.lap_end??0), 1);
  return (
    <div className="rr4-tyre-strip" style={{position:'relative'}}>
      {stints.map((s,i) => {
        const t     = tyreCol(s.compound);
        const start = (s.lap_start??1)-1;
        const end   = s.lap_end??total;
        const pct   = Math.max(((end-start)/total)*100, 3);
        const age   = s.tyre_age_at_start??0;
        const name  = TYRE_COLORS[s.compound?.toUpperCase()]?.name ?? s.compound ?? '?';
        return (
          <div key={i} style={{position:'relative', flex:`${pct} 0 0`}}>
            <div
              className="rr4-tyre-strip-seg"
              style={{width:'100%', background:t.bg, border:`1px solid ${t.border}`}}
              onMouseEnter={()=>setHov(i)}
              onMouseLeave={()=>setHov(null)}
            />
            {hov===i && (
              <div style={{
                position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',
                background:'#1a1a1f',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'4px',
                padding:'0.4rem 0.65rem',whiteSpace:'nowrap',zIndex:200,pointerEvents:'none',
                fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.7)',
                lineHeight:1.6,boxShadow:'0 6px 20px rgba(0,0,0,0.7)',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.2rem'}}>
                  <TyreBadge compound={s.compound} size="sm"/>
                  <strong style={{color:'#fff',fontSize:'0.8rem'}}>{name}</strong>
                </div>
                <div>L{s.lap_start}–{end} · {end-start} รอบ</div>
                <div style={{color:age===0?'rgba(100,220,100,0.8)':'rgba(255,200,0,0.7)'}}>
                  {age===0?'ยางใหม่':`ยางเก่า ${age} รอบ`}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══ TYRE TIMELINE ═══ */
const TyreTimeline = ({ stints, drivers, sortKeys=null, sessionLabel='Race', showDetailTable=true }) => {
  const [hovered, setHovered] = useState(null);
  if(!stints.length) return <div className="rr4-empty">ไม่พบข้อมูล Tyre Stints สำหรับ {sessionLabel}</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const byDriver={};
  stints.forEach(s=>{const k=String(s.driver_number);if(!byDriver[k])byDriver[k]=[];byDriver[k].push(s);});
  const totalLaps=Math.max(...stints.map(s=>s.lap_end??0),1);
  const compounds=[...new Set(stints.map(s=>s.compound?.toUpperCase()).filter(Boolean))];
  const driverNums=Object.keys(byDriver).sort((a,b)=>{
    if(sortKeys){const pa=sortKeys[a]??99,pb=sortKeys[b]??99;return pa-pb;}
    return Number(a)-Number(b);
  });
  return (
    <>
      <div className="rr4-tyre-legend">
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.2)'}}>ยาง:</span>
        {['SOFT','MEDIUM','HARD','INTERMEDIATE','WET'].filter(c=>compounds.includes(c)).map(c=>(
          <div key={c} className="rr4-tyre-legend-item"><TyreBadge compound={c}/><span>{TYRE_COLORS[c].name}</span></div>
        ))}
        <div style={{marginLeft:'auto',fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.15)'}}>← Lap 1 · · · Lap {totalLaps} →</div>
      </div>
      <div className="rr4-strat-note">
        <span>🏎</span>
        <div><strong>Tyre Strategy — {sessionLabel}</strong>hover แต่ละ stint เพื่อดูรายละเอียด</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:'1rem',marginBottom:'0.35rem'}}>
        <div/>
        <div style={{position:'relative',height:'16px'}}>
          {[0,25,50,75,100].map(pct=>{
            const lap=Math.round(pct/100*totalLaps);
            if(lap>totalLaps) return null;
            return <span key={pct} style={{position:'absolute',left:`${(lap/totalLaps)*100}%`,fontFamily:"'DM Mono',monospace",fontSize:'0.65rem',color:'rgba(255,255,255,0.15)',transform:'translateX(-50%)'}}>{lap||''}</span>;
          })}
        </div>
      </div>
      <div className="rr4-strategy-grid">
        {driverNums.map((num,ri)=>{
          const ds=byDriver[num]??[];
          const d=dMap[num];
          const dColor=d?.team_colour?`#${d.team_colour}`:'#555';
          const name=d?.name_acronym??d?.last_name??`#${num}`;
          const pos=sortKeys?.[num];
          return (
            <div key={num} className="rr4-strat-row" style={{animationDelay:`${ri*0.025}s`}}>
              <div className="rr4-strat-driver">
                {pos&&<span className="rr4-strat-pos">{pos<=20?pos:'—'}</span>}
                <div className="rr4-bar" style={{background:dColor,height:28}}/>
                <span className="rr4-strat-name">{name}</span>
              </div>
              <div className="rr4-strat-bar-area">
                {ds.map((stint,si)=>{
                  const s0=(stint.lap_start??1)-1,end=stint.lap_end??totalLaps,laps=end-s0;
                  const left=(s0/totalLaps)*100,wid=(laps/totalLaps)*100;
                  const t=tyreCol(stint.compound),age=stint.tyre_age_at_start??0;
                  const isHov=hovered?.driverNum===num&&hovered?.stintIdx===si;
                  return (
                    <div key={si} className="rr4-stint-block"
                      style={{left:`${left}%`,width:`calc(${wid}% - 2px)`,marginLeft:'1px',background:t.bg,opacity:0.88,border:`1px solid ${t.border}`}}
                      onMouseEnter={()=>setHovered({driverNum:num,stintIdx:si})}
                      onMouseLeave={()=>setHovered(null)}
                    >
                      {wid>6&&<span className="rr4-stint-label" style={{color:t.text,fontSize:wid>12?'0.62rem':'0.52rem'}}>{t.label}{age>0?` (${age})`:''}</span>}
                      {isHov&&(
                        <div className="rr4-stint-tooltip">
                          <div style={{marginBottom:'0.35rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            <TyreBadge compound={stint.compound} size="sm"/>
                            <strong>{TYRE_COLORS[stint.compound?.toUpperCase()]?.name??stint.compound??'?'}</strong>
                          </div>
                          <div>Stint {si+1} · รอบ {stint.lap_start}–{end} ({laps} รอบ)</div>
                          {age>0?<div style={{color:'rgba(255,200,0,0.7)'}}>ยางเก่า {age} รอบก่อน stint นี้</div>:<div style={{color:'rgba(100,220,100,0.7)'}}>ยางใหม่ (New)</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {showDetailTable&&(
        <div style={{marginTop:'2.5rem'}}>
          <div className="rr4-sec-hd">
            <span className="rr4-sec-title">รายละเอียด Stint — {sessionLabel}</span>
            <div className="rr4-sec-line"/>
            <span className="rr4-sec-badge">{stints.length} stints</span>
          </div>
          <div className="rr4-tbl-wrap">
            <table className="rr4-tbl">
              <thead><tr><th>นักแข่ง</th><th className="c">Stint</th><th className="c">ยาง</th><th className="c">อายุยางเริ่มต้น</th><th className="c">รอบเริ่ม</th><th className="c">รอบจบ</th><th className="c">รอบใน stint</th></tr></thead>
              <tbody>
                {driverNums.flatMap(num=>{
                  const ds=byDriver[num]??[],d=dMap[num];
                  return ds.map((stint,si)=>{
                    const lapsIn=(stint.lap_end??totalLaps)-(stint.lap_start??1)+1;
                    const age=stint.tyre_age_at_start??0;
                    return (
                      <tr key={`${num}-${si}`} style={{animationDelay:`${(driverNums.indexOf(num)*3+si)*0.015}s`}}>
                        <td><div className="rr4-drv"><div className="rr4-bar" style={{background:dMap[num]?.team_colour?`#${dMap[num].team_colour}`:'#555',height:28}}/><div className="rr4-drv-last" style={{fontSize:'0.95rem'}}>{d?.name_acronym??`#${num}`}</div></div></td>
                        <td className="rr4-laps-td">{si+1}</td>
                        <td style={{textAlign:'center'}}><CompoundPill compound={stint.compound}/></td>
                        <td style={{textAlign:'center',fontFamily:"'DM Mono',monospace",fontSize:'0.88rem'}}>
                          {age===0?<span style={{color:'rgba(100,220,100,0.7)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:'0.82rem',letterSpacing:'0.08em'}}>NEW</span>:<span style={{color:'rgba(255,200,0,0.6)'}}>{age} รอบ</span>}
                        </td>
                        <td className="rr4-laps-td">{stint.lap_start??'—'}</td>
                        <td className="rr4-laps-td">{stint.lap_end??'—'}</td>
                        <td className="rr4-laps-td">{lapsIn} รอบ</td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══ PODIUM ═══ */
const Podium = ({ results }) => {
  const labels=['🥇 P1','🥈 P2','🥉 P3'],cls=['p1','p2','p3'];
  return (
    <div className="rr4-podium">
      {results.slice(0,3).map((r,i)=>{
        const gap=i===0?(r.Time?.time??r.status):(r.Time?.time?`+${r.Time.time}`:r.status);
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

/* ═══ STATUS ═══ */
const classifyStatus = s => {
  const l=s?.toLowerCase()??'';
  if(s==='Finished') return 'finished';
  if(/^\+\d+\s*lap/i.test(s)) return 'lap';
  if(l.includes('did not start')||l==='dns'||l==='withdrew') return 'dns';
  if(l.includes('disqualified')||l==='dsq') return 'dsq';
  return 'ret';
};
const statusLabel = s => {
  const l=s?.toLowerCase()??'';
  if(l.includes('did not start')||l==='dns') return 'DNS';
  if(/^\+\d+ lap/i.test(s)) return s;
  if(l.includes('disqualified')||l==='dsq') return 'DSQ';
  return s?.length>14?'Retired':s;
};
const StatusBadge = ({ status }) => {
  const t=classifyStatus(status);
  if(t==='finished') return null;
  return <span className={`rr4-status-badge ${t}`}>{statusLabel(status)}</span>;
};

/* ═══ RACE TABLE ═══ */
const RaceTable = ({ results, showPts=true, stints=[] }) => {
  const [hovered, setHovered] = useState(null);
  if(!results.length) return <div className="rr4-empty">ยังไม่มีผลการแข่งขัน</div>;
  const sorted=[...results].sort((a,b)=>parseInt(a.position)-parseInt(b.position));
  const stintMap={};
  stints.forEach(s=>{const k=String(s.driver_number);if(!stintMap[k])stintMap[k]=[];stintMap[k].push(s);});
  Object.values(stintMap).forEach(arr=>arr.sort((a,b)=>(a.lap_start??0)-(b.lap_start??0)));
  const totalLaps=Math.max(...sorted.map(r=>parseInt(r.laps)||0),1);
  const hasStints=stints.length>0;
  return (
    <>
      <Podium results={sorted}/>
      <div className="rr4-tbl-wrap" style={{marginTop:'2px'}}>
        <table className="rr4-tbl">
          <thead><tr>
            <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
            {hasStints&&<th>ยาง</th>}
            <th className="r">เวลา / ห่าง</th><th className="r">Fastest Lap</th>
            <th className="c">รอบ</th>{showPts&&<th className="r">คะแนน</th>}
          </tr></thead>
          <tbody>
            {sorted.map((r,i)=>{
              const pos=r.position,status=r.status??'',type=classifyStatus(status);
              const finished=type==='finished',isLapped=type==='lap',isDns=type==='dns';
              const isFl=r.FastestLap?.rank==='1';
              const timeCell=finished?(pos==='1'?(r.Time?.time??'—'):(r.Time?.time?`+${r.Time.time}`:'—')):null;
              const rowCls=isDns?'row-dns':(!finished&&!isLapped)?'row-dnf':'';
              return (
                <tr key={i} className={rowCls} style={{animationDelay:`${i*0.025}s`}}>
                  <td className={`rr4-pos ${posClass(pos)}`}>{pos}</td>
                  <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
                  <td className="rr4-team-td">{r.Constructor?.name}</td>
                  {hasStints&&(
                    <td style={{minWidth:'110px',paddingTop:'0.85rem',paddingBottom:'0.85rem'}}>
                      <InlineTyreBar stintMap={stintMap} driverKey={r.number} totalLaps={totalLaps} hovered={hovered} setHovered={setHovered} minWidth="110px"/>
                    </td>
                  )}
                  <td className={`rr4-t ${pos==='1'?'win':'gap'}`} style={{textAlign:'right'}}>{finished?timeCell:<StatusBadge status={status}/>}</td>
                  <td className={`rr4-t ${isFl?'fl':''}`}>{r.FastestLap?.Time?.time??'—'}{isFl&&<span className="rr4-fl"><Zap size={9}/> FL</span>}</td>
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

/* ═══ QUAL TABLE ═══ */
const QualTable = ({ results, allDrivers=[], label='Qualifying', stints=[] }) => {
  const [hovered, setHovered] = useState(null);
  if(!results.length) return <div className="rr4-empty">ยังไม่มีข้อมูล {label}</div>;
  const stintMap={};
  stints.forEach(s=>{const k=String(s.driver_number);if(!stintMap[k])stintMap[k]=[];stintMap[k].push(s);});
  Object.values(stintMap).forEach(arr=>arr.sort((a,b)=>(a.lap_start??0)-(b.lap_start??0)));
  const hasStints=stints.length>0;
  const totalLaps=hasStints?Math.max(...stints.map(s=>s.lap_end??0),1):1;
  const hasQ2=results.some(r=>r.Q2),hasQ3=results.some(r=>r.Q3);
  const fastest=key=>results.reduce((b,r)=>(!r[key]?b:(!b||r[key]<b)?r[key]:b),null);
  const fQ1=fastest('Q1'),fQ2=fastest('Q2'),fQ3=fastest('Q3');
  const sorted=[...results].sort((a,b)=>parseInt(a.position)-parseInt(b.position));
  const qualIds=new Set(sorted.map(r=>r.Driver?.driverId));
  const missing=allDrivers.filter(r=>r.Driver?.driverId&&!qualIds.has(r.Driver.driverId)).map(r=>({Driver:r.Driver,Constructor:r.Constructor,number:r.number,position:'—',Q1:null,Q2:null,Q3:null}));
  const q3c=hasQ3?10:null,q2c=hasQ2?15:null;
  const colSpan=3+(hasStints?1:0)+1+(hasQ2?1:0)+(hasQ3?1:0);
  const QCell=({val,best,elim,isPole})=>!val?<td className="rr4-qtd none">—</td>:<td className={`rr4-qtd ${val===best&&isPole?'pole':val===best?'q2best':elim?'elim':''}`}>{val}{val===best&&isPole?' ★':''}</td>;
  const ZoneRow=({label:zl,color})=>(<tr><td colSpan={colSpan} style={{padding:'0.3rem 0.9rem',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.68rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color,borderTop:`1px solid ${color}44`,borderBottom:`1px solid rgba(255,255,255,0.04)`,background:`${color}08`}}>── {zl}</td></tr>);
  const rows=[];
  sorted.forEach((r,i)=>{
    const pos=parseInt(r.position);
    if(hasQ3&&pos===q3c+1) rows.push(<ZoneRow key="d2" label="ตกรอบ Q3 · 11–15" color="#ffa500"/>);
    if(hasQ2&&pos===q2c+1) rows.push(<ZoneRow key="d1" label="ตกรอบ Q2 · 16+" color="rgba(255,255,255,0.3)"/>);
    const eQ2=hasQ3&&pos>(q3c??99),eQ1=hasQ2&&pos>(q2c??99);
    rows.push(
      <tr key={r.Driver?.driverId} className={eQ1?'q-elim-q1':eQ2?'q-elim-q2':''} style={{animationDelay:`${i*0.025}s`}}>
        <td className={`rr4-pos ${pos<=3?`p${pos}`:''}`} style={pos>3?{fontSize:'1.1rem',color:'rgba(255,255,255,0.3)'}:{}}>{pos}</td>
        <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
        <td className="rr4-team-td">{r.Constructor?.name}</td>
        {hasStints&&(<td style={{minWidth:'100px',paddingTop:'0.85rem',paddingBottom:'0.85rem'}}><InlineTyreBar stintMap={stintMap} driverKey={r.number} totalLaps={totalLaps} hovered={hovered} setHovered={setHovered}/></td>)}
        <QCell val={r.Q1} best={fQ1} elim={false} isPole={false}/>
        {hasQ2&&<QCell val={r.Q2} best={fQ2} elim={eQ1} isPole={false}/>}
        {hasQ3&&<QCell val={r.Q3} best={fQ3} elim={eQ2} isPole={true}/>}
      </tr>
    );
  });
  if(missing.length>0){
    rows.push(<ZoneRow key="dns" label={`ไม่มีเวลา · ${missing.length} คน`} color="rgba(120,120,120,0.5)"/>);
    missing.forEach((r,i)=>rows.push(
      <tr key={`m-${r.Driver?.driverId}`} className="row-dns" style={{animationDelay:`${(sorted.length+i)*0.025}s`}}>
        <td className="rr4-pos" style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.15)',fontFamily:"'DM Mono',monospace"}}>—</td>
        <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={teamColor(r.Constructor?.name)}/></td>
        <td className="rr4-team-td">{r.Constructor?.name}</td>
        {hasStints&&<td/>}
        <td className="rr4-qtd none">—</td>
        {hasQ2&&<td className="rr4-qtd none">—</td>}
        {hasQ3&&<td className="rr4-qtd none">—</td>}
      </tr>
    ));
  }
  return (
    <div className="rr4-tbl-wrap">
      <table className="rr4-tbl">
        <thead><tr>
          <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
          {hasStints&&<th>ยาง</th>}
          <th className="r rr4-qh q1">Q1</th>
          {hasQ2&&<th className="r rr4-qh q2">Q2</th>}
          {hasQ3&&<th className="r rr4-qh q3">Q3/Pole</th>}
        </tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

/* ═══ PRACTICE TABLE ═══ */
const PracticeTable = ({ laps, stints, drivers, sessionName }) => {
  const [hovered, setHovered] = useState(null);
  if(!laps.length) return <div className="rr4-empty">ไม่พบข้อมูล {sessionName} จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const best={};
  laps.forEach(l=>{if(!l.lap_duration||l.lap_duration<=0) return; if(!best[l.driver_number]||l.lap_duration<best[l.driver_number].lap_duration) best[l.driver_number]=l;});
  const sorted=Object.values(best).sort((a,b)=>a.lap_duration-b.lap_duration);
  if(!sorted.length) return <div className="rr4-empty">ไม่มีข้อมูล Lap Time ใน {sessionName}</div>;
  const ref=sorted[0].lap_duration;
  const stintMap={};
  stints.forEach(s=>{const k=String(s.driver_number);if(!stintMap[k])stintMap[k]=[];stintMap[k].push(s);});
  Object.values(stintMap).forEach(arr=>arr.sort((a,b)=>(a.lap_start??0)-(b.lap_start??0)));
  const totalLaps=Math.max(...stints.map(s=>s.lap_end??0),1);
  const hasStints=stints.length>0;
  const fmtS=v=>v!=null?v.toFixed(3):'—';
  return (
    <div className="rr4-tbl-wrap">
      <table className="rr4-tbl">
        <thead><tr>
          <th className="c">P</th><th>นักแข่ง</th><th>ทีม</th>
          {hasStints&&<th>ยาง</th>}
          <th className="r">Best Lap</th><th className="r">ห่าง P1</th>
          <th className="c">รอบที่</th><th className="c">S1</th><th className="c">S2</th><th className="c">S3</th>
        </tr></thead>
        <tbody>
          {sorted.map((lap,i)=>{
            const d=dMap[lap.driver_number];
            const color=d?.team_colour?`#${d.team_colour}`:'#555';
            return (
              <tr key={i} style={{animationDelay:`${i*0.025}s`}}>
                <td className={`rr4-pos ${i===0?'p1':i===1?'p2':i===2?'p3':''}`}>{i+1}</td>
                <td><DrvCell last={d?.last_name??d?.full_name?.split(' ').pop()??`#${lap.driver_number}`} first={d?.first_name??''} num={lap.driver_number} color={color}/></td>
                <td className="rr4-team-td">{d?.team_name??'—'}</td>
                {hasStints&&(<td style={{minWidth:'110px',paddingTop:'0.85rem',paddingBottom:'0.85rem'}}><InlineTyreBar stintMap={stintMap} driverKey={lap.driver_number} totalLaps={totalLaps} hovered={hovered} setHovered={setHovered} minWidth="110px"/></td>)}
                <td className={`rr4-t ${i===0?'p1t':''}`}>{toMMSS(lap.lap_duration)}{i===0&&<span className="rr4-fl"><Zap size={9}/> P1</span>}</td>
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
  );
};

/* ═══ LAP TABLE ═══ */
const LapTable = ({ laps, drivers }) => {
  const [sel,setSel]=useState('ALL');
  if(!laps.length) return <div className="rr4-empty">ไม่พบข้อมูล Lap Times จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const avgMap = computeAvgMap(laps);
  const avgVals = Object.values(avgMap).filter(Boolean);
  const bestAvg = avgVals.length ? Math.min(...avgVals) : null;
  const filtered=sel==='ALL'?laps:laps.filter(l=>String(l.driver_number)===sel);
  const durs=laps.map(l=>l.lap_duration).filter(v=>v&&v>0);
  const gMin=Math.min(...durs),gMax=Math.max(...durs.filter(v=>v<gMin*1.15));
  const range=gMax-gMin||1;
  const uniq=[...new Set(laps.map(l=>String(l.driver_number)))].sort((a,b)=>+a-+b);
  const fmtS=v=>v!=null?v.toFixed(3):'—';
  const selAvg = sel !== 'ALL' ? avgMap[sel] : null;
  const driverSummaries = uniq.map(num => {
    const driverLaps = laps.filter(l => String(l.driver_number) === num && l.lap_duration > 0);
    const fastest = driverLaps.length ? Math.min(...driverLaps.map(l => l.lap_duration)) : null;
    return { num, fastest, avg: avgMap[num] ?? null, count: driverLaps.length };
  }).sort((a, b) => (a.fastest ?? 999) - (b.fastest ?? 999));
  return (
    <>
      <div className="rr4-lap-filter">
        <span className="rr4-filter-lbl">นักแข่ง :</span>
        <button className={`rr4-fbtn ${sel==='ALL'?'active':''}`} onClick={()=>setSel('ALL')}>ทั้งหมด</button>
        {uniq.map(num=>{
          const d=dMap[num],c=d?.team_colour?`#${d.team_colour}`:undefined;
          return <button key={num} className={`rr4-fbtn ${sel===num?'active':''}`} onClick={()=>setSel(num)} style={sel===num&&c?{borderColor:c,color:c}:{}}>{d?.name_acronym??`#${num}`}</button>;
        })}
      </div>
      {sel !== 'ALL' && selAvg != null && (
        <div className="rr4-avg-bar">
          <span style={{fontSize:'1rem'}}>⏱</span>
          <span className="rr4-avg-label">เฉลี่ย (AVG)</span>
          <strong>{toMMSS(selAvg)}</strong>
          <span style={{color:'rgba(255,255,255,0.15)',fontSize:'0.68rem'}}>· คำนวณจากรอบปกติ (ตัดรอบ Pit / SC ออก)</span>
        </div>
      )}
      {sel === 'ALL' && driverSummaries.length > 0 && (
        <div style={{marginBottom:'1.75rem'}}>
          <div className="rr4-sec-hd" style={{marginBottom:'0.75rem'}}>
            <span className="rr4-sec-title">สรุปเฉลี่ย Lap Time ต่อนักแข่ง</span>
            <div className="rr4-sec-line"/>
            <span className="rr4-sec-badge">AVG</span>
          </div>
          <div className="rr4-tbl-wrap">
            <table className="rr4-tbl" style={{minWidth:'360px'}}>
              <thead><tr>
                <th className="c">P</th><th>นักแข่ง</th><th className="r">Fastest Lap</th><th className="r">AVG Lap</th><th className="c">รอบที่ใช้คำนวณ</th>
              </tr></thead>
              <tbody>
                {driverSummaries.map((ds, i) => {
                  const d = dMap[ds.num];
                  const color = d?.team_colour ? `#${d.team_colour}` : '#555';
                  const isBestAvg = ds.avg != null && bestAvg != null && Math.abs(ds.avg - bestAvg) < 0.001;
                  return (
                    <tr key={ds.num} style={{animationDelay:`${i*0.02}s`}}>
                      <td className={`rr4-pos ${i===0?'p1':i===1?'p2':i===2?'p3':''}`}>{i+1}</td>
                      <td><DrvCell last={d?.last_name ?? d?.full_name?.split(' ').pop() ?? `#${ds.num}`} first={d?.first_name ?? ''} num={ds.num} color={color}/></td>
                      <td className={`rr4-t ${i===0?'p1t':''}`}>{ds.fastest ? toMMSS(ds.fastest) : '—'}{i===0 && <span className="rr4-fl"><Zap size={9}/> FL</span>}</td>
                      <td className={`rr4-avg-td ${isBestAvg ? 'best-avg' : ''}`}>{ds.avg ? toMMSS(ds.avg) : '—'}{isBestAvg && <span style={{marginLeft:'0.35rem',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.68rem',fontWeight:800,letterSpacing:'0.08em',color:'rgba(100,210,255,0.7)'}}>BEST AVG</span>}</td>
                      <td className="rr4-laps-td">{ds.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:'0.5rem',fontFamily:"'DM Mono',monospace",fontSize:'0.68rem',color:'rgba(255,255,255,0.15)',paddingLeft:'0.2rem'}}>
            * AVG คำนวณจากรอบปกติเท่านั้น (ตัดรอบที่ช้ากว่า fastest +15% ออก เพื่อลด Pit / Safety Car)
          </div>
        </div>
      )}
      <div className="rr4-tbl-wrap">
        <table className="rr4-tbl">
          <thead><tr>
            <th className="c">Lap</th>
            {sel==='ALL'&&<th>นักแข่ง</th>}
            <th className="r">เวลา (วิ)</th><th>กราฟ</th>
            <th className="c">S1</th><th className="c">S2</th><th className="c">S3</th>
          </tr></thead>
          <tbody>
            {filtered.slice(0,100).map((lap,i)=>{
              const dur=lap.lap_duration,isFastest=dur===gMin;
              const barW=dur?Math.max(4,(1-(dur-gMin)/range)*100):0;
              const d=dMap[lap.driver_number],color=d?.team_colour?`#${d.team_colour}`:'#555';
              return (
                <tr key={i} style={{animationDelay:`${Math.min(i,30)*0.015}s`}}>
                  <td className="rr4-lap-num-td">{lap.lap_number}</td>
                  {sel==='ALL'&&<td><div className="rr4-drv"><div className="rr4-bar" style={{background:color,height:28}}/><div className="rr4-drv-last" style={{fontSize:'0.95rem'}}>{d?.name_acronym??`#${lap.driver_number}`}</div></div></td>}
                  <td className={`rr4-lap-t-td ${isFastest?'fastest':''}`}>{dur!=null?dur.toFixed(3):'—'}{isFastest&&<span className="rr4-fl"><Zap size={9}/> FL</span>}</td>
                  <td className="rr4-bar-wrap"><div className="rr4-bar-bg"><div className="rr4-bar-fill" style={{width:`${barW}%`,background:isFastest?'#b44eff':'#e10600'}}/></div></td>
                  <td className="rr4-sec-td">{lap.duration_sector_1!=null?lap.duration_sector_1.toFixed(3):'—'}</td>
                  <td className="rr4-sec-td">{lap.duration_sector_2!=null?lap.duration_sector_2.toFixed(3):'—'}</td>
                  <td className="rr4-sec-td">{lap.duration_sector_3!=null?lap.duration_sector_3.toFixed(3):'—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length>100&&<div style={{textAlign:'center',padding:'0.85rem',fontSize:'0.75rem',color:'rgba(255,255,255,0.18)',fontFamily:'DM Mono'}}>แสดง 100 / {filtered.length} รอบ</div>}
      </div>
    </>
  );
};

/* ═══ PIT TABLE ═══ */
const PitTable = ({ pits, drivers, stints=[] }) => {
  const [hovered, setHovered] = useState(null);
  if(!pits.length) return <div className="rr4-empty">ไม่พบข้อมูล Pit Stops จาก OpenF1</div>;
  const dMap={};
  drivers.forEach(d=>{dMap[d.driver_number]=d;});
  const stintMap={};
  stints.forEach(s=>{const k=String(s.driver_number);if(!stintMap[k])stintMap[k]=[];stintMap[k].push(s);});
  Object.values(stintMap).forEach(arr=>arr.sort((a,b)=>(a.lap_start??0)-(b.lap_start??0)));
  const totalLaps=Math.max(...stints.map(s=>s.lap_end??0),1);
  const times=pits.map(p=>p.pit_duration).filter(Boolean);
  const minP=Math.min(...times),maxP=Math.max(...times);
  const pitCls=d=>!d?'normal':d<=minP*1.06?'fast':d>=maxP*0.9?'slow':'normal';
  const pitsByDriver={};
  pits.forEach(p=>{const k=String(p.driver_number);if(!pitsByDriver[k])pitsByDriver[k]=[];pitsByDriver[k].push(p);});
  const driverOrder=[...new Set(pits.map(p=>String(p.driver_number)))].sort((a,b)=>(pitsByDriver[a][0]?.lap_number??0)-(pitsByDriver[b][0]?.lap_number??0));
  return (
    <div className="rr4-tbl-wrap">
      <table className="rr4-tbl">
        <thead><tr>
          <th>นักแข่ง</th><th>Strategy + Pit</th><th className="r">Stops</th><th className="r">เร็วสุด (วิ)</th>
        </tr></thead>
        <tbody>
          {driverOrder.map((num,ri)=>{
            const d=dMap[num];
            const color=d?.team_colour?`#${d.team_colour}`:'#555';
            const driverPits=pitsByDriver[num]??[];
            const ds=stintMap[num]??[];
            const fastestPit=driverPits.reduce((b,p)=>(!b||p.pit_duration<b.pit_duration)?p:b,null);
            return (
              <tr key={num} style={{animationDelay:`${ri*0.025}s`}}>
                <td style={{minWidth:'130px'}}><DrvCell last={d?.last_name??d?.full_name?.split(' ').pop()??`#${num}`} first={d?.first_name??d?.team_name??''} color={color} h={32}/></td>
                <td style={{minWidth:'200px',paddingTop:'0.75rem',paddingBottom:'0.75rem'}}>
                  <div style={{position:'relative',height:'28px'}}>
                    {ds.map((stint,si)=>{
                      const t=tyreCol(stint.compound);
                      const start=(stint.lap_start??1)-1,end=stint.lap_end??totalLaps;
                      const pct=Math.max(((end-start)/totalLaps)*100,3),left=(start/totalLaps)*100;
                      const age=stint.tyre_age_at_start??0;
                      const isHov=hovered?.num===num&&hovered?.si===si;
                      return (
                        <div key={si}
                          style={{position:'absolute',top:'4px',bottom:'4px',left:`${left}%`,width:`calc(${pct}% - 2px)`,background:t.bg,border:`1px solid ${t.border}`,borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'default',filter:isHov?'brightness(1.35)':'none',transition:'filter 0.15s',zIndex:1}}
                          onMouseEnter={()=>setHovered({num,si})}
                          onMouseLeave={()=>setHovered(null)}
                        >
                          {pct>7&&<span style={{fontFamily:"'Russo One',sans-serif",fontSize:'0.52rem',color:t.text,pointerEvents:'none'}}>{t.label}</span>}
                          {isHov&&(
                            <div style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'#1a1a1f',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'4px',padding:'0.4rem 0.65rem',whiteSpace:'nowrap',zIndex:300,pointerEvents:'none',fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.7)',lineHeight:1.6,boxShadow:'0 6px 20px rgba(0,0,0,0.8)'}}>
                              <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.2rem'}}><TyreBadge compound={stint.compound} size="sm"/><strong style={{color:'#fff'}}>{TYRE_COLORS[stint.compound?.toUpperCase()]?.name??stint.compound}</strong></div>
                              <div>L{stint.lap_start}–{end} · {end-start} รอบ</div>
                              <div style={{color:age===0?'rgba(100,220,100,0.8)':'rgba(255,200,0,0.7)'}}>{age===0?'ยางใหม่':`ยางเก่า ${age} รอบ`}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {driverPits.map((p,pi)=>{
                      const left=(p.lap_number/totalLaps)*100,cls=pitCls(p.pit_duration);
                      const markerColor=cls==='fast'?'#00d4aa':cls==='slow'?'#ff8c00':'rgba(255,255,255,0.6)';
                      const isHov=hovered?.num===num&&hovered?.pi===pi;
                      return (
                        <div key={pi}
                          style={{position:'absolute',top:0,bottom:0,left:`${left}%`,transform:'translateX(-50%)',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'default'}}
                          onMouseEnter={()=>setHovered({num,pi})}
                          onMouseLeave={()=>setHovered(null)}
                        >
                          <div style={{width:'2px',height:'100%',background:markerColor,borderRadius:'1px',boxShadow:`0 0 4px ${markerColor}`}}/>
                          <div style={{position:'absolute',top:'-14px',fontFamily:"'DM Mono',monospace",fontSize:'0.55rem',color:markerColor,whiteSpace:'nowrap',fontWeight:700}}>L{p.lap_number}</div>
                          {isHov&&(
                            <div style={{position:'absolute',bottom:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)',background:'#1a1a1f',border:`1px solid ${markerColor}66`,borderRadius:'4px',padding:'0.45rem 0.7rem',whiteSpace:'nowrap',zIndex:300,pointerEvents:'none',fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.75)',lineHeight:1.7,boxShadow:'0 6px 20px rgba(0,0,0,0.8)'}}>
                              <div style={{color:'#fff',fontWeight:700,marginBottom:'0.15rem'}}>🔧 Pit Stop #{pi+1}</div>
                              <div>รอบที่ {p.lap_number}</div>
                              <div style={{color:markerColor}}>{p.pit_duration!=null?`${p.pit_duration.toFixed(3)} วิ`:'-'}{cls==='fast'?' ⚡ FAST':cls==='slow'?' 🐢 SLOW':''}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td style={{textAlign:'right',fontFamily:"'Russo One',sans-serif",fontSize:'1.1rem',color:'rgba(255,255,255,0.4)'}}>{driverPits.length}</td>
                <td className={`rr4-pit-dur ${pitCls(fastestPit?.pit_duration)}`} style={{textAlign:'right'}}>
                  {fastestPit?.pit_duration!=null?fastestPit.pit_duration.toFixed(3):'—'}
                  {pitCls(fastestPit?.pit_duration)==='fast'&&<span className="rr4-pit-lbl" style={{color:'#00d4aa'}}>FAST</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/* ═══ GRID VS FINISH ═══ */
const GridVsFinish = ({ raceResults, qualResults }) => {
  if (!raceResults.length) return <div className="rr4-empty">ยังไม่มีข้อมูลผลการแข่งขัน</div>;
  if (!qualResults.length) return <div className="rr4-empty">ยังไม่มีข้อมูล Qualifying สำหรับเปรียบเทียบ</div>;
  const gridMap = {};
  qualResults.forEach(r => { const id = r.Driver?.driverId; if (id) gridMap[id] = parseInt(r.position) || null; });
  const sorted = [...raceResults].sort((a, b) => parseInt(a.position) - parseInt(b.position));
  let biggestGain = null, biggestLoss = null;
  let gainCount = 0, lossCount = 0, sameCount = 0;
  const rows = sorted.map(r => {
    const id = r.Driver?.driverId;
    const grid = r.grid ? parseInt(r.grid) : (gridMap[id] ?? null);
    const finish = parseInt(r.position);
    const status = r.status ?? '';
    const isDnf = classifyStatus(status) === 'ret';
    const isLapped = classifyStatus(status) === 'lap';
    const delta = grid != null ? grid - finish : null;
    if (delta != null) {
      if (delta > 0) { gainCount++; if (!biggestGain || delta > biggestGain.delta) biggestGain = { delta, r }; }
      else if (delta < 0) { lossCount++; if (!biggestLoss || delta < biggestLoss.delta) biggestLoss = { delta, r }; }
      else { sameCount++; }
    }
    return { r, grid, finish, delta, isDnf, isLapped, status };
  });
  const allDeltas = rows.map(x => Math.abs(x.delta ?? 0)).filter(Boolean);
  const maxDelta = allDeltas.length ? Math.max(...allDeltas) : 1;
  const posColor = p => p === 1 ? '#FFD700' : p === 2 ? '#C0C0C0' : p === 3 ? '#CD7F32' : 'rgba(255,255,255,0.55)';
  return (
    <>
      <div className="gvf-header-cards">
        <div className="gvf-stat-card" style={{borderTop:'3px solid rgba(0,200,120,0.5)',animationDelay:'0.05s'}}>
          <div className="gvf-stat-label">⬆ ขึ้นอันดับ</div>
          <div className="gvf-stat-val" style={{color:'#00d47a'}}>{gainCount}</div>
          <div className="gvf-stat-sub">นักแข่ง</div>
          {biggestGain && <div style={{marginTop:'0.6rem',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.82rem',color:'rgba(0,200,120,0.6)'}}>สูงสุด: <strong style={{color:'#00d47a'}}>{biggestGain.r.Driver?.familyName}</strong> +{biggestGain.delta}</div>}
        </div>
        <div className="gvf-stat-card" style={{borderTop:'3px solid rgba(255,255,255,0.1)',animationDelay:'0.10s'}}>
          <div className="gvf-stat-label">↔ คงเดิม</div>
          <div className="gvf-stat-val" style={{color:'rgba(255,255,255,0.4)'}}>{sameCount}</div>
          <div className="gvf-stat-sub">นักแข่ง</div>
        </div>
        <div className="gvf-stat-card" style={{borderTop:'3px solid rgba(255,60,60,0.4)',animationDelay:'0.15s'}}>
          <div className="gvf-stat-label">⬇ ลงอันดับ</div>
          <div className="gvf-stat-val" style={{color:'#ff6060'}}>{lossCount}</div>
          <div className="gvf-stat-sub">นักแข่ง</div>
          {biggestLoss && <div style={{marginTop:'0.6rem',fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.82rem',color:'rgba(255,100,100,0.6)'}}>มากสุด: <strong style={{color:'#ff6060'}}>{biggestLoss.r.Driver?.familyName}</strong> {biggestLoss.delta}</div>}
        </div>
      </div>
      <div className="gvf-legend">
        {[['#00d47a','ขึ้นอันดับ'],['rgba(255,255,255,0.2)','คงเดิม'],['#ff6060','ลงอันดับ']].map(([c,l])=>(
          <div key={l} className="gvf-legend-item"><span style={{width:10,height:10,borderRadius:'50%',background:c,display:'inline-block'}}/>{l}</div>
        ))}
        <div className="gvf-legend-item" style={{marginLeft:'auto'}}>
          <span className="rr4-status-badge ret" style={{fontSize:'0.62rem'}}>Retired</span>&nbsp;/&nbsp;<span className="rr4-status-badge lap" style={{fontSize:'0.62rem'}}>Lapped</span>&nbsp;แสดง delta ตามจริง
        </div>
      </div>
      <div className="gvf-note">
        <span>📊</span>
        <div>
          <strong>Grid vs Finish Position</strong>
          เปรียบเทียบตำแหน่ง Start (Grid) กับตำแหน่งจบการแข่งขัน — รวมนักแข่งที่ Lapped และ Retired ด้วย
        </div>
      </div>
      <div className="rr4-tbl-wrap">
        <table className="rr4-tbl" style={{minWidth:'580px'}}>
          <thead><tr>
            <th className="c" style={{width:'52px'}}>จบ</th><th>นักแข่ง</th><th>ทีม</th>
            <th className="c" style={{width:'60px'}}>Grid</th>
            <th className="c" style={{minWidth:'160px'}}>การเปลี่ยนแปลง</th>
            <th className="c" style={{width:'110px'}}>+/− / สถานะ</th>
            <th className="r" style={{width:'80px'}}>คะแนน</th>
          </tr></thead>
          <tbody>
            {rows.map(({ r, grid, finish, delta, isDnf, isLapped, status }, i) => {
              const color = teamColor(r.Constructor?.name);
              const type = delta === null ? 'none' : delta > 0 ? 'gain' : delta < 0 ? 'loss' : 'same';
              const barPct = delta != null ? Math.abs(delta) / maxDelta * 100 : 0;
              const barColor = type === 'gain' ? '#00d47a' : type === 'loss' ? '#ff6060' : 'rgba(255,255,255,0.15)';
              const showStatus = isDnf || isLapped;
              return (
                <tr key={i} className={isDnf ? 'gvf-row-dnf' : ''} style={{animationDelay:`${i * 0.025}s`}}>
                  <td className={`rr4-pos ${posClass(String(finish))}`}>{finish}</td>
                  <td><DrvCell last={r.Driver?.familyName} first={r.Driver?.givenName} num={r.number} color={color}/></td>
                  <td className="rr4-team-td">{r.Constructor?.name}</td>
                  <td style={{textAlign:'center'}}>
                    <span style={{fontFamily:"'Russo One',sans-serif",fontSize:grid===1?'1.35rem':'1.1rem',color:grid!=null?posColor(grid):'rgba(255,255,255,0.15)'}}>{grid??'—'}</span>
                  </td>
                  <td style={{padding:'0.8rem 0.6rem'}}>
                    {delta != null ? (
                      <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.25)',minWidth:'20px',textAlign:'right'}}>{grid}</span>
                        <div style={{flex:1,position:'relative',height:'8px',background:'rgba(255,255,255,0.04)',borderRadius:'4px',overflow:'hidden',minWidth:'80px'}}>
                          {type === 'gain' && <div style={{position:'absolute',right:0,top:0,height:'100%',width:`${barPct}%`,background:barColor,borderRadius:'4px',boxShadow:`0 0 8px ${barColor}66`}}/>}
                          {type === 'loss' && <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${barPct}%`,background:barColor,borderRadius:'4px',boxShadow:`0 0 8px ${barColor}44`}}/>}
                          {type === 'same' && <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.06)',borderRadius:'4px'}}/>}
                        </div>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',color:'rgba(255,255,255,0.25)',minWidth:'20px'}}>{finish}</span>
                      </div>
                    ) : <span style={{color:'rgba(255,255,255,0.1)',fontSize:'0.72rem',fontFamily:'DM Mono'}}>—</span>}
                  </td>
                  <td style={{textAlign:'center',padding:'0.8rem 0.5rem'}}>
                    {delta == null ? (
                      <span style={{color:'rgba(255,255,255,0.12)',fontFamily:'DM Mono',fontSize:'0.72rem'}}>—</span>
                    ) : (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                        <span className={`gvf-delta-badge ${type}`}>
                          {type==='gain'&&<TrendingUp size={13}/>}{type==='loss'&&<TrendingDown size={13}/>}{type==='same'&&<Minus size={13}/>}
                          {type==='gain'?`+${delta}`:type==='loss'?`${delta}`:'='}
                        </span>
                        {showStatus && <StatusBadge status={status}/>}
                      </div>
                    )}
                  </td>
                  <td className={`rr4-pts-td ${r.points==='0'?'zero':''}`}>{r.points!=='0'?r.points:'—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(biggestGain || biggestLoss) && (
        <div style={{marginTop:'2.5rem'}}>
          <div className="rr4-sec-hd"><span className="rr4-sec-title">Biggest Movers</span><div className="rr4-sec-line"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px'}}>
            {biggestGain && (
              <div style={{background:'#111115',border:'1px solid rgba(0,200,120,0.15)',borderTop:'3px solid #00d47a',padding:'1.25rem 1.5rem',animation:'rr4-rise 0.5s ease both',animationDelay:'0.1s'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(0,200,120,0.5)',marginBottom:'0.4rem'}}>🚀 ขึ้นมากที่สุด</div>
                <div style={{fontFamily:"'Russo One',sans-serif",fontSize:'1.4rem',color:'#fff',textTransform:'uppercase',marginBottom:'0.2rem'}}>{biggestGain.r.Driver?.familyName}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.9rem',color:'rgba(255,255,255,0.3)',marginBottom:'0.8rem'}}>{biggestGain.r.Constructor?.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.88rem',color:'rgba(255,255,255,0.3)'}}>P{biggestGain.r.grid??'?'}</span>
                  <TrendingUp size={18} color="#00d47a"/>
                  <span style={{fontFamily:"'Russo One',sans-serif",fontSize:'1.8rem',color:'#00d47a'}}>+{biggestGain.delta}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.88rem',color:'rgba(255,255,255,0.3)'}}>P{biggestGain.r.position}</span>
                </div>
              </div>
            )}
            {biggestLoss && (
              <div style={{background:'#111115',border:'1px solid rgba(255,60,60,0.12)',borderTop:'3px solid rgba(255,60,60,0.6)',padding:'1.25rem 1.5rem',animation:'rr4-rise 0.5s ease both',animationDelay:'0.15s'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.72rem',fontWeight:800,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,100,100,0.5)',marginBottom:'0.4rem'}}>📉 ลงมากที่สุด</div>
                <div style={{fontFamily:"'Russo One',sans-serif",fontSize:'1.4rem',color:'#fff',textTransform:'uppercase',marginBottom:'0.2rem'}}>{biggestLoss.r.Driver?.familyName}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'0.9rem',color:'rgba(255,255,255,0.3)',marginBottom:'0.8rem'}}>{biggestLoss.r.Constructor?.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.88rem',color:'rgba(255,255,255,0.3)'}}>P{biggestLoss.r.grid??'?'}</span>
                  <TrendingDown size={18} color="#ff6060"/>
                  <span style={{fontFamily:"'Russo One',sans-serif",fontSize:'1.8rem',color:'#ff6060'}}>{biggestLoss.delta}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.88rem',color:'rgba(255,255,255,0.3)'}}>P{biggestLoss.r.position}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN RaceResult  ← แก้ 3 จุด: useParams, useNavigate, fetch race data
═══════════════════════════════════════════════════════════════════ */
const RaceResult = () => {
  // ── 1. อ่าน season/round จาก URL แทน props ──
  const { season: seasonParam, slug } = useParams();
  
  const navigate = useNavigate();
  const season = parseInt(seasonParam) || 2026;
// const round = parseInt(roundParam) || null;

  // ── 2. โหลดข้อมูล race จาก schedule เพื่อเอา raceName/Circuit ──
  const [race, setRace] = useState(null);

  // useEffect(() => {
  //   jolpicaApi.getSchedule(season).then(schedule => {
  //     const found = schedule.find(r => String(r.round) === String(round));
  //     setRace(found ?? null);
  //   });
  // }, [season, round]);

  useEffect(() => {
  const found = getRaceBySlug(slug);
  setRace(found ?? null);
}, [slug]);

  // ── 3. onBack ใช้ navigate แทน prop ──
  const handleBack = () => navigate('/results');

  const [tab,setTab]               = useState('race');
  const [initLoading,setInit]      = useState(true);
  const [tabLoading,setTabLoading] = useState(false);
  const [warn,setWarn]             = useState(null);

  const [raceRes,       setRaceRes]       = useState([]);
  const [qualRes,       setQualRes]       = useState([]);
  const [sprintRes,     setSprintRes]     = useState([]);
  const [sprintQualRes, setSprintQualRes] = useState([]);
  const [raceLaps,      setRaceLaps]      = useState([]);
  const [racePits,      setRacePits]      = useState([]);
  const [sprintLaps,    setSprintLaps]    = useState([]);
  const [fp1Laps,       setFp1Laps]       = useState([]);
  const [fp2Laps,       setFp2Laps]       = useState([]);
  const [fp3Laps,       setFp3Laps]       = useState([]);

  const [raceStints,    setRaceStints]    = useState([]);
  const [qualStints,    setQualStints]    = useState([]);
  const [sprintStints,  setSprintStints]  = useState([]);
  const [sprintQStints, setSprintQStints] = useState([]);
  const [fp1Stints,     setFp1Stints]     = useState([]);
  const [fp2Stints,     setFp2Stints]     = useState([]);
  const [fp3Stints,     setFp3Stints]     = useState([]);

  const [drivers,    setDrivers]    = useState({});
  const driversRef  = useRef({});
  const fetched     = useRef(new Set());
  const sessionsRef = useRef(null);
  const skeyRef     = useRef({});

  const isSprint = !!(race?.Sprint);

  useEffect(()=>{
    if(!race) return;
  const round = race.round;
    fetched.current.clear();
    sessionsRef.current=null;
    skeyRef.current={};
    driversRef.current={};
    setInit(true); setWarn(null);
    setRaceLaps([]); setRacePits([]);
    setSprintLaps([]); setFp1Laps([]); setFp2Laps([]); setFp3Laps([]);
    setRaceStints([]); setQualStints([]); setSprintStints([]); setSprintQStints([]);
    setFp1Stints([]); setFp2Stints([]); setFp3Stints([]);
    setDrivers({});

    const raceDate = race?.date ? new Date(race.date) : new Date();
    const jolFetches=[
      jolGet(`/${season}/${round}/results.json?limit=30`).then(d=>setRaceRes(d?.MRData?.RaceTable?.Races?.[0]?.Results??[])),
      jolGet(`/${season}/${round}/qualifying.json?limit=30`).then(d=>setQualRes(d?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults??[])),
      ...(isSprint?[jolGet(`/${season}/${round}/sprint.json?limit=30`).then(d=>setSprintRes(d?.MRData?.RaceTable?.Races?.[0]?.SprintResults??[]))]:[] ),
    ];

    const of1Eager=of1Get(`/sessions?year=${season}`)
      .then(async all=>{
        if(!Array.isArray(all)) return;
        const raceTs=raceDate.getTime();
        const weekend=all.filter(s=>Math.abs(new Date(s.date_start).getTime()-raceTs)<5*86400000);
        sessionsRef.current=weekend;
        weekend.forEach(s=>{skeyRef.current[s.session_name?.toLowerCase()]=s.session_key;});
        const raceKey=weekend.find(s=>s.session_name?.toLowerCase()==='race')?.session_key??null;
        if(!raceKey) return;
        const drvData=await of1Get(`/drivers?session_key=${raceKey}`);
        if(Array.isArray(drvData)){
          driversRef.current={...driversRef.current,[raceKey]:drvData};
          setDrivers(prev=>({...prev,[raceKey]:drvData}));
          fetched.current.add('_drivers');
        }
      })
      .catch(()=>{});

    Promise.allSettled([...jolFetches.map(p=>p.catch(()=>{})), of1Eager])
      .finally(()=>setInit(false));
  },[season, race]);

  useEffect(()=>{
    if(!initLoading && tab==='race') loadTab('race');
  },[initLoading]);

  const ensureSessions=useCallback(async()=>{
    if(sessionsRef.current) return sessionsRef.current;
    const all=await of1Get(`/sessions?year=${season}`);
    if(!Array.isArray(all)){sessionsRef.current=[];return [];}
    const raceTs=new Date(race?.date??Date.now()).getTime();
    sessionsRef.current=all.filter(s=>Math.abs(new Date(s.date_start).getTime()-raceTs)<5*86400000);
    sessionsRef.current.forEach(s=>{skeyRef.current[s.session_name?.toLowerCase()]=s.session_key;});
    return sessionsRef.current;
  },[season,race?.date]);

  const getKey=(sessions,name)=>sessions.find(s=>s.session_name?.toLowerCase()===name.toLowerCase())?.session_key??null;

  const loadTab=useCallback(async(newTab)=>{
    if(fetched.current.has(newTab)||!OF1_TABS.has(newTab)) return;
    if(newTab==='grid'){fetched.current.add('grid');return;}
    setTabLoading(true);
    try{
      const sessions=await ensureSessions();
      if(!sessions.length){setWarn('ไม่พบ session ใน OpenF1');fetched.current.add(newTab);return;}
      const fetchForSession=async(sessionName,fetchFn)=>{
        const key=getKey(sessions,sessionName);
        if(!key) return;
        const needDrivers=!driversRef.current[key];
        const promises=[fetchFn(key)];
        if(needDrivers) promises.push(
          of1Get(`/drivers?session_key=${key}`).then(d=>{
            if(Array.isArray(d)){driversRef.current={...driversRef.current,[key]:d};setDrivers({...driversRef.current});}
          })
        );
        await Promise.all(promises);
      };
      if(newTab==='race'){
        await fetchForSession(OF1_SESSION.race, async key=>{const st=await of1Get(`/stints?session_key=${key}`);setRaceStints(Array.isArray(st)?st:[]);});
      }else if(newTab==='laps'){
        await fetchForSession(OF1_SESSION.race, async key=>{const d=await of1Get(`/laps?session_key=${key}`);setRaceLaps(Array.isArray(d)?d:[]);});
      }else if(newTab==='pits'){
        await fetchForSession(OF1_SESSION.race, async key=>{
          const[ps,st]=await Promise.all([of1Get(`/pit?session_key=${key}`),fetched.current.has('race')?Promise.resolve(null):of1Get(`/stints?session_key=${key}`)]);
          setRacePits(Array.isArray(ps)?ps:[]);
          if(st!==null&&Array.isArray(st)){setRaceStints(st);fetched.current.add('race');}
        });
      }else if(newTab==='qual'){
        await fetchForSession(OF1_SESSION.qual, async key=>{const st=await of1Get(`/stints?session_key=${key}`);setQualStints(Array.isArray(st)?st:[]);});
      }else if(newTab==='fp1'){
        await fetchForSession(OF1_SESSION.fp1, async key=>{const[l,st]=await Promise.all([of1Get(`/laps?session_key=${key}`),of1Get(`/stints?session_key=${key}`)]);setFp1Laps(Array.isArray(l)?l:[]);setFp1Stints(Array.isArray(st)?st:[]);});
      }else if(newTab==='fp2'){
        await fetchForSession(OF1_SESSION.fp2, async key=>{const[l,st]=await Promise.all([of1Get(`/laps?session_key=${key}`),of1Get(`/stints?session_key=${key}`)]);setFp2Laps(Array.isArray(l)?l:[]);setFp2Stints(Array.isArray(st)?st:[]);});
      }else if(newTab==='fp3'){
        await fetchForSession(OF1_SESSION.fp3, async key=>{const[l,st]=await Promise.all([of1Get(`/laps?session_key=${key}`),of1Get(`/stints?session_key=${key}`)]);setFp3Laps(Array.isArray(l)?l:[]);setFp3Stints(Array.isArray(st)?st:[]);});
      }else if(newTab==='sprint_laps'){
        await fetchForSession(OF1_SESSION.sprint, async key=>{const[l,st]=await Promise.all([of1Get(`/laps?session_key=${key}`),of1Get(`/stints?session_key=${key}`)]);setSprintLaps(Array.isArray(l)?l:[]);setSprintStints(Array.isArray(st)?st:[]);fetched.current.add('sprint_tyres');});
      }else if(newTab==='sprint_tyres'){
        if(!fetched.current.has('sprint_tyres')){
          await fetchForSession(OF1_SESSION.sprint, async key=>{const[l,st]=await Promise.all([of1Get(`/laps?session_key=${key}`),of1Get(`/stints?session_key=${key}`)]);setSprintLaps(Array.isArray(l)?l:[]);setSprintStints(Array.isArray(st)?st:[]);fetched.current.add('sprint_laps');});
        }
      }else if(newTab==='sprint_q_tyres'){
        await fetchForSession(OF1_SESSION.sprint_q, async key=>{const st=await of1Get(`/stints?session_key=${key}`);setSprintQStints(Array.isArray(st)?st:[]);});
      }
      fetched.current.add(newTab);
    }catch{setWarn('ดึงข้อมูลจาก OpenF1 ไม่สำเร็จ');}
    finally{setTabLoading(false);}
  },[ensureSessions]);

  const getTabDrivers=(sessionName)=>{
    const key=skeyRef.current[sessionName?.toLowerCase()];
    if(key&&drivers[key]?.length) return drivers[key];
    const first=Object.values(drivers).find(arr=>arr?.length);
    return first??[];
  };
  const handleTab=key=>{setTab(key);setWarn(null);loadTab(key);};
  const isLoaded=key=>fetched.current.has(key);

  const raceSortKeys={};
  raceRes.forEach(r=>{raceSortKeys[r.number]=parseInt(r.position)||99;});
  const sprintSortKeys={};
  sprintRes.forEach(r=>{sprintSortKeys[r.number]=parseInt(r.position)||99;});

  const TAB_GROUPS=[
    {label:'🏎  Race Weekend',tabs:[
      {key:'race',label:'🏁 Race'},
      {key:'qual',label:'⏱ Qualifying'},
      ...(isSprint?[{key:'sprint',label:'🏃 Sprint',cls:'sprint-tab'},{key:'sprint_q',label:'⚡ Sprint Quali',cls:'sprint-tab'}]:[]),
    ]},
    {label:'🔬  Race Data · OpenF1',tabs:[
      {key:'laps', label:'📊 Lap Times'},
      {key:'pits', label:'🔧 Pit Stops'},
      {key:'grid', label:'📈 Grid vs Finish', cls:'grid-tab'},
      ...(isSprint?[{key:'sprint_laps',label:'🏃 Sprint Laps',cls:'sprint-tab'},{key:'sprint_tyres',label:'🏃 Sprint Tyres',cls:'sprint-tab'},{key:'sprint_q_tyres',label:'⚡ SQ Tyres',cls:'sprint-tab'}]:[]),
    ]},
    {label:'🧪  Practice · OpenF1', tabs:[
      {key:'fp1', label:'FP 1', cls:'practice-tab'},
      ...(!isSprint ? [{key:'fp2', label:'FP 2', cls:'practice-tab'},{key:'fp3', label:'FP 3', cls:'practice-tab'}] : []),
    ]},
  ];

  const SEC_LABELS={
    race:'ผลการแข่งขัน',qual:'Qualifying',sprint:'Sprint Race',sprint_q:'Sprint Qualifying',
    laps:'Lap Times',pits:'Pit Stops',grid:'Grid vs Finish Position',
    sprint_laps:'Sprint Lap Times',sprint_tyres:'Tyre Strategy — Sprint',sprint_q_tyres:'Tyre Strategy — Sprint Shootout',
    fp1:'Practice 1',fp2:'Practice 2',fp3:'Practice 3',
  };

  const countBadge={laps:raceLaps.length,pits:racePits.length,sprint_laps:sprintLaps.length,sprint_tyres:sprintStints.length,sprint_q_tyres:sprintQStints.length,fp1:fp1Laps.length,fp2:fp2Laps.length,fp3:fp3Laps.length};
  const nameShort=(race?.raceName??'').replace('Grand Prix','').trim();
  // const circuit=race?.Circuit?.circuitName??'';
  // const loc=[race?.Circuit?.Location?.locality,race?.Circuit?.Location?.country].filter(Boolean).join(', ');

  const circuit = race?.Circuit?.circuitName ?? race?.circuit ?? '';
const loc = [
  race?.Circuit?.Location?.locality ?? race?.locality,
  race?.Circuit?.Location?.country  ?? race?.country,
].filter(Boolean).join(', ');

  // รอ race data โหลดก่อน
  if (!race) {
    return (
      <div className="rr4">
        <style>{CSS}</style>
        <div className="rr4-shell">
          <div className="rr4-inner">
            <div className="rr4-loading-main">
              <div className="rr4-load-track"><div className="rr4-load-bar"/></div>
              <p className="rr4-load-txt">loading race info...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rr4">
      <style>{CSS}</style>
      <div className="rr4-shell">
        <div className="rr4-noise"/><div className="rr4-scan"/><div className="rr4-glow"/>
        <div className="rr4-inner">
          {/* ── ปุ่มกลับใช้ handleBack แทน onBack prop ── */}
          <button className="rr4-back" onClick={handleBack}><ChevronLeft size={14}/> ตารางแข่ง</button>

          <div className="rr4-hero">
            <div className="rr4-round-tag">Round {race.round} · {season}</div>
            <h1 className="rr4-hero-name"><em>{nameShort}</em><br/>Grand Prix</h1>
            <div className="rr4-hero-sub">{circuit}</div>
            <div className="rr4-hero-meta">
              <span><Flag size={13}/>{loc}</span>
              <span><Timer size={13}/>{fmtDate(race?.date)}</span>
              {isSprint&&<span className="rr4-sprint-badge">🏃 Sprint Weekend</span>}
            </div>
          </div>

          <div className="rr4-tab-groups">
            {TAB_GROUPS.map((grp,gi)=>(
              <div key={gi}>
                <div className="rr4-group-label">{grp.label}</div>
                <div className="rr4-tab-row">
                  {grp.tabs.map(t=>(
                    <button key={t.key} className={`rr4-tab ${t.cls??''} ${tab===t.key?'active':''}`} onClick={()=>handleTab(t.key)}>
                      {isLoaded(t.key)&&tab!==t.key&&<span className="rr4-tab-dot"/>}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ApiDisclaimer />

          {warn&&<div className="rr4-warn"><AlertTriangle size={16} color="#ffa500" style={{flexShrink:0,marginTop:2}}/><div><strong>OpenF1 Notice</strong>{warn}</div></div>}

          {initLoading?(
            <div className="rr4-loading-main">
              <div className="rr4-load-track"><div className="rr4-load-bar"/></div>
              <p className="rr4-load-txt">loading race data...</p>
            </div>
          ):(
            <>
              <div className="rr4-sec-hd">
                <span className="rr4-sec-title">{SEC_LABELS[tab]}</span>
                <div className="rr4-sec-line"/>
                {countBadge[tab]>0&&<span className="rr4-sec-badge">{countBadge[tab].toLocaleString()} rows</span>}
                {tab==='grid'&&raceRes.length>0&&<span className="rr4-sec-badge">{raceRes.length} นักแข่ง</span>}
                {OF1_TABS.has(tab)&&tab!=='grid'&&<span className="rr4-api-source">OpenF1</span>}
                {tab==='grid'&&<span className="rr4-api-source">Jolpica Ergast</span>}
              </div>

              {tabLoading?<TabSpinner label="กำลังโหลดจาก OpenF1..."/>:(
                <>
                  {tab==='race'           && <RaceTable results={raceRes} showPts={true} stints={raceStints}/>}
                  {tab==='qual'           && <QualTable results={qualRes} allDrivers={raceRes} stints={qualStints}/>}
                  {tab==='sprint'         && <RaceTable results={sprintRes} showPts={true} stints={sprintStints}/>}
                  {tab==='sprint_q'       && <QualTable results={sprintQualRes} allDrivers={raceRes} label="Sprint Qualifying" stints={sprintQStints}/>}
                  {tab==='laps'           && <LapTable laps={raceLaps} drivers={getTabDrivers('race')}/>}
                  {tab==='pits'           && <PitTable pits={racePits} drivers={getTabDrivers('race')} stints={raceStints}/>}
                  {tab==='grid'           && <GridVsFinish raceResults={raceRes} qualResults={qualRes}/>}
                  {tab==='sprint_laps'    && <LapTable laps={sprintLaps} drivers={getTabDrivers('sprint')}/>}
                  {tab==='sprint_tyres'   && <TyreTimeline stints={sprintStints} drivers={getTabDrivers('sprint')} sortKeys={sprintSortKeys} sessionLabel="Sprint Race" showDetailTable={true}/>}
                  {tab==='sprint_q_tyres' && <TyreTimeline stints={sprintQStints} drivers={getTabDrivers('sprint shootout')} sortKeys={null} sessionLabel="Sprint Shootout" showDetailTable={true}/>}
                  {tab==='fp1'            && <PracticeTable laps={fp1Laps} stints={fp1Stints} drivers={getTabDrivers('practice 1')} sessionName="Practice 1"/>}
                  {tab==='fp2'            && <PracticeTable laps={fp2Laps} stints={fp2Stints} drivers={getTabDrivers('practice 2')} sessionName="Practice 2"/>}
                  {tab==='fp3'            && <PracticeTable laps={fp3Laps} stints={fp3Stints} drivers={getTabDrivers('practice 3')} sessionName="Practice 3"/>}
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