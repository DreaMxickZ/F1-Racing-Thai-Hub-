import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ArrowLeft, Clock, Tag } from 'lucide-react';
import { supabase } from '../config/supabase';

/* ─────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,600;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

:root {
  --bg:        #070708;
  --surface:   #0e0e11;
  --surface2:  #141418;
  --border:    rgba(255,255,255,0.06);
  --border2:   rgba(255,255,255,0.1);
  --red:       #e10600;
  --red-dim:   rgba(225,6,0,0.08);
  --red-glow:  rgba(225,6,0,0.18);
  --txt:       #ececec;
  --txt2:      rgba(255,255,255,0.45);
  --txt3:      rgba(255,255,255,0.2);
}

.kp { font-family:'Barlow',sans-serif; color:var(--txt); background:var(--bg); min-height:100vh; }
.kp *, .kp *::before, .kp *::after { box-sizing:border-box; margin:0; padding:0; }

/* ── atmosphere ── */
.kp-atm {
  position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,6,0,0.06) 0%, transparent 70%),
    repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.015) 59px, rgba(255,255,255,0.015) 60px),
    repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.015) 59px, rgba(255,255,255,0.015) 60px);
}

.kp-inner { max-width:1280px; margin:0 auto; padding:0 2rem 6rem; position:relative; z-index:1; }

/* ─── HERO HEADER ─── */
.kp-hero {
  padding:5rem 0 0;
  display:grid;
  grid-template-columns:1fr auto;
  align-items:end;
  gap:2rem;
  border-bottom:1px solid var(--border);
  padding-bottom:3rem;
  margin-bottom:3rem;
  position:relative;
}
.kp-hero::before {
  content:'';
  position:absolute; top:0; left:-2rem; right:-2rem; bottom:0;
  background:linear-gradient(180deg, rgba(225,6,0,0.03) 0%, transparent 100%);
  pointer-events:none;
}

.kp-label {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:700;
  letter-spacing:0.3em; text-transform:uppercase; color:var(--red);
  margin-bottom:1.25rem;
}
.kp-label::before { content:''; width:24px; height:1px; background:var(--red); }

.kp-hero-title {
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(4rem,9vw,7rem);
  font-weight:900; line-height:0.85;
  text-transform:uppercase; color:#fff;
  position:relative;
}
.kp-hero-title em { font-style:italic; color:var(--red); }

.kp-hero-count {
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(5rem,12vw,10rem); font-weight:900;
  line-height:1; color:rgba(255,255,255,0.04);
  letter-spacing:-0.04em; user-select:none;
  align-self:flex-end; padding-bottom:0.1em;
}

/* ─── CATEGORY TABS ─── */
.kp-tabs {
  display:flex; gap:0; margin-bottom:2.5rem;
  border-bottom:1px solid var(--border);
  overflow-x:auto; scrollbar-width:none;
}
.kp-tabs::-webkit-scrollbar { display:none; }
.kp-tab {
  display:flex; align-items:center; gap:0.4rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.8rem; font-weight:700;
  letter-spacing:0.1em; text-transform:uppercase;
  background:none; border:none; border-bottom:2px solid transparent;
  color:var(--txt3); padding:0.75rem 1.1rem;
  cursor:pointer; white-space:nowrap;
  transition:color 0.2s, border-color 0.2s;
  margin-bottom:-1px;
}
.kp-tab:hover { color:var(--txt); }
.kp-tab.on { color:#fff; border-bottom-color:var(--red); }
.kp-tab-ico { font-size:0.9rem; }

/* ─── GRID ─── */
.kp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1px; background:var(--border); }
.kp-grid-wrap { background:var(--bg); }

.kp-card {
  background:var(--surface); cursor:pointer;
  display:flex; flex-direction:column;
  transition:background 0.25s;
  animation:kp-up 0.5s ease both;
  position:relative;
}
.kp-card:hover { background:var(--surface2); }

.kp-card-img-box { overflow:hidden; aspect-ratio:16/9; position:relative; }
.kp-card-img { width:100%; height:100%; object-fit:cover; display:block; filter:brightness(0.9) saturate(0.8); transition:filter 0.4s, transform 0.4s; }
.kp-card:hover .kp-card-img { filter:brightness(1) saturate(1); transform:scale(1.04); }
.kp-card-img-ph { width:100%; aspect-ratio:16/9; background:var(--surface2); display:flex; align-items:center; justify-content:center; }
.kp-card-tag {
  position:absolute; top:0.75rem; left:0.75rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.62rem; font-weight:800;
  letter-spacing:0.2em; text-transform:uppercase;
  background:rgba(7,7,8,0.85); border:1px solid var(--border2);
  color:var(--txt2); padding:0.25rem 0.6rem; backdrop-filter:blur(4px);
}

.kp-card-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; gap:0.5rem; }
.kp-card-cat {
  font-family:'Barlow Condensed',sans-serif; font-size:0.63rem; font-weight:800;
  letter-spacing:0.22em; text-transform:uppercase; color:var(--red);
}
.kp-card-title {
  font-family:'Barlow Condensed',sans-serif; font-size:1.3rem; font-weight:900;
  text-transform:uppercase; color:#fff; line-height:1.1;
}
.kp-card-excerpt { font-size:0.82rem; color:var(--txt2); line-height:1.65; flex:1; }
.kp-card-foot {
  margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
}
.kp-card-read {
  font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; color:var(--red);
  display:flex; align-items:center; gap:0.3rem;
}
.kp-card-read svg { transition:transform 0.2s; }
.kp-card:hover .kp-card-read svg { transform:translateX(3px); }

/* ─── EMPTY ─── */
.kp-empty {
  grid-column:1/-1; text-align:center; padding:5rem 2rem;
  background:var(--surface); border:1px dashed var(--border2);
}
.kp-empty-t { font-family:'Barlow Condensed',sans-serif; font-size:1.5rem; font-weight:900; text-transform:uppercase; color:var(--txt3); margin:1rem 0 0.4rem; }
.kp-empty-s { font-size:0.82rem; color:var(--txt3); }

/* ─── ARTICLE VIEW ─── */
.kp-art-wrap { animation:kp-up 0.4s ease both; }

.kp-art-hero {
  position:relative; width:calc(100% + 4rem); margin-left:-2rem;
  aspect-ratio:21/8; overflow:hidden;
}
.kp-art-hero-img { width:100%; height:100%; object-fit:cover; filter:brightness(0.55) saturate(0.7); }
.kp-art-hero-overlay {
  position:absolute; inset:0;
  background:linear-gradient(0deg, rgba(7,7,8,1) 0%, rgba(7,7,8,0.2) 60%, transparent 100%);
}
.kp-art-hero-ph { width:100%; aspect-ratio:21/8; background:var(--surface2); }
.kp-art-meta-bar {
  display:flex; align-items:center; gap:1.5rem; padding:1.75rem 0;
  border-bottom:1px solid var(--border); margin-bottom:2rem;
  flex-wrap:wrap;
}
.kp-art-back {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:700;
  letter-spacing:0.18em; text-transform:uppercase;
  background:none; border:1px solid var(--border2); color:var(--txt2);
  padding:0.45rem 0.9rem; cursor:pointer; transition:all 0.2s;
}
.kp-art-back:hover { color:#fff; border-color:var(--border2); background:var(--surface2); }
.kp-art-cat {
  font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800;
  letter-spacing:0.25em; text-transform:uppercase; color:var(--red);
}
.kp-art-title {
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(2.2rem,5vw,3.5rem); font-weight:900;
  text-transform:uppercase; color:#fff; line-height:1; margin-bottom:1.5rem;
}
.kp-art-excerpt {
  font-size:1.05rem; color:var(--txt2); line-height:1.75;
  border-left:3px solid var(--red); padding-left:1.25rem;
  margin-bottom:2.5rem; max-width:680px;
}

/* ─── Block renderers ─── */
.kp-body { max-width:720px; }
.kp-bl-p  { font-size:1rem; line-height:1.9; color:rgba(255,255,255,0.7); margin-bottom:1.25rem; }
.kp-bl-h2 {
  font-family:'Barlow Condensed',sans-serif; font-size:1.75rem; font-weight:900;
  text-transform:uppercase; color:#fff; margin:2.5rem 0 0.75rem;
  display:flex; align-items:center; gap:0.75rem;
}
.kp-bl-h2::before { content:''; flex-shrink:0; width:4px; height:1.4rem; background:var(--red); border-radius:1px; }
.kp-bl-h3 {
  font-family:'Barlow Condensed',sans-serif; font-size:1.2rem; font-weight:800;
  text-transform:uppercase; color:rgba(255,255,255,0.7); margin:2rem 0 0.5rem;
}
.kp-bl-quote {
  border-left:3px solid var(--red); padding:1rem 1.5rem;
  background:var(--red-dim); margin:1.5rem 0; border-radius:0 2px 2px 0;
  font-style:italic; font-size:1.05rem; color:rgba(255,255,255,0.6);
}
.kp-bl-figure { margin:2rem 0; }
.kp-bl-figure img { width:100%; border-radius:2px; border:1px solid var(--border); display:block; }
.kp-bl-figure figcaption { font-size:0.78rem; color:var(--txt3); font-style:italic; margin-top:0.5rem; text-align:center; }
.kp-bl-hr { border:none; border-top:1px solid var(--border); margin:2.5rem 0; }

/* ─── TABLE BLOCK (article view) ─── */
.kp-bl-table { margin:1.75rem 0; overflow-x:auto; }
.kp-bl-table table {
  width:100%; border-collapse:collapse;
  font-family:'Barlow',sans-serif; font-size:0.9rem;
}
.kp-bl-table th {
  font-family:'Barlow Condensed',sans-serif; font-size:0.78rem;
  font-weight:800; letter-spacing:0.1em; text-transform:uppercase;
  text-align:left; padding:0.6rem 0.85rem;
  background:rgba(225,6,0,0.07); color:rgba(255,255,255,0.75);
  border:1px solid rgba(255,255,255,0.1);
}
.kp-bl-table td {
  padding:0.55rem 0.85rem; color:rgba(255,255,255,0.65);
  border:1px solid rgba(255,255,255,0.06); line-height:1.5;
}
.kp-bl-table tr:hover td { background:rgba(255,255,255,0.02); }

/* ─── Loading ─── */
.kp-load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; background:var(--bg); }
.kp-track { width:180px; height:2px; background:rgba(255,255,255,0.07); overflow:hidden; }
.kp-fill  { height:100%; background:var(--red); animation:kp-slide 1.1s ease-in-out infinite; }
.kp-load-t { font-family:'Barlow Condensed',sans-serif; font-size:0.65rem; font-weight:800; letter-spacing:0.35em; text-transform:uppercase; color:var(--txt3); }

/* Stagger animations */
.kp-card:nth-child(1){animation-delay:0.04s}.kp-card:nth-child(2){animation-delay:0.08s}
.kp-card:nth-child(3){animation-delay:0.12s}.kp-card:nth-child(4){animation-delay:0.16s}
.kp-card:nth-child(5){animation-delay:0.20s}.kp-card:nth-child(6){animation-delay:0.24s}

@keyframes kp-up    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
@keyframes kp-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
`;

/* ─── Block renderer ─── */
const Block = ({ b }) => {
  if (!b) return null;
  switch (b.type) {
    case 'paragraph': return <p className="kp-bl-p">{b.content}</p>;
    case 'h2':        return <h2 className="kp-bl-h2">{b.content}</h2>;
    case 'h3':        return <h3 className="kp-bl-h3">{b.content}</h3>;
    case 'quote':     return <blockquote className="kp-bl-quote">{b.content}</blockquote>;
    case 'divider':   return <hr className="kp-bl-hr" />;
    case 'image':     return b.url ? (
      <figure className="kp-bl-figure">
        <img src={b.url} alt={b.caption || ''} />
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    ) : null;
    case 'table':
      if (!b.tableData) return null;
      return (
        <div className="kp-bl-table">
          <table>
            <thead>
              <tr>
                {b.tableData.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {b.tableData.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default: return null;
  }
};

export default function Knowledge() {
  const [articles,   setArticles]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab,        setTab]        = useState('all');
  const [article,    setArticle]    = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('knowledge')
        .select('*, knowledge_categories(name,icon,slug)')
        .eq('published', true).order('sort_order').order('created_at', { ascending: false }),
      supabase.from('knowledge_categories').select('*').order('sort_order'),
    ]).then(([{ data: arts }, { data: cats }]) => {
      setArticles(arts || []); setCategories(cats || []);
    }).finally(() => setLoading(false));
  }, []);

  const list = tab === 'all' ? articles : articles.filter(a => a.knowledge_categories?.slug === tab);

  if (loading) return (
    <div className="kp">
      <style>{S}</style>
      <div className="kp-load">
        <div className="kp-track"><div className="kp-fill"/></div>
        <p className="kp-load-t">Loading</p>
      </div>
    </div>
  );

  /* Article detail */
  if (article) return (
    <div className="kp">
      <style>{S}</style>
      <div className="kp-atm"/>
      <div className="kp-inner">
        <div className="kp-art-wrap">
          {article.cover_url
            ? <div className="kp-art-hero">
                <img src={article.cover_url} alt="" className="kp-art-hero-img"/>
                <div className="kp-art-hero-overlay"/>
              </div>
            : null
          }
          <div className="kp-art-meta-bar">
            <button className="kp-art-back" onClick={() => setArticle(null)}><ArrowLeft size={13}/> กลับ</button>
            <span className="kp-art-cat">{article.knowledge_categories?.icon} {article.knowledge_categories?.name}</span>
          </div>
          <p className="kp-art-cat" style={{ marginBottom: '0.6rem' }}>{article.knowledge_categories?.icon} {article.knowledge_categories?.name}</p>
          <h1 className="kp-art-title">{article.title}</h1>
          {article.excerpt && <p className="kp-art-excerpt">{article.excerpt}</p>}
          <div className="kp-body">
            {(article.content || []).map((b, i) => <Block key={b.id || i} b={b}/>)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="kp">
      <style>{S}</style>
      <div className="kp-atm"/>
      <div className="kp-inner">

        {/* Hero */}
        <header className="kp-hero">
          <div>
            <div className="kp-label">F1 Encyclopedia</div>
            <h1 className="kp-hero-title">ความรู้<br/><em>Formula 1</em></h1>
          </div>
          <div className="kp-hero-count">{String(articles.length).padStart(2, '0')}</div>
        </header>

        {/* Tabs */}
        <div className="kp-tabs">
          <button className={`kp-tab ${tab === 'all' ? 'on' : ''}`} onClick={() => setTab('all')}>
            ทั้งหมด
          </button>
          {categories.map(c => (
            <button key={c.id} className={`kp-tab ${tab === c.slug ? 'on' : ''}`} onClick={() => setTab(c.slug)}>
              <span className="kp-tab-ico">{c.icon}</span> {c.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="kp-grid-wrap">
          <div className="kp-grid">
            {list.length === 0 ? (
              <div className="kp-empty">
                <BookOpen size={40} color="rgba(255,255,255,0.08)"/>
                <p className="kp-empty-t">ยังไม่มีบทความ</p>
                <p className="kp-empty-s">บทความจะปรากฏที่นี่เมื่อได้รับการเผยแพร่</p>
              </div>
            ) : list.map(a => (
              <div key={a.id} className="kp-card" onClick={() => setArticle(a)}>
                <div className="kp-card-img-box">
                  {a.cover_url
                    ? <>
                        <img src={a.cover_url} alt={a.title} className="kp-card-img"/>
                        <span className="kp-card-tag">{a.knowledge_categories?.icon} {a.knowledge_categories?.name}</span>
                      </>
                    : <div className="kp-card-img-ph"><BookOpen size={28} color="rgba(255,255,255,0.08)"/></div>
                  }
                </div>
                <div className="kp-card-body">
                  <p className="kp-card-cat">{a.knowledge_categories?.name}</p>
                  <h2 className="kp-card-title">{a.title}</h2>
                  {a.excerpt && <p className="kp-card-excerpt">{a.excerpt}</p>}
                  <div className="kp-card-foot">
                    <span className="kp-card-read">อ่านบทความ <ChevronRight size={13}/></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}