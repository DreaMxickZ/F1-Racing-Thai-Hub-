import { useState, useEffect } from 'react';
import { MapPin, Activity, Calendar, ChevronRight, Globe } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

// Circuit layout images — Wikimedia Commons (CC BY-SA, free to use with attribution)
// Using ?width=400 thumbnail API for consistent sizing
const CIRCUIT_MAPS = {
  albert_park:  'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmelbournedetailed.webp',
  bahrain:      'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksakhirdetailed.webp',
  shanghai:     'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackshanghaidetailed.webp',
  suzuka:       'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksuzukadetailed.webp',
  jeddah:       'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackjeddahdetailed.webp',
  miami:        'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmiamidetailed.webp',
  imola:        'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackimoladetailed.webp',
  monaco:       'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmontecarlodetailed.webp',
  catalunya:    'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackcatalunyadetailed.webp',
  madring:       'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmadriddetailed.webp',  
  villeneuve:   'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmontrealdetailed.webp',
  red_bull_ring:'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackspielbergdetailed.webp',
  silverstone:  'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksilverstonedetailed.webp',
  hungaroring:  'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackhungaroringdetailed.webp',
  spa:          'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackspafrancorchampsdetailed.webp',
  zandvoort:    'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackzandvoortdetailed.webp', 
  monza:        'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmonzadetailed.webp',
  
  baku:         'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackbakudetailed.webp',
  marina_bay:   'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracksingaporedetailed.webp',
  americas:     'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackaustindetailed.webp',
  rodriguez:    'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackmexicocitydetailed.webp',
  interlagos:   'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackinterlagosdetailed.webp',
  vegas:        'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracklasvegasdetailed.webp',
  losail:       'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026tracklusaildetailed.webp',
  yas_marina:   'https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026trackyasmarinadetailed.webp',
};

const TOTAL_LAPS = {
  albert_park: 58, bahrain: 57, shanghai: 56, suzuka: 53,
  jeddah: 50, miami: 57, imola: 63, monaco: 78,
  catalunya: 66,  villeneuve: 70, red_bull_ring: 71,
  silverstone: 52, hungaroring: 70, spa: 44, zandvoort: 72,
  monza: 53, baku: 51, marina_bay: 62, americas: 56,
  rodriguez: 71, interlagos: 71, vegas: 50, losail: 57, yas_marina: 58,
  madring: 57,
};

const CIRCUIT_LENGTH = {
  albert_park: 5.278, bahrain: 5.412, shanghai: 5.451, suzuka: 5.807,
  jeddah: 6.174, miami: 5.412, imola: 4.909, monaco: 3.337,
  catalunya: 4.675, villeneuve: 4.361, red_bull_ring: 4.318,
  silverstone: 5.891, hungaroring: 4.381, spa: 7.004, zandvoort: 4.259,
  monza: 5.793, baku: 6.003, marina_bay: 5.063, americas: 5.513,
  rodriguez: 4.304, interlagos: 4.309, vegas: 6.201, losail: 5.380, yas_marina: 5.281,
  madring: 5.416,
};

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-circuits-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-circuits-page *, .f1-circuits-page *::before, .f1-circuits-page *::after {
    box-sizing: border-box;
  }

  .f1-circuits-page .cp-wrap {
    background: #0a0a0c;
    position: relative; overflow: hidden; min-height: 60vh;
  }
  .f1-circuits-page .cp-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }
  .f1-circuits-page .cp-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-circuits-page .cp-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* ── HEADER ─────────────────────────── */
  .f1-circuits-page .cp-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-circuits-page .cp-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-circuits-page .cp-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-circuits-page .cp-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-circuits-page .cp-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .f1-circuits-page .cp-title em { font-style: italic; color: #e10600; }
  .f1-circuits-page .cp-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-circuits-page .cp-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .f1-circuits-page .cp-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem; vertical-align: middle;
  }

  /* ── STATS BAR ───────────────────────── */
  .f1-circuits-page .cp-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px; margin-bottom: 3rem;
  }
  .f1-circuits-page .cp-stat {
    background: #111114; border: 1px solid rgba(255,255,255,0.05);
    padding: 1.5rem 2rem;
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .f1-circuits-page .cp-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2.5rem; font-weight: 900; color: #e10600; line-height: 1;
  }
  .f1-circuits-page .cp-stat-label {
    font-size: 0.75rem; color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;
  }

  /* ── GRID ─────────────────────────────── */
  .f1-circuits-page .cp-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2px;
  }

  /* ── CARD ─────────────────────────────── */
  .f1-circuits-page .cp-card {
    background: #111114; position: relative;
    overflow: hidden; border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.3s ease, transform 0.3s ease;
    animation: cp-rise 0.4s ease both;
    display: flex; flex-direction: column;
  }
  .f1-circuits-page .cp-card:hover { background: #17171c; transform: translateY(-3px); z-index: 2; }

  /* stagger */
  .f1-circuits-page .cp-card:nth-child(1)  { animation-delay: 0.03s }
  .f1-circuits-page .cp-card:nth-child(2)  { animation-delay: 0.06s }
  .f1-circuits-page .cp-card:nth-child(3)  { animation-delay: 0.09s }
  .f1-circuits-page .cp-card:nth-child(4)  { animation-delay: 0.12s }
  .f1-circuits-page .cp-card:nth-child(5)  { animation-delay: 0.15s }
  .f1-circuits-page .cp-card:nth-child(6)  { animation-delay: 0.18s }
  .f1-circuits-page .cp-card:nth-child(7)  { animation-delay: 0.21s }
  .f1-circuits-page .cp-card:nth-child(8)  { animation-delay: 0.24s }
  .f1-circuits-page .cp-card:nth-child(9)  { animation-delay: 0.27s }
  .f1-circuits-page .cp-card:nth-child(10) { animation-delay: 0.30s }
  .f1-circuits-page .cp-card:nth-child(11) { animation-delay: 0.33s }
  .f1-circuits-page .cp-card:nth-child(12) { animation-delay: 0.36s }
  .f1-circuits-page .cp-card:nth-child(13) { animation-delay: 0.39s }
  .f1-circuits-page .cp-card:nth-child(14) { animation-delay: 0.42s }
  .f1-circuits-page .cp-card:nth-child(15) { animation-delay: 0.45s }
  .f1-circuits-page .cp-card:nth-child(16) { animation-delay: 0.48s }
  .f1-circuits-page .cp-card:nth-child(17) { animation-delay: 0.51s }
  .f1-circuits-page .cp-card:nth-child(18) { animation-delay: 0.54s }
  .f1-circuits-page .cp-card:nth-child(19) { animation-delay: 0.57s }
  .f1-circuits-page .cp-card:nth-child(20) { animation-delay: 0.60s }
  .f1-circuits-page .cp-card:nth-child(21) { animation-delay: 0.63s }
  .f1-circuits-page .cp-card:nth-child(22) { animation-delay: 0.66s }
  .f1-circuits-page .cp-card:nth-child(23) { animation-delay: 0.69s }
  .f1-circuits-page .cp-card:nth-child(24) { animation-delay: 0.72s }

  /* accent bar */
  .f1-circuits-page .cp-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: #e10600; opacity: 0; transition: opacity 0.3s ease;
  }
  .f1-circuits-page .cp-card:hover .cp-card-bar { opacity: 1; }

  /* ── MAP IMAGE AREA ──────────────────── */
  .f1-circuits-page .cp-map-area {
    position: relative;
    background: #0a0a0c;
    height: 200px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  /* checkerboard pattern fallback */
  .f1-circuits-page .cp-map-area.no-img {
    background:
      repeating-conic-gradient(rgba(255,255,255,0.015) 0% 25%, transparent 0% 50%)
      0 0 / 24px 24px;
  }
  .f1-circuits-page .cp-map-area img {
    max-height: 170px; max-width: 90%;
    object-fit: contain;
    filter: brightness(0.85) saturate(0.7) invert(1) hue-rotate(180deg);
    opacity: 0.7;
    transition: filter 0.3s ease, opacity 0.3s ease, transform 0.4s ease;
  }
  /* on hover: brighten and show the original color */
  .f1-circuits-page .cp-card:hover .cp-map-area img {
    filter: brightness(1) saturate(1.2) invert(0) hue-rotate(0deg);
    opacity: 1;
    transform: scale(1.04);
  }
  /* Round label top-left */
  .f1-circuits-page .cp-round-badge {
    position: absolute; top: 0.75rem; left: 0.75rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: #e10600; border: 1px solid rgba(225,6,0,0.4);
    padding: 0.18rem 0.55rem; border-radius: 2px; line-height: 1.5;
    background: rgba(10,10,12,0.8); backdrop-filter: blur(4px);
  }
  /* Map placeholder icon */
  .f1-circuits-page .cp-map-placeholder {
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: rgba(255,255,255,0.08);
  }
  .f1-circuits-page .cp-map-placeholder span {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
  }

  /* ── CARD BODY ───────────────────────── */
  .f1-circuits-page .cp-card-body {
    padding: 1.5rem 1.75rem 1.75rem;
    position: relative; z-index: 1; flex: 1;
    display: flex; flex-direction: column;
  }
  .f1-circuits-page .cp-circuit-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.01em; color: #ffffff;
    margin: 0 0 0.2rem; padding: 0; line-height: 1.1;
  }
  .f1-circuits-page .cp-race-name {
    font-size: 0.8rem; color: rgba(255,255,255,0.38);
    font-weight: 500; margin-bottom: 1rem;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  /* stats row */
  .f1-circuits-page .cp-stat-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.5rem 0; margin-bottom: 1rem;
  }
  .f1-circuits-page .cp-stat-item {
    display: flex; flex-direction: column; gap: 0.15rem;
  }
  .f1-circuits-page .cp-stat-item-label {
    font-size: 0.65rem; color: rgba(255,255,255,0.28);
    text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;
  }
  .f1-circuits-page .cp-stat-item-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: 0.02em;
  }
  .f1-circuits-page .cp-stat-item-val.red { color: #e10600; }

  /* location row */
  .f1-circuits-page .cp-location {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.4);
    margin-bottom: 1rem; flex-wrap: wrap;
  }

  /* date strip */
  .f1-circuits-page .cp-date-strip {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.75rem; color: rgba(255,255,255,0.3);
    padding: 0.5rem 0;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 0.75rem;
  }

  /* links */
  .f1-circuits-page .cp-links {
    display: flex; gap: 1.25rem; margin-top: auto; padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    flex-wrap: wrap;
  }
  .f1-circuits-page .cp-link {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; text-decoration: none; transition: gap 0.2s ease;
  }
  .f1-circuits-page .cp-link:hover { gap: 0.55rem; }

  /* ── LOADING ─────────────────────────── */
  .f1-circuits-page .cp-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-circuits-page .cp-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-circuits-page .cp-bar-fill {
    height: 100%; background: #e10600; border-radius: 2px;
    animation: cp-slide 1.2s ease-in-out infinite;
  }
  .f1-circuits-page .cp-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  @keyframes cp-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes cp-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .f1-circuits-page .cp-cards {
      grid-template-columns: 1fr;
    }
    .f1-circuits-page .cp-stats {
      grid-template-columns: 1fr;
    }
  }
`;

const Circuits = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    jolpicaApi.getSchedule(2026)
      .then(schedule => {
        const data = schedule.map(race => ({
          ...race.Circuit,
          raceName: race.raceName,
          round: race.round,
          date: race.date,
        }));
        setCircuits(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const countries = new Set(circuits.map(c => c.Location?.country)).size;
  const cities    = new Set(circuits.map(c => c.Location?.locality)).size;

  return (
    <div className="f1-circuits-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="cp-loading">
          <div className="cp-bar-track"><div className="cp-bar-fill" /></div>
          <p className="cp-load-txt">Loading Circuits</p>
        </div>
      ) : (
        <div className="cp-wrap">
          <div className="cp-grid-bg" />
          <div className="cp-glow" />
          <div className="cp-inner">

            {/* Header */}
            <header className="cp-hd">
              <div className="cp-eyebrow">
                <MapPin size={12} color="#e10600" />
                <p className="cp-eyebrow-txt">Formula 1 Championship</p>
                <div className="cp-eyebrow-line" />
              </div>
              <h1 className="cp-title">
                สนามแข่ง <em>F1</em>
                <span className="cp-badge">2026</span>
              </h1>
              <div className="cp-subtitle">
                <span>{circuits.length} สนาม</span>
                <span>•</span>
                <span>{countries} ประเทศ</span>
                <span>•</span>
                <span>{cities} เมือง</span>
              </div>
              <div className="cp-ghost-num">{circuits.length}</div>
            </header>

            {/* Stats Bar */}
            <div className="cp-stats">
              <div className="cp-stat">
                <div className="cp-stat-val">{circuits.length}</div>
                <div className="cp-stat-label">สนามทั้งหมด</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">{countries}</div>
                <div className="cp-stat-label">ประเทศ</div>
              </div>
              <div className="cp-stat">
                <div className="cp-stat-val">{cities}</div>
                <div className="cp-stat-label">เมือง</div>
              </div>
            </div>

            {/* Circuit Cards */}
            <div className="cp-cards">
              {circuits.map((circuit) => {
                const cid = circuit.circuitId;
                const mapImg = CIRCUIT_MAPS[cid];
                const laps   = TOTAL_LAPS[cid];
                const length = CIRCUIT_LENGTH[cid];
                const hasImg = mapImg && !imgErrors[cid];

                return (
                  <div key={cid} className="cp-card">
                    <div className="cp-card-bar" />

                    {/* Circuit Map Image */}
                    <div className={`cp-map-area${hasImg ? '' : ' no-img'}`}>
                      <div className="cp-round-badge">Round {circuit.round}</div>

                      {hasImg ? (
                        <img
                          src={mapImg}
                          alt={`${circuit.circuitName} layout`}
                          onError={() => setImgErrors(prev => ({ ...prev, [cid]: true }))}
                        />
                      ) : (
                        <div className="cp-map-placeholder">
                          <MapPin size={32} />
                          <span>No map available</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="cp-card-body">
                      <h2 className="cp-circuit-name">{circuit.circuitName}</h2>
                      <p className="cp-race-name">{circuit.raceName}</p>

                      {/* Location */}
                      <div className="cp-location">
                        <MapPin size={12} />
                        <span>
                          {circuit.Location?.locality}{circuit.Location?.country ? `, ${circuit.Location.country}` : ''}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="cp-stat-row">
                        {laps && (
                          <div className="cp-stat-item">
                            <span className="cp-stat-item-label">จำนวนรอบ</span>
                            <span className="cp-stat-item-val red">{laps} รอบ</span>
                          </div>
                        )}
                        {length && (
                          <div className="cp-stat-item">
                            <span className="cp-stat-item-label">ความยาวสนาม</span>
                            <span className="cp-stat-item-val">{length} km</span>
                          </div>
                        )}
                        {laps && length && (
                          <div className="cp-stat-item">
                            <span className="cp-stat-item-label">ระยะทางรวม</span>
                            <span className="cp-stat-item-val">{(laps * length).toFixed(1)} km</span>
                          </div>
                        )}
                        {circuit.Location?.lat && (
                          <div className="cp-stat-item">
                            <span className="cp-stat-item-label">พิกัด</span>
                            <span className="cp-stat-item-val" style={{ fontSize: '0.78rem' }}>
                              {parseFloat(circuit.Location.lat).toFixed(3)}°, {parseFloat(circuit.Location.long).toFixed(3)}°
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Race Date */}
                      <div className="cp-date-strip">
                        <Calendar size={11} />
                        <span>
                          {new Date(circuit.date).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="cp-links">
                        {circuit.Location?.lat && circuit.Location?.long && (
                          <a
                            href={`https://www.google.com/maps?q=${circuit.Location.lat},${circuit.Location.long}`}
                            target="_blank" rel="noopener noreferrer" className="cp-link"
                          >
                            <MapPin size={12} />
                            Google Maps
                          </a>
                        )}
                        {circuit.url && (
                          <a
                            href={circuit.url}
                            target="_blank" rel="noopener noreferrer" className="cp-link"
                          >
                            <Globe size={12} />
                            ข้อมูลเพิ่มเติม
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Circuits;