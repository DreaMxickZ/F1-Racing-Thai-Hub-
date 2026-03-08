import { useState, useEffect } from 'react';
import { Flag, ChevronRight } from 'lucide-react';

const MOCK_TEAMS = [
  { constructorId: 'alpine',       name: 'Alpine F1 Team',   nationality: 'French',   url: 'https://en.wikipedia.org/wiki/Alpine_F1_Team' },
  { constructorId: 'aston_martin', name: 'Aston Martin',     nationality: 'British',  url: 'https://en.wikipedia.org/wiki/Aston_Martin_in_Formula_One' },
  { constructorId: 'audi',         name: 'Audi',             nationality: 'German',   url: 'https://en.wikipedia.org/wiki/Audi_in_Formula_One' },
  { constructorId: 'cadillac',     name: 'Cadillac F1 Team', nationality: 'American', url: 'https://en.wikipedia.org/wiki/Cadillac_Formula_1_Team' },
  { constructorId: 'ferrari',      name: 'Ferrari',          nationality: 'Italian',  url: 'https://en.wikipedia.org/wiki/Scuderia_Ferrari' },
  { constructorId: 'haas',         name: 'Haas F1 Team',     nationality: 'American', url: 'https://en.wikipedia.org/wiki/Haas_F1_Team' },
  { constructorId: 'mclaren',      name: 'McLaren',          nationality: 'British',  url: 'https://en.wikipedia.org/wiki/McLaren' },
  { constructorId: 'mercedes',     name: 'Mercedes',         nationality: 'German',   url: 'https://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One' },
  { constructorId: 'red_bull',     name: 'Red Bull Racing',  nationality: 'Austrian', url: 'https://en.wikipedia.org/wiki/Red_Bull_Racing' },
  { constructorId: 'rb',           name: 'Racing Bulls',     nationality: 'Italian',  url: 'https://en.wikipedia.org/wiki/Racing_Bulls' },
  { constructorId: 'williams',     name: 'Williams Racing',  nationality: 'British',  url: 'https://en.wikipedia.org/wiki/Williams_Racing' },
];

const TEAM_LOGOS = {
  mclaren:      'https://upload.wikimedia.org/wikipedia/en/thumb/6/66/McLaren_Racing_logo.svg/200px-McLaren_Racing_logo.svg.png',
  mercedes:     'https://upload.wikimedia.org/wikipedia/commons/f/fc/Mercedes-AMG_Petronas_F1_Team_logo_%282026%29.svg',
  red_bull:     'https://upload.wikimedia.org/wikipedia/en/f/fa/Red_Bull_Racing_Logo_2026.svg',
  ferrari:      'https://upload.wikimedia.org/wikipedia/en/d/df/Scuderia_Ferrari_HP_logo_24.svg',
  williams:     'https://upload.wikimedia.org/wikipedia/commons/1/12/Atlassian_Williams_F1_Team_logo.svg',
  rb:           'https://upload.wikimedia.org/wikipedia/en/2/2b/VCARB_F1_logo.svg',
  aston_martin: 'https://upload.wikimedia.org/wikipedia/en/1/15/Aston_Martin_Aramco_2024_logo.png',
  haas:         'https://upload.wikimedia.org/wikipedia/commons/1/18/TGR_Haas_F1_Team_Logo_%282026%29.svg',
  audi:         'https://upload.wikimedia.org/wikipedia/commons/0/03/Audif1.com_logo17_%28cropped%29.svg',
  alpine:       'https://upload.wikimedia.org/wikipedia/commons/4/4a/BWT_Alpine_F1_Team_Logo.png',
  cadillac:     'https://upload.wikimedia.org/wikipedia/en/b/bc/Cadillac_Formula_1_Team_Logo_%282025%29.svg',
};

const TEAM_COLORS = {
  mclaren: '#FF8000', mercedes: '#00D2BE', red_bull: '#3671C6',
  ferrari: '#E8002D', williams: '#64C4FF', rb: '#6692FF',
  aston_martin: '#229971', haas: '#B6BABD', audi: '#C00000',
  alpine: '#FF87BC', cadillac: '#555555',
};

const NATIONALITY_FLAGS = {
  French: '🇫🇷', British: '🇬🇧', German: '🇩🇪',
  American: '🇺🇸', Italian: '🇮🇹', Austrian: '🇦🇹',
};

// KEY FIX: Every selector is scoped under .f1-teams-page
// This prevents any style from leaking into Navbar or other components.
// We also avoid resetting * globally — only reset inside our scope.
const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-teams-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-teams-page *, .f1-teams-page *::before, .f1-teams-page *::after {
    box-sizing: border-box;
  }

  /* Wrapper */
  .f1-teams-page .tp-wrap {
    background: #0a0a0c;
    position: relative;
    overflow: hidden;
    min-height: 60vh;
  }
  .f1-teams-page .tp-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }
  .f1-teams-page .tp-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-teams-page .tp-inner {
    max-width: 1300px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* Header */
  .f1-teams-page .tp-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-teams-page .tp-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-teams-page .tp-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .f1-teams-page .tp-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-teams-page .tp-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .f1-teams-page .tp-title em { font-style: italic; color: #e10600; }
  .f1-teams-page .tp-subtitle {
    margin-top: 1.25rem; font-size: 0.88rem;
    color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .f1-teams-page .tp-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }
  .f1-teams-page .tp-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem; vertical-align: middle;
  }

  /* Grid */
  .f1-teams-page .tp-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2px;
  }

  /* Card */
  .f1-teams-page .tp-card {
    background: #111114; position: relative; overflow: hidden;
    cursor: pointer; border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.3s ease, transform 0.3s ease;
    animation: tp-rise 0.4s ease both;
  }
  .f1-teams-page .tp-card:hover { background: #17171c; transform: translateY(-3px); z-index: 2; }
  .f1-teams-page .tp-card:nth-child(1)  { animation-delay: 0.04s }
  .f1-teams-page .tp-card:nth-child(2)  { animation-delay: 0.08s }
  .f1-teams-page .tp-card:nth-child(3)  { animation-delay: 0.12s }
  .f1-teams-page .tp-card:nth-child(4)  { animation-delay: 0.16s }
  .f1-teams-page .tp-card:nth-child(5)  { animation-delay: 0.20s }
  .f1-teams-page .tp-card:nth-child(6)  { animation-delay: 0.24s }
  .f1-teams-page .tp-card:nth-child(7)  { animation-delay: 0.28s }
  .f1-teams-page .tp-card:nth-child(8)  { animation-delay: 0.32s }
  .f1-teams-page .tp-card:nth-child(9)  { animation-delay: 0.36s }
  .f1-teams-page .tp-card:nth-child(10) { animation-delay: 0.40s }
  .f1-teams-page .tp-card:nth-child(11) { animation-delay: 0.44s }

  .f1-teams-page .tp-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .f1-teams-page .tp-card:hover .tp-card-bar { opacity: 1; }

  .f1-teams-page .tp-card-num {
    position: absolute; top: 1.2rem; right: 1.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 5rem; font-weight: 900; color: rgba(255,255,255,0.03);
    line-height: 1; pointer-events: none; user-select: none;
    transition: color 0.3s ease;
  }
  .f1-teams-page .tp-card:hover .tp-card-num { color: rgba(255,255,255,0.055); }

  .f1-teams-page .tp-card-body { padding: 2rem; position: relative; z-index: 1; }

  .f1-teams-page .tp-logo { height: 68px; display: flex; align-items: center; margin-bottom: 1.6rem; }
  .f1-teams-page .tp-logo img {
    max-height: 100%; max-width: 210px; object-fit: contain;
    filter: brightness(0.88) saturate(0.85); transition: filter 0.3s ease;
  }
  .f1-teams-page .tp-card:hover .tp-logo img { filter: brightness(1) saturate(1); }
  .f1-teams-page .tp-logo-fallback {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4rem; font-weight: 800; color: rgba(255,255,255,0.18); letter-spacing: 0.05em;
  }

  .f1-teams-page .tp-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.55rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.02em; color: #ffffff; margin: 0 0 0.4rem; line-height: 1; padding: 0;
  }
  .f1-teams-page .tp-nat {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.38);
    text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem;
  }
  .f1-teams-page .tp-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-size: 0.73rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; text-decoration: none; transition: gap 0.2s ease;
    margin-top: 1.5rem; padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.07); width: 100%;
  }
  .f1-teams-page .tp-link:hover { gap: 0.6rem; }

  /* Loading */
  .f1-teams-page .tp-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-teams-page .tp-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-teams-page .tp-bar-fill {
    height: 100%; background: #e10600; border-radius: 2px;
    animation: tp-slide 1.2s ease-in-out infinite;
  }
  .f1-teams-page .tp-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  @keyframes tp-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes tp-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with: jolpicaApi.getConstructors(2026).then(setTeams).finally(() => setLoading(false))
    const t = setTimeout(() => { setTeams(MOCK_TEAMS); setLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="f1-teams-page">
      <style>{SCOPED_CSS}</style>

      {loading ? (
        <div className="tp-loading">
          <div className="tp-bar-track"><div className="tp-bar-fill" /></div>
          <p className="tp-load-txt">Loading Teams</p>
        </div>
      ) : (
        <div className="tp-wrap">
          <div className="tp-grid-bg" />
          <div className="tp-glow" />
          <div className="tp-inner">

            {/* Header */}
            <header className="tp-hd">
              <div className="tp-eyebrow">
                <Flag size={12} color="#e10600" />
                <p className="tp-eyebrow-txt">Formula 1 Championship</p>
                <div className="tp-eyebrow-line" />
              </div>
              <h1 className="tp-title">
                ทีม <em>F1</em>
                <span className="tp-badge">2026</span>
              </h1>
              <div className="tp-subtitle">
                <span>{teams.length} คอนสตรักเตอร์</span>
                <span>•</span>
                <span>ฤดูกาล 2026</span>
              </div>
              <div className="tp-ghost-num">{teams.length}</div>
            </header>

            {/* Cards */}
            <div className="tp-cards">
              {teams.map((team, i) => {
                const accent = TEAM_COLORS[team.constructorId] || '#e10600';
                const flag   = NATIONALITY_FLAGS[team.nationality] || '🏁';
                const logo   = TEAM_LOGOS[team.constructorId];

                return (
                  <div key={team.constructorId} className="tp-card">
                    <div className="tp-card-bar" style={{ background: accent }} />
                    <div className="tp-card-num">{String(i + 1).padStart(2, '0')}</div>

                    <div className="tp-card-body">
                      <div className="tp-logo">
                        {logo && (
                          <img
                            src={logo}
                            alt={team.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
                            }}
                          />
                        )}
                        <span
                          className="tp-logo-fallback"
                          style={{ display: logo ? 'none' : 'block' }}
                        >
                          {team.name.split(' ').map(w => w[0]).join('')}
                        </span>
                      </div>

                      <h2 className="tp-name">{team.name}</h2>
                      <div className="tp-nat">
                        <span>{flag}</span>
                        <span>{team.nationality}</span>
                      </div>

                      {team.url && (
                        <a
                          href={team.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tp-link"
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

export default Teams;