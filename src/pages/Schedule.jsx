import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronRight, Flag, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jolpicaApi } from '../services/f1Api';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-schedule-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-schedule-page *, .f1-schedule-page *::before, .f1-schedule-page *::after {
    box-sizing: border-box;
  }

  /* Wrapper */
  .f1-schedule-page .sp-wrap {
    background: #0a0a0c;
    position: relative;
    overflow: hidden;
    min-height: 60vh;
  }
  .f1-schedule-page .sp-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }
  .f1-schedule-page .sp-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-schedule-page .sp-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* ── HEADER ──────────────────────────── */
  .f1-schedule-page .sp-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-schedule-page .sp-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-schedule-page .sp-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-schedule-page .sp-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-schedule-page .sp-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .f1-schedule-page .sp-title em { font-style: italic; color: #e10600; }
  .f1-schedule-page .sp-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-schedule-page .sp-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .f1-schedule-page .sp-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem; vertical-align: middle;
  }

  /* ── RACE LIST ───────────────────────── */
  .f1-schedule-page .sp-list {
    display: flex; flex-direction: column; gap: 2px;
  }

  /* ── RACE CARD ───────────────────────── */
  .f1-schedule-page .sp-card {
    background: #111114;
    border: 1px solid rgba(255,255,255,0.05);
    position: relative; overflow: hidden;
    transition: background 0.3s ease;
    animation: sp-rise 0.4s ease both;
  }
  .f1-schedule-page .sp-card:hover { background: #17171c; }
  .f1-schedule-page .sp-card.past { opacity: 0.55; }
  .f1-schedule-page .sp-card.past:hover { opacity: 0.85; }
  .f1-schedule-page .sp-card.next { border-color: rgba(225,6,0,0.35); }

  .f1-schedule-page .sp-card.next::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, rgba(225,6,0,0.04), transparent 60%);
    pointer-events: none;
  }

  .f1-schedule-page .sp-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: #e10600; opacity: 0;
    transition: opacity 0.3s ease;
  }
  .f1-schedule-page .sp-card:hover .sp-card-bar { opacity: 1; }
  .f1-schedule-page .sp-card.next .sp-card-bar { opacity: 1; }

  .f1-schedule-page .sp-card-ghost {
    position: absolute; right: -0.5rem; top: 50%; transform: translateY(-50%);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 7rem; font-weight: 900; color: rgba(255,255,255,0.025);
    line-height: 1; user-select: none; pointer-events: none;
  }

  .f1-schedule-page .sp-card-inner {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
    padding: 1.75rem 2rem;
    align-items: start;
    position: relative; z-index: 1;
  }

  /* ── LEFT: Race Info ─────────────────── */
  .f1-schedule-page .sp-race-top {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; flex-wrap: wrap;
  }
  .f1-schedule-page .sp-round-pill {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: #e10600; border: 1px solid rgba(225,6,0,0.4);
    padding: 0.2rem 0.6rem; border-radius: 2px; line-height: 1.4;
  }
  .f1-schedule-page .sp-sprint-pill {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #fff; background: #e10600;
    padding: 0.2rem 0.55rem; border-radius: 2px; line-height: 1.4;
  }
  .f1-schedule-page .sp-past-pill {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.12);
    padding: 0.2rem 0.55rem; border-radius: 2px; line-height: 1.4;
  }
  .f1-schedule-page .sp-next-pill {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: #fff; background: rgba(225,6,0,0.8);
    padding: 0.2rem 0.55rem; border-radius: 2px; line-height: 1.4;
    animation: sp-pulse 2s ease-in-out infinite;
  }
  @keyframes sp-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  /* ── FLAG ────────────────────────────── */
  .f1-schedule-page .sp-flag {
    display: inline-block;
    width: 32px;
    height: 24px;
    object-fit: cover;
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
    flex-shrink: 0;
    vertical-align: middle;
  }
  .f1-schedule-page .sp-race-name-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }

  .f1-schedule-page .sp-race-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.7rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.01em; color: #ffffff;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-schedule-page .sp-circuit-row {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; color: rgba(255,255,255,0.4);
    margin-bottom: 0.35rem;
  }
  .f1-schedule-page .sp-race-datetime {
    display: flex; align-items: center; gap: 0.75rem;
    margin-top: 0.75rem; flex-wrap: wrap;
  }
  .f1-schedule-page .sp-race-date-main {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.05rem; font-weight: 700; color: #fff; letter-spacing: 0.02em;
  }
  .f1-schedule-page .sp-race-time-main {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.05rem; font-weight: 700; color: #e10600; letter-spacing: 0.02em;
  }

  /* Links row */
  .f1-schedule-page .sp-links {
    display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; align-items: center;
  }
  .f1-schedule-page .sp-link {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; text-decoration: none; transition: gap 0.2s ease;
  }
  .f1-schedule-page .sp-link:hover { gap: 0.55rem; }

  /* ── RESULT BUTTON ───────────────────── */
  .f1-schedule-page .sp-result-btn {
    display: inline-flex; align-items: center; gap: 0.45rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: #fff;
    background: rgba(225,6,0,0.75);
    border: 1px solid rgba(225,6,0,0.5);
    border-radius: 2px; padding: 0.4rem 0.9rem;
    cursor: pointer; transition: background 0.2s ease;
  }
  .f1-schedule-page .sp-result-btn:hover { background: #e10600; }

  /* ── RIGHT: Sessions Panel ───────────── */
  .f1-schedule-page .sp-sessions {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 2px;
    min-width: 260px;
    padding: 1rem 1.25rem 1.1rem;
    flex-shrink: 0;
  }
  .f1-schedule-page .sp-sessions-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin: 0 0 0.85rem; padding: 0;
  }
  .f1-schedule-page .sp-session-row {
    display: grid;
    grid-template-columns: 90px 1fr auto;
    align-items: center;
    gap: 0.5rem 0.75rem;
    padding: 0.45rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.8rem;
  }
  .f1-schedule-page .sp-session-row:last-child { border-bottom: none; }
  .f1-schedule-page .sp-session-row.race-row {
    padding-top: 0.65rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: none;
    margin-top: 0.2rem;
  }
  .f1-schedule-page .sp-session-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: rgba(255,255,255,0.38);
  }
  .f1-schedule-page .sp-session-row.race-row .sp-session-label { color: #e10600; }
  .f1-schedule-page .sp-session-date { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
  .f1-schedule-page .sp-session-time {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.88rem; font-weight: 700; color: #ffffff; letter-spacing: 0.03em;
    text-align: right;
  }
  .f1-schedule-page .sp-session-row.race-row .sp-session-time { color: #e10600; font-size: 1rem; }
  .f1-schedule-page .sp-laps-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 0.85rem; padding-top: 0.7rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 0.75rem;
  }
  .f1-schedule-page .sp-laps-label { color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.08em; }
  .f1-schedule-page .sp-laps-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; color: #fff; font-size: 0.9rem; letter-spacing: 0.05em;
  }

  /* Responsive */
  @media (max-width: 700px) {
    .f1-schedule-page .sp-card-inner { grid-template-columns: 1fr; }
    .f1-schedule-page .sp-sessions { min-width: unset; width: 100%; }
  }

  /* ── LOADING ─────────────────────────── */
  .f1-schedule-page .sp-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-schedule-page .sp-bar-track { width: 200px; height: 2px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
  .f1-schedule-page .sp-bar-fill { height: 100%; background: #e10600; border-radius: 2px; animation: sp-slide 1.2s ease-in-out infinite; }
  .f1-schedule-page .sp-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  /* stagger */
  .f1-schedule-page .sp-card:nth-child(1)  { animation-delay: 0.02s }
  .f1-schedule-page .sp-card:nth-child(2)  { animation-delay: 0.04s }
  .f1-schedule-page .sp-card:nth-child(3)  { animation-delay: 0.06s }
  .f1-schedule-page .sp-card:nth-child(4)  { animation-delay: 0.08s }
  .f1-schedule-page .sp-card:nth-child(5)  { animation-delay: 0.10s }
  .f1-schedule-page .sp-card:nth-child(6)  { animation-delay: 0.12s }
  .f1-schedule-page .sp-card:nth-child(7)  { animation-delay: 0.14s }
  .f1-schedule-page .sp-card:nth-child(8)  { animation-delay: 0.16s }
  .f1-schedule-page .sp-card:nth-child(9)  { animation-delay: 0.18s }
  .f1-schedule-page .sp-card:nth-child(10) { animation-delay: 0.20s }
  .f1-schedule-page .sp-card:nth-child(n+11) { animation-delay: 0.22s }

  @keyframes sp-slide { 0%{ transform: translateX(-100%) } 100%{ transform: translateX(400%) } }
  @keyframes sp-rise  { from{ opacity:0; transform:translateY(16px) } to{ opacity:1; transform:translateY(0) } }
`;

const TOTAL_LAPS = {
  albert_park: 58, bahrain: 57, shanghai: 56, suzuka: 53,
  miami: 57, imola: 63, monaco: 78, catalunya: 66,
  villeneuve: 70, red_bull_ring: 71, silverstone: 52, hungaroring: 70,
  spa: 44, zandvoort: 72, monza: 53, baku: 51,
  marina_bay: 62, americas: 56, rodriguez: 71, interlagos: 71,
  vegas: 50, losail: 57, yas_marina: 58,
};

const COUNTRY_CODE = {
  Australia:       'au',
  Japan:           'jp',
  China:           'cn',
  Singapore:       'sg',
  Bahrain:         'bh',
  UAE:             'ae',
  'Saudi Arabia':  'sa',
  Qatar:           'qa',
  Azerbaijan:      'az',
  Italy:           'it',
  Monaco:          'mc',
  Spain:           'es',
  Austria:         'at',
  UK:              'gb',
  'Great Britain': 'gb',
  Hungary:         'hu',
  Belgium:         'be',
  Netherlands:     'nl',
  USA:             'us',
  'United States': 'us',
  'Las Vegas':     'us',
  Mexico:          'mx',
  Brazil:          'br',
  Canada:          'ca',
};

const getCountryFlagUrl = (country) => {
  if (!country) return null;
  const code = COUNTRY_CODE[country]
    ?? COUNTRY_CODE[Object.keys(COUNTRY_CODE).find(k => k.toLowerCase() === country.toLowerCase())];
  return code ? `https://flagcdn.com/32x24/${code}.png` : null;
};

const fmtSession = (session) => {
  if (!session?.date) return { dateStr: '—', timeStr: '—' };
  const dt = new Date(session.date + 'T' + (session.time || '00:00:00'));
  return {
    dateStr: dt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
    timeStr: session.time
      ? dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      : 'TBA',
  };
};

// แปลง raceName → slug ให้ตรงกับ races2026.js
const toSlug = (raceName) =>
  raceName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

// ── badge "จบแล้ว" : Race + 2 ชั่วโมง ──────────────────────────────────────
const isPast = (race) => {
  if (!race?.date) return false;
  const raceDate = new Date(race.date + 'T' + (race.time || '00:00:00'));
  raceDate.setHours(raceDate.getHours() + 2);
  return new Date() > raceDate;
};

// ── ปุ่ม "ดูผลการแข่งขัน" : FP1 + 1 ชั่วโมง ────────────────────────────────
const hasResultBtn = (race) => {
  const fp1 = race?.FirstPractice;
  if (!fp1?.date) return false;
  const fp1Date = new Date(fp1.date + 'T' + (fp1.time || '00:00:00'));
  fp1Date.setHours(fp1Date.getHours() + 1);
  return new Date() > fp1Date;
};

const isNext = (races, index) => {
  for (let i = 0; i < races.length; i++) {
    if (!isPast(races[i])) return i === index;
  }
  return false;
};

/* ─────────────────────────────────────────
   SCHEDULE
───────────────────────────────────────── */
const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    jolpicaApi.getSchedule(2026)
      .then(setSchedule)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRaces = schedule.length;
  const pastCount  = schedule.filter(r => isPast(r)).length;

  const buildSessions = (race) => {
    const rows = [];
    if (race.FirstPractice)
      rows.push({ label: 'FP1', session: race.FirstPractice });
    if (race.SecondPractice) {
      const isSprint = !!race.Sprint;
      rows.push({ label: isSprint ? 'Sprint Quali' : 'FP2', session: race.SecondPractice, highlight: isSprint });
    }
    if (race.ThirdPractice)
      rows.push({ label: 'FP3', session: race.ThirdPractice });
    if (race.SprintQualifying)
      rows.push({ label: 'Sprint Quali', session: race.SprintQualifying, highlight: true });
    if (race.Sprint)
      rows.push({ label: 'Sprint', session: race.Sprint, highlight: true });
    if (race.Qualifying)
      rows.push({ label: 'Qualifying', session: race.Qualifying });
    rows.push({ label: 'Race', session: { date: race.date, time: race.time }, isRace: true });
    return rows;
  };

  return (
    <div className="f1-schedule-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="sp-loading">
          <div className="sp-bar-track"><div className="sp-bar-fill" /></div>
          <p className="sp-load-txt">Loading Schedule</p>
        </div>
      ) : (
        <div className="sp-wrap">
          <div className="sp-grid-bg" />
          <div className="sp-glow" />
          <div className="sp-inner">

            {/* Header */}
            <header className="sp-hd">
              <div className="sp-eyebrow">
                <Calendar size={12} color="#e10600" />
                <p className="sp-eyebrow-txt">Formula 1 Championship</p>
                <div className="sp-eyebrow-line" />
              </div>
              <h1 className="sp-title">
                ตารางแข่ง <em>F1</em>
                <span className="sp-badge">2026</span>
              </h1>
              <div className="sp-subtitle">
                <span>{totalRaces} สนาม</span>
                <span>•</span>
                <span>จบแล้ว {pastCount} สนาม</span>
                <span>•</span>
                <span>เหลืออีก {totalRaces - pastCount} สนาม</span>
              </div>
              <div className="sp-ghost-num">{totalRaces}</div>
            </header>

            {/* Race List */}
            <div className="sp-list">
              {schedule.map((race, index) => {
                const past       = isPast(race);
                const showBtn    = hasResultBtn(race);
                const next       = isNext(schedule, index);
                const isSprint = !!(race.Sprint);
                const raceSession = fmtSession({ date: race.date, time: race.time });
                const sessions = buildSessions(race);
                const laps = TOTAL_LAPS[race.Circuit?.circuitId];
                const flagUrl = getCountryFlagUrl(race.Circuit?.Location?.country);

                return (
                  <div
                    key={race.round}
                    className={`sp-card${past ? ' past' : ''}${next ? ' next' : ''}`}
                  >
                    <div className="sp-card-bar" />
                    <div className="sp-card-ghost">{String(race.round).padStart(2, '0')}</div>

                    <div className="sp-card-inner">
                      {/* LEFT */}
                      <div>
                        <div className="sp-race-top">
                          <span className="sp-round-pill">Round {race.round}</span>
                          {isSprint && <span className="sp-sprint-pill">🏃 Sprint</span>}
                          {past  && <span className="sp-past-pill">จบแล้ว</span>}
                          {next  && <span className="sp-next-pill">▶ ถัดไป</span>}
                        </div>

                        {/* Race name + flag */}
                        <div className="sp-race-name-row">
                          {flagUrl && (
                            <img
                              className="sp-flag"
                              src={flagUrl}
                              alt={race.Circuit?.Location?.country}
                              title={race.Circuit?.Location?.country}
                            />
                          )}
                          <h2 className="sp-race-name">{race.raceName}</h2>
                        </div>

                        <div className="sp-circuit-row">
                          <MapPin size={12} />
                          <span>
                            {race.Circuit?.circuitName}
                            {race.Circuit?.Location?.locality ? `, ${race.Circuit.Location.locality}` : ''}
                            {race.Circuit?.Location?.country  ? `, ${race.Circuit.Location.country}`  : ''}
                          </span>
                        </div>

                        <div className="sp-race-datetime">
                          <Calendar size={13} color="rgba(255,255,255,0.3)" />
                          <span className="sp-race-date-main">{raceSession.dateStr}</span>
                          {race.time && (
                            <>
                              <Clock size={13} color="rgba(255,255,255,0.3)" />
                              <span className="sp-race-time-main">{raceSession.timeStr}</span>
                            </>
                          )}
                        </div>

                        {/* Links + Result button */}
                        <div className="sp-links">
                          {race.Circuit?.url && (
                            <a href={race.Circuit.url} target="_blank" rel="noopener noreferrer" className="sp-link">
                              ข้อมูลสนาม <ChevronRight size={12} />
                            </a>
                          )}
                          {race.Circuit?.Location?.lat && race.Circuit?.Location?.long && (
                            <a
                              href={`https://www.google.com/maps?q=${race.Circuit.Location.lat},${race.Circuit.Location.long}`}
                              target="_blank" rel="noopener noreferrer" className="sp-link"
                            >
                              ดูบน Maps <ChevronRight size={12} />
                            </a>
                          )}

                          {/* ปุ่ม "ดูผลการแข่งขัน" → FP1 + 1 ชั่วโมง */}
                          {showBtn && (
                            <button
                              className="sp-result-btn"
                              onClick={() => navigate(`/results/2026/${toSlug(race.raceName)}`)}
                            >
                              <BarChart2 size={12} />
                              ดูผลการแข่งขัน
                            </button>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: Sessions */}
                      <div className="sp-sessions">
                        <p className="sp-sessions-title">รอบการแข่งขัน</p>

                        {sessions.map((s, i) => {
                          const { dateStr, timeStr } = fmtSession(s.session);
                          return (
                            <div
                              key={i}
                              className={`sp-session-row${s.isRace ? ' race-row' : ''}`}
                            >
                              <span
                                className="sp-session-label"
                                style={s.highlight ? { color: '#ff9f00' } : {}}
                              >
                                {s.label}
                              </span>
                              <span className="sp-session-date">{dateStr}</span>
                              <span className="sp-session-time">{timeStr}</span>
                            </div>
                          );
                        })}

                        {laps && (
                          <div className="sp-laps-row">
                            <span className="sp-laps-label">จำนวนรอบ</span>
                            <span className="sp-laps-val">{laps} รอบ</span>
                          </div>
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

export default Schedule;