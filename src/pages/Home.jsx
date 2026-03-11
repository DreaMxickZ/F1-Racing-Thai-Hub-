import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Newspaper, Clock, ArrowRight, Flag, ChevronRight, MapPin, Timer } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';
import { supabase } from '../config/supabase';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-home-page { font-family: 'Barlow', sans-serif; color: #f0f0f0; }
  .f1-home-page *, .f1-home-page *::before, .f1-home-page *::after { box-sizing: border-box; }

  /* Wrapper */
  .f1-home-page .hp-wrap { background: #0a0a0c; position: relative; overflow: hidden; min-height: 60vh; }
  .f1-home-page .hp-grid-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .f1-home-page .hp-glow {
    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
    width: 1000px; height: 600px;
    background: radial-gradient(ellipse,rgba(225,6,0,0.09) 0%,transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-home-page .hp-inner { max-width: 1300px; margin: 0 auto; padding: 0 2rem 5rem; position: relative; z-index: 1; }

  /* ── HERO ───────────────────────────── */
  .f1-home-page .hp-hero {
    padding: 5rem 0 4rem; position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 4rem;
  }
  .f1-home-page .hp-hero-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
  }
  .f1-home-page .hp-hero-eyebrow-txt {
    font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:600;
    letter-spacing:0.25em; text-transform:uppercase; color:#e10600;
    margin:0; padding:0; line-height:1;
  }
  .f1-home-page .hp-hero-line { flex:1; max-width:120px; height:1px; background:linear-gradient(90deg,#e10600,transparent); }
  .f1-home-page .hp-hero-title {
    font-family:'Barlow Condensed',sans-serif;
    font-size: clamp(4rem, 12vw, 9rem); font-weight:900;
    line-height:0.85; text-transform:uppercase; letter-spacing:-0.03em;
    color:#fff; margin:0; padding:0;
  }
  .f1-home-page .hp-hero-title em { font-style:italic; color:#e10600; display:block; }
  .f1-home-page .hp-hero-sub {
    margin-top:1.5rem; font-size:1rem; color:rgba(255,255,255,0.35);
    letter-spacing:0.04em; max-width:480px; line-height:1.6;
  }
  .f1-home-page .hp-hero-badge {
    display:inline-flex; align-items:center;
    background:rgba(225,6,0,0.12); border:1px solid rgba(225,6,0,0.28);
    padding:0.28rem 0.7rem; border-radius:2px;
    font-family:'Barlow Condensed',sans-serif; font-size:0.7rem; font-weight:700;
    letter-spacing:0.15em; color:#e10600; text-transform:uppercase;
    margin-left:1rem; vertical-align:middle;
  }
  .f1-home-page .hp-hero-ghost {
    position:absolute; right:-1rem; bottom:-1.5rem;
    font-family:'Barlow Condensed',sans-serif; font-size:clamp(6rem,20vw,14rem);
    font-weight:900; color:rgba(255,255,255,0.025); line-height:1;
    user-select:none; pointer-events:none; letter-spacing:-0.05em;
  }

  /* ── SECTION HEADER ─────────────────── */
  .f1-home-page .hp-sec-hd {
    display:flex; align-items:baseline; justify-content:space-between;
    margin-bottom:1.5rem; gap:1rem;
  }
  .f1-home-page .hp-sec-title {
    font-family:'Barlow Condensed',sans-serif; font-size:1.6rem; font-weight:900;
    text-transform:uppercase; letter-spacing:0.02em; color:#fff; margin:0; padding:0;
    display:flex; align-items:center; gap:0.6rem;
  }
  .f1-home-page .hp-sec-title em { font-style:italic; color:#e10600; }
  .f1-home-page .hp-sec-link {
    font-size:0.72rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    color:#e10600; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem;
    transition:gap 0.2s ease; white-space:nowrap;
  }
  .f1-home-page .hp-sec-link:hover { gap:0.55rem; }

  /* ── NEXT RACE ──────────────────────── */
  .f1-home-page .hp-next-race {
    background:#111114; border:1px solid rgba(225,6,0,0.2);
    position:relative; overflow:hidden; margin-bottom:4rem;
    animation: hp-rise 0.5s ease both;
  }
  .f1-home-page .hp-next-race::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,rgba(225,6,0,0.05),transparent 60%);
    pointer-events:none;
  }
  .f1-home-page .hp-next-bar { height:2px; background:#e10600; width:100%; }
  .f1-home-page .hp-next-inner { padding:2rem; position:relative; z-index:1; }
  .f1-home-page .hp-next-label {
    font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:700;
    letter-spacing:0.25em; text-transform:uppercase; color:#e10600; margin:0 0 1rem; padding:0;
    display:flex; align-items:center; gap:0.5rem;
  }
  .f1-home-page .hp-next-label span {
    display:inline-block; width:6px; height:6px; border-radius:50%; background:#e10600;
    animation: hp-blink 1.5s ease-in-out infinite;
  }
  .f1-home-page .hp-next-content {
    display:grid; grid-template-columns:1fr auto; gap:1.5rem; align-items:end;
  }
  .f1-home-page .hp-next-name {
    font-family:'Barlow Condensed',sans-serif; font-size:2.2rem; font-weight:900;
    text-transform:uppercase; letter-spacing:-0.01em; color:#fff;
    margin:0 0 0.5rem; padding:0; line-height:1;
  }
  .f1-home-page .hp-next-meta { display:flex; flex-direction:column; gap:0.35rem; }
  .f1-home-page .hp-next-meta-row {
    display:flex; align-items:center; gap:0.4rem;
    font-size:0.8rem; color:rgba(255,255,255,0.4);
  }
  .f1-home-page .hp-next-date {
    font-family:'Barlow Condensed',sans-serif; text-align:right;
  }
  .f1-home-page .hp-next-date-day {
    font-size:3rem; font-weight:900; color:#fff; line-height:1;
  }
  .f1-home-page .hp-next-date-month {
    font-size:0.75rem; font-weight:600; letter-spacing:0.15em;
    text-transform:uppercase; color:rgba(255,255,255,0.35);
  }
  .f1-home-page .hp-next-ghost {
    position:absolute; right:1rem; top:50%; transform:translateY(-50%);
    font-family:'Barlow Condensed',sans-serif; font-size:8rem; font-weight:900;
    color:rgba(255,255,255,0.025); line-height:1; user-select:none; pointer-events:none;
  }
  .f1-home-page .hp-next-foot {
    margin-top:1.5rem; padding-top:1.25rem;
    border-top:1px solid rgba(255,255,255,0.07);
    display:flex;
  }
  .f1-home-page .hp-btn {
    display:inline-flex; align-items:center; gap:0.4rem;
    font-family:'Barlow Condensed',sans-serif; font-size:0.75rem; font-weight:700;
    letter-spacing:0.15em; text-transform:uppercase;
    color:#fff; background:#e10600; text-decoration:none;
    padding:0.6rem 1.25rem; border-radius:2px;
    transition:background 0.2s ease, gap 0.2s ease;
  }
  .f1-home-page .hp-btn:hover { background:#c00; gap:0.6rem; }

  /* ── NEWS GRID ──────────────────────── */
  .f1-home-page .hp-news-section { margin-bottom:4rem; }
  .f1-home-page .hp-news-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:2px;
  }
  .f1-home-page .hp-news-card {
    background:#111114; border:1px solid rgba(255,255,255,0.05);
    overflow:hidden; display:flex; flex-direction:column;
    text-decoration:none; color:inherit;
    transition:background 0.3s ease, transform 0.3s ease;
    animation:hp-rise 0.4s ease both; position:relative;
  }
  .f1-home-page .hp-news-card:hover { background:#17171c; transform:translateY(-3px); z-index:2; }
  .f1-home-page .hp-news-card:nth-child(1){animation-delay:0.05s}
  .f1-home-page .hp-news-card:nth-child(2){animation-delay:0.10s}
  .f1-home-page .hp-news-card:nth-child(3){animation-delay:0.15s}
  .f1-home-page .hp-news-card-bar { position:absolute; top:0; left:0; right:0; height:2px; background:#e10600; opacity:0; transition:opacity 0.3s ease; }
  .f1-home-page .hp-news-card:hover .hp-news-card-bar { opacity:1; }

  .f1-home-page .hp-news-img { width:100%; aspect-ratio:16/9; object-fit:cover; object-position:top; display:block; filter:saturate(0.8); transition:filter 0.3s ease,transform 0.4s ease; }
  .f1-home-page .hp-news-card:hover .hp-news-img { filter:saturate(1); transform:scale(1.03); }
  .f1-home-page .hp-news-img-wrap { overflow:hidden; }

  .f1-home-page .hp-news-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; }
  .f1-home-page .hp-news-meta {
    display:flex; align-items:center; justify-content:space-between;
    font-size:0.72rem; color:rgba(255,255,255,0.3); margin-bottom:0.75rem; gap:0.5rem;
  }
  .f1-home-page .hp-news-meta span { display:inline-flex; align-items:center; gap:0.3rem; }
  .f1-home-page .hp-news-title {
    font-family:'Barlow Condensed',sans-serif; font-size:1.25rem; font-weight:800;
    text-transform:uppercase; letter-spacing:0.01em; color:#fff; line-height:1.15;
    margin:0 0 0.6rem; padding:0;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
  }
  .f1-home-page .hp-news-excerpt {
    font-size:0.8rem; color:rgba(255,255,255,0.35); line-height:1.6;
    display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
    flex:1; margin-bottom:1rem;
  }
  .f1-home-page .hp-news-readmore {
    display:inline-flex; align-items:center; gap:0.3rem;
    font-size:0.72rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    color:#e10600; margin-top:auto; transition:gap 0.2s ease;
  }
  .f1-home-page .hp-news-card:hover .hp-news-readmore { gap:0.55rem; }

  .f1-home-page .hp-news-empty {
    background:#111114; border:1px solid rgba(255,255,255,0.05);
    padding:3rem; text-align:center; color:rgba(255,255,255,0.3);
    font-family:'Barlow Condensed',sans-serif; font-size:1rem; letter-spacing:0.1em; text-transform:uppercase;
  }

  /* ── STANDINGS ──────────────────────── */
  .f1-home-page .hp-standings { display:grid; grid-template-columns:repeat(auto-fill,minmax(420px,1fr)); gap:2px; margin-bottom:4rem; }

  .f1-home-page .hp-stand-panel { background:#111114; border:1px solid rgba(255,255,255,0.05); animation:hp-rise 0.4s ease both; }
  .f1-home-page .hp-stand-panel:nth-child(1){animation-delay:0.1s}
  .f1-home-page .hp-stand-panel:nth-child(2){animation-delay:0.2s}

  .f1-home-page .hp-stand-head { padding:1.5rem 1.75rem 1rem; border-bottom:1px solid rgba(255,255,255,0.06); }
  .f1-home-page .hp-stand-title {
    font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:900;
    text-transform:uppercase; letter-spacing:0.02em; color:#fff; margin:0; padding:0;
    display:flex; align-items:center; gap:0.5rem;
  }
  .f1-home-page .hp-stand-title em { color:#e10600; font-style:italic; }

  .f1-home-page .hp-stand-rows { padding:0.5rem 0; }
  .f1-home-page .hp-stand-row {
    display:grid; grid-template-columns:2.5rem 1fr auto;
    align-items:center; gap:0.75rem;
    padding:0.75rem 1.75rem;
    border-bottom:1px solid rgba(255,255,255,0.03);
    transition:background 0.2s ease;
  }
  .f1-home-page .hp-stand-row:last-child { border-bottom:none; }
  .f1-home-page .hp-stand-row:hover { background:rgba(255,255,255,0.03); }
  .f1-home-page .hp-stand-pos {
    font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:900;
    color:#e10600; line-height:1; text-align:center;
  }
  .f1-home-page .hp-stand-pos.p1 { font-size:1.7rem; }
  .f1-home-page .hp-stand-name {
    font-family:'Barlow Condensed',sans-serif; font-size:1.05rem; font-weight:800;
    text-transform:uppercase; letter-spacing:0.02em; color:#fff; line-height:1;
  }
  .f1-home-page .hp-stand-sub { font-size:0.72rem; color:rgba(255,255,255,0.32); margin-top:0.15rem; font-weight:500; }
  .f1-home-page .hp-stand-pts {
    font-family:'Barlow Condensed',sans-serif; font-size:1.4rem; font-weight:900;
    color:#fff; letter-spacing:-0.01em; text-align:right;
  }
  .f1-home-page .hp-stand-pts-label { font-size:0.6rem; color:rgba(255,255,255,0.25); font-weight:500; text-align:right; letter-spacing:0.05em; }

  .f1-home-page .hp-stand-foot { padding:1.25rem 1.75rem; border-top:1px solid rgba(255,255,255,0.06); }
  .f1-home-page .hp-btn-outline {
    display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; width:100%;
    font-family:'Barlow Condensed',sans-serif; font-size:0.73rem; font-weight:700;
    letter-spacing:0.15em; text-transform:uppercase;
    color:#e10600; border:1px solid rgba(225,6,0,0.35); text-decoration:none;
    padding:0.65rem; border-radius:2px; transition:background 0.2s ease, color 0.2s ease;
  }
  .f1-home-page .hp-btn-outline:hover { background:rgba(225,6,0,0.1); }

  /* Loading */
  .f1-home-page .hp-loading { min-height:55vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; background:#0a0a0c; }
  .f1-home-page .hp-bar-track { width:200px; height:2px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
  .f1-home-page .hp-bar-fill { height:100%; background:#e10600; border-radius:2px; animation:hp-slide 1.2s ease-in-out infinite; }
  .f1-home-page .hp-load-txt { font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.28); margin:0; padding:0; }

  @keyframes hp-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes hp-rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  @media(max-width:640px){
    .f1-home-page .hp-next-content { grid-template-columns:1fr; }
    .f1-home-page .hp-next-date { text-align:left; }
    .f1-home-page .hp-standings { grid-template-columns:1fr; }
  }
`;

const Home = () => {
  const [driverStandings, setDriverStandings]       = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [nextRace, setNextRace]   = useState(null);
  const [news, setNews]           = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [drivers, constructors, schedule] = await Promise.all([
        jolpicaApi.getDriverStandings(2026),
        jolpicaApi.getConstructorStandings(2026),
        jolpicaApi.getSchedule(2026),
      ]);

      setDriverStandings(drivers.slice(0, 5));
      setConstructorStandings(constructors.slice(0, 5));

      const now = new Date();
      setNextRace(schedule.find(r => new Date(r.date) > now) || null);

      const { data: newsData } = await supabase
        .from('news').select('*').order('created_at', { ascending: false }).limit(4);
      setNews(newsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="f1-home-page">
      <style>{SCOPED_CSS}</style>
      <div className="hp-loading">
        <div className="hp-bar-track"><div className="hp-bar-fill" /></div>
        <p className="hp-load-txt">Loading</p>
      </div>
    </div>
  );

  const nextDate = nextRace ? new Date(nextRace.date) : null;

  return (
    <div className="f1-home-page">
      <style>{SCOPED_CSS}</style>

      <div className="hp-wrap">
        <div className="hp-grid-bg" />
        <div className="hp-glow" />
        <div className="hp-inner">

          {/* ── HERO ── */}
          <section className="hp-hero">
            <div className="hp-hero-eyebrow">
              <Flag size={12} color="#e10600" />
              <p className="hp-hero-eyebrow-txt">Formula 1 Championship</p>
              <div className="hp-hero-line" />
            </div>
            <h1 className="hp-hero-title">
              Formula
              <em>One <span className="hp-hero-badge">2026</span></em>
            </h1>
            <p className="hp-hero-sub">
              ติดตามข้อมูล ข่าวสาร และผลการแข่งขัน F1 ทุกสนาม ครบจบในที่เดียว
            </p>
            <div className="hp-hero-ghost">F1</div>
          </section>

          {/* ── NEXT RACE ── */}
          {nextRace && (
            <section style={{ marginBottom: '4rem' }}>
              <div className="hp-sec-hd">
                <h2 className="hp-sec-title"><Calendar size={18} color="#e10600" /> การแข่งขัน<em>ถัดไป</em></h2>
                <Link to="/schedule" className="hp-sec-link">ตารางทั้งหมด <ChevronRight size={13} /></Link>
              </div>

              <div className="hp-next-race">
                <div className="hp-next-bar" />
                <div className="hp-next-inner">
                  <p className="hp-next-label"><span />NEXT RACE</p>
                  <div className="hp-next-content">
                    <div>
                      <h3 className="hp-next-name">{nextRace.raceName}</h3>
                      <div className="hp-next-meta">
                        <div className="hp-next-meta-row">
                          <MapPin size={13} />
                          <span>{nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}</span>
                        </div>
                        <div className="hp-next-meta-row">
                          <Flag size={13} />
                          <span>Round {nextRace.round} · ฤดูกาล 2026</span>
                        </div>
                      </div>
                    </div>
                    {nextDate && (
                      <div className="hp-next-date">
                        <div className="hp-next-date-day">
                          {nextDate.toLocaleDateString('th-TH', { day: 'numeric' })}
                        </div>
                        <div className="hp-next-date-month">
                          {nextDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="hp-next-ghost">{String(nextRace.round).padStart(2,'0')}</div>
                  <div className="hp-next-foot">
                    <Link to="/schedule" className="hp-btn">
                      ดูตารางแข่ง <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── NEWS ── */}
          <section className="hp-news-section">
            <div className="hp-sec-hd">
              <h2 className="hp-sec-title"><Newspaper size={18} color="#e10600" /> ข่าวสาร<em>F1</em></h2>
              <Link to="/news" className="hp-sec-link">ดูทั้งหมด <ChevronRight size={13} /></Link>
            </div>

            {news.length > 0 ? (
  <div className="hp-news-grid">
    {news.map((item, i) => (
      <Link
        key={item.id}
        to={`/news/${item.id}`}
        className="hp-news-card"
        style={{ animationDelay: `${0.05 + i * 0.07}s` }}
      >
        <div className="hp-news-card-bar" />
        {item.image_url && (
          <div className="hp-news-img-wrap" style={{ height: '300px', overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={item.image_url}
              alt={item.title}
              className="hp-news-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
        <div className="hp-news-body">
          <div className="hp-news-meta">
            <span>
              <Calendar size={11} />
              {new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>
              <Clock size={11} />
              {Math.max(1, Math.ceil((item.content?.length || 0) / 800))} นาที
            </span>
          </div>
          <h3 className="hp-news-title">{item.title}</h3>
          <p className="hp-news-excerpt">{item.content}</p>
          <span className="hp-news-readmore">อ่านต่อ <ChevronRight size={12} /></span>
        </div>
      </Link>
    ))}
  </div>
) : (
  <div className="hp-news-empty">ยังไม่มีข่าวสาร</div>
)}
          </section>

          {/* ── STANDINGS ── */}
          <section>
            <div className="hp-sec-hd">
              <h2 className="hp-sec-title"><Trophy size={18} color="#e10600" /> ตาราง<em>คะแนน</em></h2>
              <Link to="/standings" className="hp-sec-link">ดูทั้งหมด <ChevronRight size={13} /></Link>
            </div>

            <div className="hp-standings">
              {/* Driver Standings */}
              <div className="hp-stand-panel">
                <div className="hp-stand-head">
                  <h3 className="hp-stand-title">นักแข่ง <em>Top 5</em></h3>
                </div>
                <div className="hp-stand-rows">
                  {driverStandings.map((s) => (
                    <div key={s.Driver.driverId} className="hp-stand-row">
                      <div className={`hp-stand-pos${s.position === '1' || s.position === 1 ? ' p1' : ''}`}>
                        {s.position}
                      </div>
                      <div>
                        <div className="hp-stand-name">
                          {s.Driver.givenName} {s.Driver.familyName}
                        </div>
                        <div className="hp-stand-sub">{s.Constructors?.[0]?.name}</div>
                      </div>
                      <div>
                        <div className="hp-stand-pts">{s.points}</div>
                        <div className="hp-stand-pts-label">PTS</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hp-stand-foot">
                  <Link to="/standings" className="hp-btn-outline">ดูคะแนนทั้งหมด <ChevronRight size={13} /></Link>
                </div>
              </div>

              {/* Constructor Standings */}
              <div className="hp-stand-panel">
                <div className="hp-stand-head">
                  <h3 className="hp-stand-title">ทีม <em>Top 5</em></h3>
                </div>
                <div className="hp-stand-rows">
                  {constructorStandings.map((s) => (
                    <div key={s.Constructor.constructorId} className="hp-stand-row">
                      <div className={`hp-stand-pos${s.position === '1' || s.position === 1 ? ' p1' : ''}`}>
                        {s.position}
                      </div>
                      <div>
                        <div className="hp-stand-name">{s.Constructor.name}</div>
                        <div className="hp-stand-sub">{s.Constructor.nationality}</div>
                      </div>
                      <div>
                        <div className="hp-stand-pts">{s.points}</div>
                        <div className="hp-stand-pts-label">PTS</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hp-stand-foot">
                  <Link to="/standings" className="hp-btn-outline">ดูคะแนนทั้งหมด <ChevronRight size={13} /></Link>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Home;