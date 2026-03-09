import { BookOpen, ChevronRight } from 'lucide-react';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-knowledge-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
  }
  .f1-knowledge-page *, .f1-knowledge-page *::before, .f1-knowledge-page *::after {
    box-sizing: border-box;
  }

  .f1-knowledge-page .kn-wrap {
    background: #0a0a0c; min-height: 80vh;
    position: relative; overflow: hidden;
  }
  .f1-knowledge-page .kn-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px; pointer-events: none; z-index: 0;
  }
  .f1-knowledge-page .kn-glow {
    position: absolute; top: -15%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(225,6,0,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .f1-knowledge-page .kn-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 5rem; position: relative; z-index: 1;
  }

  /* Header */
  .f1-knowledge-page .kn-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .f1-knowledge-page .kn-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .f1-knowledge-page .kn-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; line-height: 1;
  }
  .f1-knowledge-page .kn-eyebrow-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-knowledge-page .kn-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0;
  }
  .f1-knowledge-page .kn-title em { font-style: italic; color: #e10600; }
  .f1-knowledge-page .kn-badge {
    display: inline-flex; align-items: center;
    background: rgba(225,6,0,0.12); border: 1px solid rgba(225,6,0,0.28);
    padding: 0.28rem 0.7rem; border-radius: 2px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
    color: #e10600; text-transform: uppercase; margin-left: 1rem;
  }
  .f1-knowledge-page .kn-ghost {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 4rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: -0.5rem;
    letter-spacing: -0.05em; user-select: none; pointer-events: none;
  }

  /* Categories grid */
  .f1-knowledge-page .kn-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2px;
  }
  .f1-knowledge-page .kn-card {
    background: #111114; border: 1px solid rgba(255,255,255,0.05);
    padding: 2rem; position: relative; overflow: hidden; cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
    animation: kn-rise 0.4s ease both;
  }
  .f1-knowledge-page .kn-card:hover { background: #17171c; transform: translateY(-3px); z-index: 2; }

  .f1-knowledge-page .kn-card:nth-child(1) { animation-delay: 0.04s }
  .f1-knowledge-page .kn-card:nth-child(2) { animation-delay: 0.08s }
  .f1-knowledge-page .kn-card:nth-child(3) { animation-delay: 0.12s }
  .f1-knowledge-page .kn-card:nth-child(4) { animation-delay: 0.16s }
  .f1-knowledge-page .kn-card:nth-child(5) { animation-delay: 0.20s }
  .f1-knowledge-page .kn-card:nth-child(6) { animation-delay: 0.24s }

  .f1-knowledge-page .kn-card-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: #e10600; opacity: 0; transition: opacity 0.3s ease;
  }
  .f1-knowledge-page .kn-card:hover .kn-card-bar { opacity: 1; }

  .f1-knowledge-page .kn-card-icon {
    width: 40px; height: 40px; border-radius: 2px;
    background: rgba(225,6,0,0.1); border: 1px solid rgba(225,6,0,0.2);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem; color: #e10600;
    transition: background 0.3s ease;
  }
  .f1-knowledge-page .kn-card:hover .kn-card-icon { background: rgba(225,6,0,0.18); }

  .f1-knowledge-page .kn-card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.3rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.02em; color: #fff; margin: 0 0 0.5rem;
  }
  .f1-knowledge-page .kn-card-desc {
    font-size: 0.82rem; line-height: 1.6;
    color: rgba(255,255,255,0.35); margin: 0 0 1.5rem;
  }
  .f1-knowledge-page .kn-card-coming {
    display: inline-flex; align-items: center; gap: 0.35rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }

  /* Coming soon banner */
  .f1-knowledge-page .kn-soon {
    text-align: center; padding: 5rem 2rem;
    border: 1px solid rgba(255,255,255,0.05);
    background: #111114;
    animation: kn-rise 0.5s ease both;
  }
  .f1-knowledge-page .kn-soon-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 8rem; font-weight: 900;
    color: rgba(255,255,255,0.04); line-height: 1;
    user-select: none;
  }
  .f1-knowledge-page .kn-soon-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2rem; font-weight: 900; text-transform: uppercase;
    color: rgba(255,255,255,0.15); margin: 0 0 0.5rem;
  }
  .f1-knowledge-page .kn-soon-sub {
    font-size: 0.85rem; color: rgba(255,255,255,0.2);
  }

  @keyframes kn-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const categories = [
  {
    icon: '🏎️',
    title: 'กฎกติกา F1',
    desc: 'ทำความเข้าใจกฎและระเบียบของการแข่งขัน Formula 1 ตั้งแต่พื้นฐานจนถึงขั้นสูง',
  },
  {
    icon: '⚙️',
    title: 'เทคนิคและวิศวกรรม',
    desc: 'ระบบ DRS, ERS, PU และเทคโนโลยีล้ำสมัยที่อยู่เบื้องหลังรถ F1',
  },
  {
    icon: '🏁',
    title: 'การแข่งขันและกลยุทธ์',
    desc: 'กลยุทธ์การเข้า pit stop, การเลือกยาง และการวางแผนการแข่ง',
  },
  {
    icon: '📊',
    title: 'ระบบคะแนน',
    desc: 'การนับคะแนน, Fastest Lap, Sprint Race และ Driver/Constructor Championship',
  },
  {
    icon: '🌍',
    title: 'ประวัติ F1',
    desc: 'ประวัติศาสตร์อันยาวนานของ Formula 1 ตั้งแต่ปี 1950 จนถึงปัจจุบัน',
  },
  {
    icon: '🎙️',
    title: 'คำศัพท์ F1',
    desc: 'อธิบายคำศัพท์เฉพาะที่ใช้ในวงการ F1 ที่มือใหม่ควรรู้',
  },
];

const Knowledge = () => {
  return (
    <div className="f1-knowledge-page">
      <style>{SCOPED_CSS}</style>
      <div className="kn-wrap">
        <div className="kn-grid-bg" />
        <div className="kn-glow" />
        <div className="kn-inner">

          <header className="kn-hd">
            <div className="kn-eyebrow">
              <BookOpen size={12} color="#e10600" />
              <p className="kn-eyebrow-txt">Formula 1 Encyclopedia</p>
              <div className="kn-eyebrow-line" />
            </div>
            <h1 className="kn-title">
              ความรู้ <em>F1</em>
              <span className="kn-badge">Coming Soon</span>
            </h1>
            <div className="kn-ghost">F1</div>
          </header>

          <div className="kn-grid">
            {categories.map((cat, i) => (
              <div key={i} className="kn-card">
                <div className="kn-card-bar" />
                <div className="kn-card-icon">
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                </div>
                <h2 className="kn-card-title">{cat.title}</h2>
                <p className="kn-card-desc">{cat.desc}</p>
                <span className="kn-card-coming">
                  <ChevronRight size={11} />
                  เร็วๆ นี้
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Knowledge;
