import { useState, useEffect } from 'react';
import { Activity, ChevronRight, Flag } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';
import RaceResult from './RaceResult';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-results-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-results-page *, .f1-results-page *::before, .f1-results-page *::after {
    box-sizing: border-box;
  }

  .f1-results-page .rs-wrap {
    background: #0a0a0c; min-height: 80vh;
    position: relative; overflow: hidden;
  }
  .f1-results-page .rs-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .f1-results-page .rs-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-results-page .rs-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 5rem; position: relative; z-index: 1;
  }

  /* Header */
  .f1-results-page .rs-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-results-page .rs-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-results-page .rs-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; line-height: 1;
  }
  .f1-results-page .rs-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-results-page .rs-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0;
  }
  .f1-results-page .rs-title em { font-style: italic; color: #e10600; }
  .f1-results-page .rs-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem;
  }
  .f1-results-page .rs-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-results-page .rs-ghost {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; user-select: none; pointer-events: none;
  }

  /* Race list */
  .f1-results-page .rs-list {
    display: flex; flex-direction: column; gap: 2px;
  }
  .f1-results-page .rs-item {
    background: #111114; border: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.75rem; cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
    animation: rs-rise 0.4s ease both;
    position: relative; overflow: hidden;
  }
  .f1-results-page .rs-item:hover { background: #17171c; transform: translateX(4px); }

  .f1-results-page .rs-item:nth-child(1)  { animation-delay: 0.03s }
  .f1-results-page .rs-item:nth-child(2)  { animation-delay: 0.06s }
  .f1-results-page .rs-item:nth-child(3)  { animation-delay: 0.09s }
  .f1-results-page .rs-item:nth-child(4)  { animation-delay: 0.12s }
  .f1-results-page .rs-item:nth-child(5)  { animation-delay: 0.15s }

  .f1-results-page .rs-item-bar {
    position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: #e10600; opacity: 0; transition: opacity 0.25s ease;
  }
  .f1-results-page .rs-item:hover .rs-item-bar { opacity: 1; }

  .f1-results-page .rs-item-left {
    display: flex; align-items: center; gap: 1.5rem;
  }
  .f1-results-page .rs-round {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.8rem; font-weight: 900; color: rgba(255,255,255,0.08);
    min-width: 2.5rem; line-height: 1;
  }
  .f1-results-page .rs-race-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.1rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.02em; color: #fff; margin: 0 0 0.2rem;
  }
  .f1-results-page .rs-circuit {
    font-size: 0.75rem; color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .f1-results-page .rs-date {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.25); text-transform: uppercase;
    white-space: nowrap;
  }
  .f1-results-page .rs-arrow {
    color: rgba(255,255,255,0.2);
    transition: color 0.25s ease, transform 0.25s ease;
  }
  .f1-results-page .rs-item:hover .rs-arrow {
    color: #e10600; transform: translateX(3px);
  }

  /* No results yet */
  .f1-results-page .rs-empty {
    text-align: center; padding: 5rem 2rem;
    border: 1px solid rgba(255,255,255,0.05); background: #111114;
    animation: rs-rise 0.5s ease both;
  }
  .f1-results-page .rs-empty-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 8rem; font-weight: 900;
    color: rgba(255,255,255,0.04); line-height: 1; user-select: none;
  }
  .f1-results-page .rs-empty-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.5rem; font-weight: 900; text-transform: uppercase;
    color: rgba(255,255,255,0.12); margin: 0 0 0.5rem;
  }
  .f1-results-page .rs-empty-sub {
    font-size: 0.82rem; color: rgba(255,255,255,0.2);
  }

  /* Loading */
  .f1-results-page .rs-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-results-page .rs-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-results-page .rs-bar-fill {
    height: 100%; background: #e10600;
    animation: rs-slide 1.2s ease-in-out infinite;
  }
  .f1-results-page .rs-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0;
  }

  @keyframes rs-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes rs-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Results = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState(null);

  useEffect(() => {
    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    try {
      const schedule = await jolpicaApi.getSchedule(2026);
      const today = new Date();
      const completed = schedule.filter(race => {
  const raceDate = new Date(race.date + 'T' + (race.time || '23:59:59'));
  const showFrom = new Date(raceDate);
  showFrom.setDate(showFrom.getDate() - 2); // แสดงก่อน 2 วัน
  return showFrom < today;
});
      setRaces(completed);
    } catch (error) {
      console.error('Error fetching races:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Show RaceResult when a race is selected ──
  if (selectedRace) {
    return (
      <RaceResult
        race={selectedRace}
        season={2026}
        onBack={() => setSelectedRace(null)}
      />
    );
  }

  return (
    <div className="f1-results-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="rs-loading">
          <div className="rs-bar-track"><div className="rs-bar-fill" /></div>
          <p className="rs-load-txt">Loading Results</p>
        </div>
      ) : (
        <div className="rs-wrap">
          <div className="rs-grid-bg" />
          <div className="rs-glow" />
          <div className="rs-inner">

            <header className="rs-hd">
              <div className="rs-eyebrow">
                <Activity size={12} color="#e10600" />
                <p className="rs-eyebrow-txt">Formula 1 Championship</p>
                <div className="rs-eyebrow-line" />
              </div>
              <h1 className="rs-title">
                ผลการ<em>แข่งขัน</em>
                <span className="rs-badge">2026</span>
              </h1>
              <div className="rs-subtitle">
                <span>{races.length > 0 ? `${races.length} สนามแข่ง` : 'ยังไม่มีผลการแข่งขัน'}</span>
                <span>•</span>
                <span>ฤดูกาล 2026</span>
              </div>
              <div className="rs-ghost">{races.length || '—'}</div>
            </header>

            {races.length === 0 ? (
              <div className="rs-empty">
                <div className="rs-empty-num">00</div>
                <p className="rs-empty-title">ยังไม่มีผลการแข่งขัน</p>
                <p className="rs-empty-sub">ฤดูกาล 2026 ยังไม่เริ่มต้น หรือยังไม่มีสนามที่แข่งเสร็จสิ้น</p>
              </div>
            ) : (
              <div className="rs-list">
                {races.map((race, i) => (
                  <div
                    key={i}
                    className="rs-item"
                    onClick={() => setSelectedRace(race)}
                  >
                    <div className="rs-item-bar" />
                    <div className="rs-item-left">
                      <span className="rs-round">{String(race.round).padStart(2, '0')}</span>
                      <div>
                        <p className="rs-race-name">{race.raceName}</p>
                        <span className="rs-circuit">{race.Circuit?.circuitName}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span className="rs-date">
                        {new Date(race.date).toLocaleDateString('th-TH', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <ChevronRight size={16} className="rs-arrow" />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Results;