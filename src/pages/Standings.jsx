import { useState, useEffect } from 'react';
import { Trophy, Users, Flag, ChevronRight } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-standings-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-standings-page *, .f1-standings-page *::before, .f1-standings-page *::after {
    box-sizing: border-box;
  }

  /* ── WRAPPER ─────────────────────────── */
  .f1-standings-page .st-wrap {
    background: #0a0a0c;
    position: relative;
    overflow: hidden;
    min-height: 60vh;
  }
  .f1-standings-page .st-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }
  .f1-standings-page .st-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-standings-page .st-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* ── HEADER ──────────────────────────── */
  .f1-standings-page .st-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-standings-page .st-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-standings-page .st-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-standings-page .st-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-standings-page .st-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .f1-standings-page .st-title em { font-style: italic; color: #e10600; }
  .f1-standings-page .st-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-standings-page .st-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .f1-standings-page .st-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem; vertical-align: middle;
  }

  /* ── TABS ─────────────────────────────── */
  .f1-standings-page .st-tabs {
    display: flex; gap: 2px; margin-bottom: 2px;
  }
  .f1-standings-page .st-tab {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.75rem 1.75rem; border: none; cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    border-bottom: 2px solid transparent;
  }
  .f1-standings-page .st-tab-inactive {
    background: #111114; color: rgba(255,255,255,0.35);
    border-bottom-color: transparent;
  }
  .f1-standings-page .st-tab-inactive:hover {
    background: #17171c; color: rgba(255,255,255,0.65);
  }
  .f1-standings-page .st-tab-active {
    background: #111114; color: #e10600;
    border-bottom-color: #e10600;
  }

  /* ── TABLE CONTAINER ─────────────────── */
  .f1-standings-page .st-table-wrap {
    border: 1px solid rgba(255,255,255,0.05);
    overflow: hidden;
    animation: st-rise 0.4s ease both;
  }
  .f1-standings-page .st-table {
    width: 100%; border-collapse: collapse;
  }

  /* ── TABLE HEAD ──────────────────────── */
  .f1-standings-page .st-thead tr {
    background: #e10600;
  }
  .f1-standings-page .st-thead th {
    padding: 1rem 1.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.85); text-align: left;
    white-space: nowrap;
  }
  .f1-standings-page .st-thead th.center { text-align: center; }

  /* ── TABLE ROWS ──────────────────────── */
  .f1-standings-page .st-row {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s ease;
    animation: st-rise 0.4s ease both;
  }
  .f1-standings-page .st-row:last-child { border-bottom: none; }
  .f1-standings-page .st-row:hover { background: #17171c; }
  .f1-standings-page .st-row-podium { background: rgba(255,255,255,0.025); }

  /* Staggered row animations */
  .f1-standings-page .st-row:nth-child(1)  { animation-delay: 0.04s }
  .f1-standings-page .st-row:nth-child(2)  { animation-delay: 0.08s }
  .f1-standings-page .st-row:nth-child(3)  { animation-delay: 0.12s }
  .f1-standings-page .st-row:nth-child(4)  { animation-delay: 0.16s }
  .f1-standings-page .st-row:nth-child(5)  { animation-delay: 0.20s }
  .f1-standings-page .st-row:nth-child(6)  { animation-delay: 0.24s }
  .f1-standings-page .st-row:nth-child(7)  { animation-delay: 0.28s }
  .f1-standings-page .st-row:nth-child(8)  { animation-delay: 0.32s }
  .f1-standings-page .st-row:nth-child(9)  { animation-delay: 0.36s }
  .f1-standings-page .st-row:nth-child(10) { animation-delay: 0.40s }
  .f1-standings-page .st-row:nth-child(11) { animation-delay: 0.44s }
  .f1-standings-page .st-row:nth-child(12) { animation-delay: 0.48s }
  .f1-standings-page .st-row:nth-child(13) { animation-delay: 0.52s }
  .f1-standings-page .st-row:nth-child(14) { animation-delay: 0.56s }
  .f1-standings-page .st-row:nth-child(15) { animation-delay: 0.60s }
  .f1-standings-page .st-row:nth-child(16) { animation-delay: 0.64s }
  .f1-standings-page .st-row:nth-child(17) { animation-delay: 0.68s }
  .f1-standings-page .st-row:nth-child(18) { animation-delay: 0.72s }
  .f1-standings-page .st-row:nth-child(19) { animation-delay: 0.76s }
  .f1-standings-page .st-row:nth-child(20) { animation-delay: 0.80s }

  .f1-standings-page .st-td {
    padding: 1.1rem 1.5rem;
    font-size: 0.88rem;
    color: rgba(255,255,255,0.75);
    vertical-align: middle;
  }
  .f1-standings-page .st-td.center { text-align: center; }

  /* Position cell */
  .f1-standings-page .st-pos {
    display: flex; align-items: center; gap: 0.6rem;
  }
  .f1-standings-page .st-pos-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.6rem; font-weight: 900; line-height: 1;
    min-width: 2rem;
  }
  .f1-standings-page .st-pos-num.gold   { color: #f5c518; }
  .f1-standings-page .st-pos-num.silver { color: #b0b8c1; }
  .f1-standings-page .st-pos-num.bronze { color: #cd7f32; }
  .f1-standings-page .st-pos-num.normal { color: rgba(255,255,255,0.65); }

  /* Left accent bar for podium rows */
  .f1-standings-page .st-row-1 { border-left: 2px solid #f5c518; }
  .f1-standings-page .st-row-2 { border-left: 2px solid #b0b8c1; }
  .f1-standings-page .st-row-3 { border-left: 2px solid #cd7f32; }

  /* Driver name */
  .f1-standings-page .st-driver-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.15rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.02em;
    line-height: 1; color: #ffffff; margin: 0 0 0.2rem; padding: 0;
  }
  .f1-standings-page .st-driver-name span { color: #e10600; }
  .f1-standings-page .st-nat {
    font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.28);
    font-weight: 500;
  }

  /* Team name */
  .f1-standings-page .st-team-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: rgba(255,255,255,0.6);
  }

  /* Points */
  .f1-standings-page .st-pts {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.6rem; font-weight: 900;
    color: #e10600; line-height: 1;
  }
  .f1-standings-page .st-pts-label {
    font-size: 0.62rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.2);
    font-weight: 600; display: block; margin-top: 0.1rem;
  }

  /* Wins */
  .f1-standings-page .st-wins {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4rem; font-weight: 900;
    color: #ffffff; line-height: 1;
  }

  /* Constructor name cell */
  .f1-standings-page .st-constructor-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.2rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.03em;
    color: #e10600;
  }

  /* ── LOADING ─────────────────────────── */
  .f1-standings-page .st-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-standings-page .st-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-standings-page .st-bar-fill {
    height: 100%; background: #e10600; border-radius: 2px;
    animation: st-slide 1.2s ease-in-out infinite;
  }
  .f1-standings-page .st-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  @keyframes st-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes st-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const posClass = (pos) => {
  if (pos === '1') return 'gold';
  if (pos === '2') return 'silver';
  if (pos === '3') return 'bronze';
  return 'normal';
};

const Standings = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const [drivers, constructors] = await Promise.all([
        jolpicaApi.getDriverStandings(2026),
        jolpicaApi.getConstructorStandings(2026),
      ]);
      setDriverStandings(drivers);
      setConstructorStandings(constructors);
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="f1-standings-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="st-loading">
          <div className="st-bar-track"><div className="st-bar-fill" /></div>
          <p className="st-load-txt">Loading Standings</p>
        </div>
      ) : (
        <div className="st-wrap">
          <div className="st-grid-bg" />
          <div className="st-glow" />
          <div className="st-inner">

            {/* Header */}
            <header className="st-hd">
              <div className="st-eyebrow">
                <Trophy size={12} color="#e10600" />
                <p className="st-eyebrow-txt">Formula 1 Championship</p>
                <div className="st-eyebrow-line" />
              </div>
              <h1 className="st-title">
                ตาราง<em>คะแนน</em>
                <span className="st-badge">2026</span>
              </h1>
              <div className="st-subtitle">
                <span>ฤดูกาล 2026</span>
                <span>•</span>
                <span>{activeTab === 'drivers' ? `${driverStandings.length} นักแข่ง` : `${constructorStandings.length} ทีม`}</span>
              </div>
              <div className="st-ghost-num">PTS</div>
            </header>

            {/* Tabs */}
            <div className="st-tabs">
              <button
                className={`st-tab ${activeTab === 'drivers' ? 'st-tab-active' : 'st-tab-inactive'}`}
                onClick={() => setActiveTab('drivers')}
              >
                <Users size={14} />
                นักแข่ง
              </button>
              <button
                className={`st-tab ${activeTab === 'constructors' ? 'st-tab-active' : 'st-tab-inactive'}`}
                onClick={() => setActiveTab('constructors')}
              >
                <Flag size={14} />
                ทีม
              </button>
            </div>

            {/* Driver Standings */}
            {activeTab === 'drivers' && (
              <div className="st-table-wrap">
                <table className="st-table">
                  <thead className="st-thead">
                    <tr>
                      <th>อันดับ</th>
                      <th>นักแข่ง</th>
                      <th>ทีม</th>
                      <th className="center">คะแนน</th>
                      <th className="center">ชนะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((standing, index) => (
                      <tr
                        key={standing.Driver.driverId}
                        className={`st-row ${index === 0 ? 'st-row-1' : index === 1 ? 'st-row-2' : index === 2 ? 'st-row-3' : ''} ${index < 3 ? 'st-row-podium' : ''}`}
                      >
                        <td className="st-td">
                          <div className="st-pos">
                            <span className={`st-pos-num ${posClass(standing.position)}`}>
                              {standing.position}
                            </span>
                            {index < 3 && (
                              <Trophy
                                size={14}
                                color={
                                  standing.position === '1' ? '#f5c518' :
                                  standing.position === '2' ? '#b0b8c1' : '#cd7f32'
                                }
                              />
                            )}
                          </div>
                        </td>
                        <td className="st-td">
                          <p className="st-driver-name">
                            {standing.Driver.givenName}{' '}
                            <span>{standing.Driver.familyName}</span>
                          </p>
                          <span className="st-nat">{standing.Driver.nationality}</span>
                        </td>
                        <td className="st-td">
                          <span className="st-team-name">{standing.Constructors[0].name}</span>
                        </td>
                        <td className="st-td center">
                          <span className="st-pts">{standing.points}</span>
                          <span className="st-pts-label">pts</span>
                        </td>
                        <td className="st-td center">
                          <span className="st-wins">{standing.wins}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Constructor Standings */}
            {activeTab === 'constructors' && (
              <div className="st-table-wrap">
                <table className="st-table">
                  <thead className="st-thead">
                    <tr>
                      <th>อันดับ</th>
                      <th>ทีม</th>
                      <th>สัญชาติ</th>
                      <th className="center">คะแนน</th>
                      <th className="center">ชนะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constructorStandings.map((standing, index) => (
                      <tr
                        key={standing.Constructor.constructorId}
                        className={`st-row ${index === 0 ? 'st-row-1' : index === 1 ? 'st-row-2' : index === 2 ? 'st-row-3' : ''} ${index < 3 ? 'st-row-podium' : ''}`}
                      >
                        <td className="st-td">
                          <div className="st-pos">
                            <span className={`st-pos-num ${posClass(standing.position)}`}>
                              {standing.position}
                            </span>
                            {index < 3 && (
                              <Trophy
                                size={14}
                                color={
                                  standing.position === '1' ? '#f5c518' :
                                  standing.position === '2' ? '#b0b8c1' : '#cd7f32'
                                }
                              />
                            )}
                          </div>
                        </td>
                        <td className="st-td">
                          <span className="st-constructor-name">{standing.Constructor.name}</span>
                        </td>
                        <td className="st-td">
                          <span className="st-nat" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
                            {standing.Constructor.nationality}
                          </span>
                        </td>
                        <td className="st-td center">
                          <span className="st-pts">{standing.points}</span>
                          <span className="st-pts-label">pts</span>
                        </td>
                        <td className="st-td center">
                          <span className="st-wins">{standing.wins}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Standings;
