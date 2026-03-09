import { Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-footer {
    font-family: 'Barlow', sans-serif;
    background: #0a0a0c;
    border-top: 1px solid rgba(255,255,255,0.06);
    position: relative; overflow: hidden;
  }
  .f1-footer *, .f1-footer *::before, .f1-footer *::after {
    box-sizing: border-box;
  }

  /* Red top accent */
  .f1-footer::before {
    content: '';
    display: block; height: 2px;
    background: linear-gradient(90deg, #e10600 0%, #ff4433 40%, transparent 100%);
  }

  /* Grid bg */
  .f1-footer .ft-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .f1-footer .ft-glow {
    position: absolute; bottom: -60%; left: 20%; 
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.05) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .f1-footer .ft-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 3.5rem 2rem 0;
    position: relative; z-index: 1;
  }

  /* ── TOP GRID ─────────────────────────── */
  .f1-footer .ft-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 900px) {
    .f1-footer .ft-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }
  @media (max-width: 560px) {
    .f1-footer .ft-grid { grid-template-columns: 1fr; }
  }

  /* ── BRAND ───────────────────────────── */
  .f1-footer .ft-brand { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
  .f1-footer .ft-brand-icon { color: #e10600; }
  .f1-footer .ft-brand-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.15rem; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.05em; color: #fff;
  }
  .f1-footer .ft-brand-name em { font-style: italic; color: #e10600; }
  .f1-footer .ft-desc {
    font-size: 0.82rem; line-height: 1.7;
    color: rgba(255,255,255,0.28); margin-bottom: 1.5rem;
  }
  .f1-footer .ft-sources {
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .f1-footer .ft-source-item {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }
  .f1-footer .ft-source-dot {
    width: 4px; height: 4px; border-radius: 50%; background: #e10600; flex-shrink: 0;
  }

  /* ── NAV COLUMNS ─────────────────────── */
  .f1-footer .ft-col-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .f1-footer .ft-col-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.08), transparent);
  }
  .f1-footer .ft-links {
    display: flex; flex-direction: column; gap: 0.6rem;
    list-style: none; margin: 0; padding: 0;
  }
  .f1-footer .ft-link {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); text-decoration: none;
    transition: color 0.2s ease, gap 0.2s ease;
  }
  .f1-footer .ft-link:hover { color: #e10600; gap: 0.7rem; }
  .f1-footer .ft-link-arrow {
    font-size: 0.6rem; opacity: 0;
    transition: opacity 0.2s ease;
  }
  .f1-footer .ft-link:hover .ft-link-arrow { opacity: 1; }

  /* ── BOTTOM BAR ──────────────────────── */
  .f1-footer .ft-bottom {
    display: flex; flex-wrap: wrap; align-items: center;
    justify-content: space-between; gap: 1rem;
    padding: 1.25rem 0 1.5rem;
  }
  .f1-footer .ft-copy {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.15);
  }
  .f1-footer .ft-made {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.12);
  }
  .f1-footer .ft-made span { color: #e10600; }
`;

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="ft-link">
      <span className="ft-link-arrow">›</span>
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="f1-footer">
      <style>{SCOPED_CSS}</style>
      <div className="ft-grid-bg" />
      <div className="ft-glow" />

      <div className="ft-inner">
        <div className="ft-grid">

          {/* Brand */}
          <div>
            <div className="ft-brand">
              <Flag size={22} className="ft-brand-icon" />
              <span className="ft-brand-name">F1 <em>Thai</em> Hub</span>
            </div>
            <p className="ft-desc">
              ศูนย์รวมข้อมูล Formula 1 ฤดูกาล 2026<br/>
              ข่าวสาร ผลการแข่งขัน และสถิติแบบเรียลไทม์
            </p>
            <div className="ft-sources">
              <span className="ft-source-item"><span className="ft-source-dot" />OpenF1 API</span>
              <span className="ft-source-item"><span className="ft-source-dot" />Jolpica F1 API</span>
              <span className="ft-source-item"><span className="ft-source-dot" />Supabase</span>
            </div>
          </div>

          {/* หน้าหลัก */}
          <div>
            <p className="ft-col-title">หน้าหลัก</p>
            <ul className="ft-links">
              <FooterLink to="/">หน้าแรก</FooterLink>
              <FooterLink to="/news">ข่าวสาร</FooterLink>
              <FooterLink to="/drivers">นักแข่ง</FooterLink>
              <FooterLink to="/teams">ทีม</FooterLink>
              <FooterLink to="/circuits">สนาม</FooterLink>
            </ul>
          </div>

          {/* ข้อมูลการแข่ง */}
          <div>
            <p className="ft-col-title">การแข่งขัน</p>
            <ul className="ft-links">
              <FooterLink to="/schedule">ตารางแข่ง</FooterLink>
              <FooterLink to="/standings">ตารางคะแนน</FooterLink>
              <FooterLink to="/results">ผลการแข่งขัน</FooterLink>
              <FooterLink to="/knowledge">ความรู้ F1</FooterLink>
            </ul>
          </div>

          {/* ฤดูกาล */}
          <div>
            <p className="ft-col-title">ฤดูกาล 2026</p>
            <ul className="ft-links">
              <FooterLink to="/drivers">นักแข่ง 2026</FooterLink>
              <FooterLink to="/teams">ทีม 2026</FooterLink>
              <FooterLink to="/standings">คะแนนสะสม</FooterLink>
              <FooterLink to="/results">ผลล่าสุด</FooterLink>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">© 2026 F1 Thai Hub — All rights reserved</p>
          <p className="ft-made">Made with ❤️ by Claude AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;