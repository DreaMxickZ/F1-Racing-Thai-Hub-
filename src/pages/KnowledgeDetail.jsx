import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '../config/supabase';
import { Helmet } from 'react-helmet-async';

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
  --txt:       #ececec;
  --txt2:      rgba(255,255,255,0.45);
  --txt3:      rgba(255,255,255,0.2);
}

.kd { font-family:'Barlow',sans-serif; color:var(--txt); background:var(--bg); min-height:100vh; }
.kd *, .kd *::before, .kd *::after { box-sizing:border-box; margin:0; padding:0; }

.kd-atm {
  position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(225,6,0,0.06) 0%, transparent 70%),
    repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.015) 59px, rgba(255,255,255,0.015) 60px),
    repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.015) 59px, rgba(255,255,255,0.015) 60px);
}
.kd-inner { max-width:860px; margin:0 auto; padding:0 2rem 6rem; position:relative; z-index:1; }

/* ── Hero image ── */
.kd-hero {
  width:calc(100% + 4rem); margin-left:-2rem;
  aspect-ratio:21/8; overflow:hidden; position:relative;
}
.kd-hero-img { width:100%; height:100%; object-fit:cover; filter:brightness(0.55) saturate(0.7); display:block; }
.kd-hero-overlay {
  position:absolute; inset:0;
  background:linear-gradient(0deg, var(--bg) 0%, rgba(7,7,8,0.2) 60%, transparent 100%);
}

/* ── Meta bar ── */
.kd-meta-bar {
  display:flex; align-items:center; gap:1.5rem;
  padding:1.75rem 0; border-bottom:1px solid var(--border);
  margin-bottom:2rem; flex-wrap:wrap;
}
.kd-back {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:700;
  letter-spacing:0.18em; text-transform:uppercase;
  background:none; border:1px solid var(--border2); color:var(--txt2);
  padding:0.45rem 0.9rem; cursor:pointer; transition:all 0.2s;
}
.kd-back:hover { color:#fff; background:var(--surface2); }
.kd-cat {
  font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:800;
  letter-spacing:0.25em; text-transform:uppercase; color:var(--red);
}

/* ── Article ── */
.kd-art { animation:kd-up 0.4s ease both; }

.kd-title {
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(2.2rem,5vw,3.5rem); font-weight:900;
  text-transform:uppercase; color:#fff; line-height:1; margin-bottom:1.5rem;
}
.kd-excerpt {
  font-size:1.05rem; color:var(--txt2); line-height:1.75;
  border-left:3px solid var(--red); padding-left:1.25rem;
  margin-bottom:2.5rem; max-width:680px;
}

/* ── Block renderers ── */
.kd-body { max-width:720px; }
.kd-bl-p  { font-size:1rem; line-height:1.9; color:rgba(255,255,255,0.7); margin-bottom:1.25rem; }
.kd-bl-h2 {
  font-family:'Barlow Condensed',sans-serif; font-size:1.75rem; font-weight:900;
  text-transform:uppercase; color:#fff; margin:2.5rem 0 0.75rem;
  display:flex; align-items:center; gap:0.75rem;
}
.kd-bl-h2::before { content:''; flex-shrink:0; width:4px; height:1.4rem; background:var(--red); border-radius:1px; }
.kd-bl-h3 {
  font-family:'Barlow Condensed',sans-serif; font-size:1.2rem; font-weight:800;
  text-transform:uppercase; color:rgba(255,255,255,0.7); margin:2rem 0 0.5rem;
}
.kd-bl-quote {
  border-left:3px solid var(--red); padding:1rem 1.5rem;
  background:var(--red-dim); margin:1.5rem 0; border-radius:0 2px 2px 0;
  font-style:italic; font-size:1.05rem; color:rgba(255,255,255,0.6);
}
.kd-bl-figure { margin:2rem 0; }
.kd-bl-figure img { width:100%; border-radius:2px; border:1px solid var(--border); display:block; }
.kd-bl-figure figcaption { font-size:0.78rem; color:var(--txt3); font-style:italic; margin-top:0.5rem; text-align:center; }
.kd-bl-hr { border:none; border-top:1px solid var(--border); margin:2.5rem 0; }

.kd-bl-table { margin:1.75rem 0; overflow-x:auto; }
.kd-bl-table table { width:100%; border-collapse:collapse; font-family:'Barlow',sans-serif; font-size:0.9rem; }
.kd-bl-table th {
  font-family:'Barlow Condensed',sans-serif; font-size:0.78rem; font-weight:800;
  letter-spacing:0.1em; text-transform:uppercase; text-align:left;
  padding:0.6rem 0.85rem; background:rgba(225,6,0,0.07);
  color:rgba(255,255,255,0.75); border:1px solid rgba(255,255,255,0.1);
}
.kd-bl-table td {
  padding:0.55rem 0.85rem; color:rgba(255,255,255,0.65);
  border:1px solid rgba(255,255,255,0.06); line-height:1.5;
}
.kd-bl-table tr:hover td { background:rgba(255,255,255,0.02); }

/* ── CTA ── */
.kd-cta { margin-top:3.5rem; padding-top:2rem; border-top:1px solid var(--border); }
.kd-cta-label {
  font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:700;
  letter-spacing:0.25em; text-transform:uppercase; color:var(--txt3);
  margin-bottom:1.25rem;
}
.kd-cta-btn {
  display:inline-flex; align-items:center; gap:0.5rem;
  font-family:'Barlow Condensed',sans-serif; font-size:0.8rem; font-weight:700;
  letter-spacing:0.15em; text-transform:uppercase;
  background:var(--red); color:#fff;
  padding:0.75rem 1.75rem; border:none; cursor:pointer; border-radius:2px;
  transition:background 0.2s, transform 0.2s;
}
.kd-cta-btn:hover { background:#c00500; transform:translateY(-1px); }

/* ── Loading ── */
.kd-load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; }
.kd-track { width:180px; height:2px; background:rgba(255,255,255,0.07); overflow:hidden; }
.kd-fill  { height:100%; background:var(--red); animation:kd-slide 1.1s ease-in-out infinite; }
.kd-load-t { font-family:'Barlow Condensed',sans-serif; font-size:0.65rem; font-weight:800; letter-spacing:0.35em; text-transform:uppercase; color:var(--txt3); }

/* ── Not found ── */
.kd-404 { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; text-align:center; }
.kd-404-t { font-family:'Barlow Condensed',sans-serif; font-size:3rem; font-weight:900; text-transform:uppercase; color:rgba(255,255,255,0.1); }
.kd-404-s { font-size:0.9rem; color:var(--txt3); }

@keyframes kd-up    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
@keyframes kd-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
`;

/* ── Block renderer ── */
const Block = ({ b }) => {
  if (!b) return null;
  switch (b.type) {
    case 'paragraph': return <p className="kd-bl-p">{b.content}</p>;
    case 'h2':        return <h2 className="kd-bl-h2">{b.content}</h2>;
    case 'h3':        return <h3 className="kd-bl-h3">{b.content}</h3>;
    case 'quote':     return <blockquote className="kd-bl-quote">{b.content}</blockquote>;
    case 'divider':   return <hr className="kd-bl-hr" />;
    case 'image':
      return b.url ? (
        <figure className="kd-bl-figure">
          <img src={b.url} alt={b.caption || ''} />
          {b.caption && <figcaption>{b.caption}</figcaption>}
        </figure>
      ) : null;
    case 'table':
      if (!b.tableData) return null;
      return (
        <div className="kd-bl-table">
          <table>
            <thead>
              <tr>{b.tableData.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.tableData.rows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default: return null;
  }
};

export default function KnowledgeDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('knowledge')
      .select('*, knowledge_categories(name,icon,slug)')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data, error }) => {
        if (!error) setArticle(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="kd">
      <style>{S}</style>
      <div className="kd-load">
        <div className="kd-track"><div className="kd-fill"/></div>
        <p className="kd-load-t">Loading</p>
      </div>
    </div>
  );

  if (!article) return (
    <div className="kd">
      <style>{S}</style>
      <div className="kd-404">
        <p className="kd-404-t">ไม่พบบทความ</p>
        <p className="kd-404-s">บทความที่คุณกำลังมองหาอาจถูกลบหรือย้ายไปแล้ว</p>
        <button className="kd-cta-btn" onClick={() => navigate('/knowledge')}>
          ดูบทความทั้งหมด
        </button>
      </div>
    </div>
  );

  const canonicalUrl = `${window.location.origin}/knowledge/${article.slug}`;
  const description  = article.excerpt || (Array.isArray(article.content) && article.content.find(b => b.type === 'paragraph')?.content?.substring(0, 160)) || '';

  return (
    <div className="kd">
      <style>{S}</style>

      {/* SEO Meta */}
      <Helmet>
        <title>{article.title} | F1 Racing Hub</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        {article.cover_url && <meta property="og:image" content={article.cover_url} />}
        <meta property="og:site_name" content="F1 Racing Hub" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={article.title} />
        <meta property="twitter:description" content={description} />
        {article.cover_url && <meta property="twitter:image" content={article.cover_url} />}
      </Helmet>

      <div className="kd-atm"/>
      <div className="kd-inner">

        {/* Hero image */}
        {article.cover_url && (
          <div className="kd-hero">
            <img src={article.cover_url} alt={article.title} className="kd-hero-img"/>
            <div className="kd-hero-overlay"/>
          </div>
        )}

        {/* Meta bar */}
        <div className="kd-meta-bar">
          <button className="kd-back" onClick={() => navigate('/knowledge')}>
            <ArrowLeft size={13}/> กลับ
          </button>
          <span className="kd-cat">
            {article.knowledge_categories?.icon} {article.knowledge_categories?.name}
          </span>
        </div>

        {/* Article */}
        <article className="kd-art">
          <h1 className="kd-title">{article.title}</h1>
          {article.excerpt && <p className="kd-excerpt">{article.excerpt}</p>}

          <div className="kd-body">
            {(article.content || []).map((b, i) => <Block key={b.id || i} b={b}/>)}
          </div>

          <div className="kd-cta">
            <p className="kd-cta-label">บทความอื่นๆ</p>
            <button className="kd-cta-btn" onClick={() => navigate('/knowledge')}>
              <BookOpen size={14}/>
              ดูบทความทั้งหมด
            </button>
          </div>
        </article>

      </div>
    </div>
  );
}
