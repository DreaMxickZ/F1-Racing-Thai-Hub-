import { useState, useEffect } from 'react';
import { Users, Flag, ChevronRight } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';
import { supabase } from '../config/supabase';

// Scoped CSS — same design language as Teams page
// All selectors under .f1-drivers-page to prevent Navbar leaks
const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-drivers-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-drivers-page *, .f1-drivers-page *::before, .f1-drivers-page *::after {
    box-sizing: border-box;
  }

  /* Wrapper */
  .f1-drivers-page .dp-wrap {
    background: #0a0a0c;
    position: relative;
    overflow: hidden;
    min-height: 60vh;
  }
  .f1-drivers-page .dp-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }
  .f1-drivers-page .dp-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-drivers-page .dp-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* ── HEADER ──────────────────────────── */
  .f1-drivers-page .dp-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-drivers-page .dp-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-drivers-page .dp-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-drivers-page .dp-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-drivers-page .dp-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .f1-drivers-page .dp-title em { font-style: italic; color: #e10600; }
  .f1-drivers-page .dp-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-drivers-page .dp-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .f1-drivers-page .dp-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem; vertical-align: middle;
  }

  /* ── GRID ─────────────────────────────── */
  .f1-drivers-page .dp-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 2px;
  }

  /* ── CARD ─────────────────────────────── */
  .f1-drivers-page .dp-card {
    background: #111114; position: relative;
    overflow: hidden; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.3s ease, transform 0.3s ease;
    animation: dp-rise 0.4s ease both;
    display: flex; flex-direction: column;
  }
  .f1-drivers-page .dp-card:hover { background: #17171c; transform: translateY(-3px); z-index: 2; }

  /* Staggered animation delays */
  .f1-drivers-page .dp-card:nth-child(1)  { animation-delay: 0.03s }
  .f1-drivers-page .dp-card:nth-child(2)  { animation-delay: 0.06s }
  .f1-drivers-page .dp-card:nth-child(3)  { animation-delay: 0.09s }
  .f1-drivers-page .dp-card:nth-child(4)  { animation-delay: 0.12s }
  .f1-drivers-page .dp-card:nth-child(5)  { animation-delay: 0.15s }
  .f1-drivers-page .dp-card:nth-child(6)  { animation-delay: 0.18s }
  .f1-drivers-page .dp-card:nth-child(7)  { animation-delay: 0.21s }
  .f1-drivers-page .dp-card:nth-child(8)  { animation-delay: 0.24s }
  .f1-drivers-page .dp-card:nth-child(9)  { animation-delay: 0.27s }
  .f1-drivers-page .dp-card:nth-child(10) { animation-delay: 0.30s }
  .f1-drivers-page .dp-card:nth-child(11) { animation-delay: 0.33s }
  .f1-drivers-page .dp-card:nth-child(12) { animation-delay: 0.36s }
  .f1-drivers-page .dp-card:nth-child(13) { animation-delay: 0.39s }
  .f1-drivers-page .dp-card:nth-child(14) { animation-delay: 0.42s }
  .f1-drivers-page .dp-card:nth-child(15) { animation-delay: 0.45s }
  .f1-drivers-page .dp-card:nth-child(16) { animation-delay: 0.48s }
  .f1-drivers-page .dp-card:nth-child(17) { animation-delay: 0.51s }
  .f1-drivers-page .dp-card:nth-child(18) { animation-delay: 0.54s }
  .f1-drivers-page .dp-card:nth-child(19) { animation-delay: 0.57s }
  .f1-drivers-page .dp-card:nth-child(20) { animation-delay: 0.60s }

  /* Accent top bar (shows on hover) */
  .f1-drivers-page .dp-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .f1-drivers-page .dp-card:hover .dp-card-bar { opacity: 1; }

  /* Ghost driver number background */
  .f1-drivers-page .dp-card-ghost-num {
    position: absolute; bottom: -1rem; right: -0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 8rem; font-weight: 900; color: rgba(255,255,255,0.03);
    line-height: 1; pointer-events: none; user-select: none;
    transition: color 0.3s ease;
  }
  .f1-drivers-page .dp-card:hover .dp-card-ghost-num { color: rgba(255,255,255,0.055); }

  /* Driver photo area */
  .f1-drivers-page .dp-photo {
    position: relative;
    height: 300px;
    background: linear-gradient(135deg, #16161a 0%, #0f0f12 100%);
    overflow: hidden;
    flex-shrink: 0;
  }
  .f1-drivers-page .dp-photo img {
    width: 100%; height: 100%; object-fit: cover; object-position: top center;
    filter: saturate(0.9);
    transition: transform 0.4s ease, filter 0.3s ease;
  }
  .f1-drivers-page .dp-card:hover .dp-photo img {
    transform: scale(1.04);
    filter: saturate(1);
  }
  .f1-drivers-page .dp-photo-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
  }
  /* Gradient overlay on photo bottom */
  .f1-drivers-page .dp-photo-fade {
    position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
    background: linear-gradient(transparent, #111114);
    pointer-events: none;
  }
  /* Driver number pill on photo */
  .f1-drivers-page .dp-num-pill {
    position: absolute; top: 1rem; right: 1rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.5rem; font-weight: 900;
    width: 52px; height: 52px; border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    color: #ffffff; letter-spacing: -0.02em;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  }

  /* Card body */
  .f1-drivers-page .dp-card-body {
    padding: 1.5rem 1.75rem 1.75rem;
    position: relative; z-index: 1; flex: 1;
    display: flex; flex-direction: column;
  }

  .f1-drivers-page .dp-driver-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.7rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.01em; line-height: 1;
    color: #ffffff; margin: 0 0 0.15rem; padding: 0;
  }
  .f1-drivers-page .dp-driver-name span { color: #e10600; }

  .f1-drivers-page .dp-meta {
    display: flex; flex-direction: column; gap: 0.35rem;
    margin-top: 0.75rem;
  }
  .f1-drivers-page .dp-meta-row {
    display: flex; align-items: center; gap: 0.45rem;
    font-size: 0.8rem; color: rgba(255,255,255,0.38);
    text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;
  }
  .f1-drivers-page .dp-team-tag {
    display: inline-block;
    margin-top: 0.75rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: #ffffff;
    padding: 0.3rem 0.75rem;
    border-left: 2px solid #e10600;
    background: rgba(225,6,0,0.08);
  }

  /* Car image strip */
  .f1-drivers-page .dp-car {
    margin-top: 1.25rem;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 2px;
    padding: 0.75rem 1rem;
    overflow: hidden;
  }
  .f1-drivers-page .dp-car img {
    width: 100%; height: 80px; object-fit: contain;
    filter: saturate(0.85);
    transition: filter 0.3s ease, transform 0.3s ease;
  }
  .f1-drivers-page .dp-card:hover .dp-car img {
    filter: saturate(1);
    transform: scale(1.03);
  }

  /* Footer link */
  .f1-drivers-page .dp-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.73rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; text-decoration: none; transition: gap 0.2s ease;
    margin-top: auto; padding-top: 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.07);
    width: 100%;
  }
  .f1-drivers-page .dp-link:hover { gap: 0.6rem; }

  /* ── LOADING ─────────────────────────── */
  .f1-drivers-page .dp-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-drivers-page .dp-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-drivers-page .dp-bar-fill {
    height: 100%; background: #e10600; border-radius: 2px;
    animation: dp-slide 1.2s ease-in-out infinite;
  }
  .f1-drivers-page .dp-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  @keyframes dp-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes dp-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [driverDetails, setDriverDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const apiDrivers = await jolpicaApi.getDrivers(2026);

      const { data: dbDrivers } = await supabase
        .from('drivers')
        .select('*');

      const detailsMap = {};
      if (dbDrivers) {
        dbDrivers.forEach(driver => {
          detailsMap[driver.driver_id] = driver;
        });
      }

      const sortedDrivers = [...apiDrivers].sort((a, b) => {
        const numA = detailsMap[a.driverId]?.number ?? detailsMap[a.driverId]?.permanentNumber ?? a.permanentNumber ?? 9999;
        const numB = detailsMap[b.driverId]?.number ?? detailsMap[b.driverId]?.permanentNumber ?? b.permanentNumber ?? 9999;
        return Number(numA) - Number(numB);
      });

      setDrivers(sortedDrivers);
      setDriverDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="f1-drivers-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="dp-loading">
          <div className="dp-bar-track"><div className="dp-bar-fill" /></div>
          <p className="dp-load-txt">Loading Drivers</p>
        </div>
      ) : (
        <div className="dp-wrap">
          <div className="dp-grid-bg" />
          <div className="dp-glow" />
          <div className="dp-inner">

            {/* Header */}
            <header className="dp-hd">
              <div className="dp-eyebrow">
                <Users size={12} color="#e10600" />
                <p className="dp-eyebrow-txt">Formula 1 Championship</p>
                <div className="dp-eyebrow-line" />
              </div>
              <h1 className="dp-title">
                นักแข่ง <em>F1</em>
                <span className="dp-badge">2026</span>
              </h1>
              <div className="dp-subtitle">
                <span>{drivers.length} นักแข่ง</span>
                <span>•</span>
                <span>ฤดูกาล 2026</span>
              </div>
              <div className="dp-ghost-num">{drivers.length}</div>
            </header>

            {/* Driver Cards */}
            <div className="dp-cards">
              {drivers.map((driver) => {
                const details = driverDetails[driver.driverId] || {};
                // Use team color if available, fallback to f1 red
                const accent = details.team_color || '#e10600';
                const driverNum = details.number || driver.permanentNumber;

                return (
                  <div key={driver.driverId} className="dp-card">
                    {/* Accent bar on hover */}
                    <div className="dp-card-bar" style={{ background: accent }} />

                    {/* Photo */}
                    <div className="dp-photo">
                      {details.image_url ? (
                        <img
                          src={details.image_url}
                          alt={`${driver.givenName} ${driver.familyName}`}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="dp-photo-placeholder">
                          <Users size={64} color="rgba(255,255,255,0.1)" />
                        </div>
                      )}
                      <div className="dp-photo-fade" />

                      {/* Driver number badge */}
                      {driverNum && (
                        <div
                          className="dp-num-pill"
                          style={{ background: accent }}
                        >
                          {driverNum}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="dp-card-body">
                      {/* Ghost number behind content */}
                      {driverNum && (
                        <div className="dp-card-ghost-num">{driverNum}</div>
                      )}

                      <h2 className="dp-driver-name">
                        {driver.givenName}{' '}
                        <span>{driver.familyName}</span>
                      </h2>

                      <div className="dp-meta">
                        <div className="dp-meta-row">
                          <Flag size={12} />
                          <span>{driver.nationality}</span>
                        </div>
                        {driver.dateOfBirth && (
                          <div className="dp-meta-row">
                            <span>เกิด:</span>
                            <span>
                              {new Date(driver.dateOfBirth).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {details.team && (
                        <div
                          className="dp-team-tag"
                          style={{ borderLeftColor: accent, background: `${accent}18` }}
                        >
                          {details.team}
                        </div>
                      )}

                      {/* Car image */}
                      {details.car_image_url && (
                        <div className="dp-car">
                          <img
                            src={details.car_image_url}
                            alt={`${driver.familyName}'s car`}
                          />
                        </div>
                      )}

                      {/* Wiki link */}
                      {driver.url && (
                        <a
                          href={driver.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dp-link"
                        >
                          ดูข้อมูลเพิ่มเติม
                          <ChevronRight size={13} />
                        </a>
                      )}
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

export default Drivers;