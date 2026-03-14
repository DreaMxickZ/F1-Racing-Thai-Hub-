import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { supabase } from '../config/supabase';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-news-page { font-family:'Barlow',sans-serif; color:#f0f0f0; }
  .f1-news-page *, .f1-news-page *::before, .f1-news-page *::after { box-sizing:border-box; }

  .f1-news-page .np-wrap { background:#0a0a0c; position:relative; overflow:hidden; min-height:60vh; }
  .f1-news-page .np-grid-bg {
    position:absolute; inset:0;
    background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
    background-size:60px 60px; pointer-events:none; z-index:0;
  }
  .f1-news-page .np-glow {
    position:absolute; top:-15%; left:50%; transform:translateX(-50%);
    width:900px; height:500px;
    background:radial-gradient(ellipse,rgba(225,6,0,0.07) 0%,transparent 70%);
    pointer-events:none; z-index:0;
  }
  .f1-news-page .np-inner { max-width:1300px; margin:0 auto; padding:0 2rem 5rem; position:relative; z-index:1; }

  /* ── HEADER ─────────────────────────── */
  .f1-news-page .np-hd { padding:3.5rem 0 2.5rem; border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:3rem; position:relative; }
  .f1-news-page .np-eyebrow { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem; }
  .f1-news-page .np-eyebrow-txt { font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.25em; text-transform:uppercase; color:#e10600; margin:0; padding:0; line-height:1; }
  .f1-news-page .np-eyebrow-line { flex:1; max-width:120px; height:1px; background:linear-gradient(90deg,#e10600,transparent); }
  .f1-news-page .np-title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(3rem,8vw,5.5rem); font-weight:900; line-height:0.9; text-transform:uppercase; letter-spacing:-0.02em; color:#fff; margin:0; padding:0; }
  .f1-news-page .np-title em { font-style:italic; color:#e10600; }
  .f1-news-page .np-subtitle { margin-top:1.25rem; font-size:0.88rem; color:rgba(255,255,255,0.35); letter-spacing:0.05em; display:flex; align-items:center; gap:0.75rem; }
  .f1-news-page .np-ghost { font-family:'Barlow Condensed',sans-serif; font-size:4rem; font-weight:900; color:rgba(255,255,255,0.04); position:absolute; right:0; bottom:-0.5rem; letter-spacing:-0.05em; line-height:1; user-select:none; pointer-events:none; }
  .f1-news-page .np-badge { display:inline-flex; align-items:center; background:rgba(225,6,0,0.12); border:1px solid rgba(225,6,0,0.28); padding:0.28rem 0.7rem; border-radius:2px; font-family:'Barlow Condensed',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:0.15em; color:#e10600; text-transform:uppercase; margin-left:1rem; vertical-align:middle; }

  /* ── FEATURED CARD ───────────────────── */
  .f1-news-page .np-featured {
    display:grid; grid-template-columns:2fr 3fr;
    background:#111114; border:1px solid rgba(255,255,255,0.05);
    overflow:hidden; text-decoration:none; color:inherit;
    margin-bottom:2px; position:relative;
    transition:background 0.3s ease;
    animation:np-rise 0.4s ease both;
  }
  .f1-news-page .np-featured:hover { background:#17171c; }
  .f1-news-page .np-feat-bar { position:absolute; top:0; left:0; right:0; height:2px; background:#e10600; }
  .f1-news-page .np-feat-img-wrap { overflow:hidden; }
  .f1-news-page .np-feat-img { width:100%; height:100%; min-height:460px; object-fit:cover; object-position:center top; display:block; filter:saturate(0.8); transition:filter 0.4s ease,transform 0.5s ease; }
  .f1-news-page .np-featured:hover .np-feat-img { filter:saturate(1); transform:scale(1.04); }
  .f1-news-page .np-feat-body { padding:2.5rem; display:flex; flex-direction:column; justify-content:space-between; position:relative; }
  .f1-news-page .np-feat-ghost { position:absolute; right:1.5rem; bottom:1rem; font-family:'Barlow Condensed',sans-serif; font-size:7rem; font-weight:900; color:rgba(255,255,255,0.025); line-height:1; user-select:none; pointer-events:none; }
  .f1-news-page .np-feat-tags { display:flex; align-items:center; gap:0.6rem; margin-bottom:1.25rem; }
  .f1-news-page .np-tag-featured { font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#fff; background:#e10600; padding:0.22rem 0.65rem; border-radius:2px; }
  .f1-news-page .np-tag-latest { font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.35); border:1px solid rgba(255,255,255,0.12); padding:0.22rem 0.65rem; border-radius:2px; display:inline-flex; align-items:center; gap:0.3rem; }
  .f1-news-page .np-feat-title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:900; text-transform:uppercase; letter-spacing:0.01em; line-height:1.1; color:#fff; margin:0 0 1rem; padding:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .f1-news-page .np-feat-meta { display:flex; align-items:center; gap:1rem; font-size:0.78rem; color:rgba(255,255,255,0.3); margin-bottom:1rem; flex-wrap:wrap; }
  .f1-news-page .np-feat-meta span { display:inline-flex; align-items:center; gap:0.35rem; }
  .f1-news-page .np-feat-excerpt { font-size:0.85rem; color:rgba(255,255,255,0.38); line-height:1.7; display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; flex:1; }
  .f1-news-page .np-feat-cta { display:inline-flex; align-items:center; gap:0.35rem; font-size:0.73rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#e10600; margin-top:1.5rem; transition:gap 0.2s ease; }
  .f1-news-page .np-featured:hover .np-feat-cta { gap:0.6rem; }

  /* ── DIVIDER ──────────────────────────── */
  .f1-news-page .np-divider { display:flex; align-items:center; gap:1rem; margin:2.5rem 0 2rem; }
  .f1-news-page .np-divider-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }
  .f1-news-page .np-divider-txt { font-family:'Barlow Condensed',sans-serif; font-size:0.68rem; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.25); white-space:nowrap; }

  /* ── NEWS GRID ────────────────────────── */
  .f1-news-page .np-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:2px; }

  /* ── REGULAR CARD ─────────────────────── */
  .f1-news-page .np-card { background:#111114; border:1px solid rgba(255,255,255,0.05); overflow:hidden; display:flex; flex-direction:column; text-decoration:none; color:inherit; transition:background 0.3s ease,transform 0.3s ease; animation:np-rise 0.4s ease both; position:relative; }
  .f1-news-page .np-card:hover { background:#17171c; transform:translateY(-3px); z-index:2; }
  .f1-news-page .np-card:nth-child(1){animation-delay:0.03s}.f1-news-page .np-card:nth-child(2){animation-delay:0.06s}.f1-news-page .np-card:nth-child(3){animation-delay:0.09s}.f1-news-page .np-card:nth-child(4){animation-delay:0.12s}.f1-news-page .np-card:nth-child(5){animation-delay:0.15s}.f1-news-page .np-card:nth-child(6){animation-delay:0.18s}.f1-news-page .np-card:nth-child(7){animation-delay:0.21s}.f1-news-page .np-card:nth-child(8){animation-delay:0.24s}.f1-news-page .np-card:nth-child(9){animation-delay:0.27s}.f1-news-page .np-card:nth-child(10){animation-delay:0.30s}.f1-news-page .np-card:nth-child(11){animation-delay:0.33s}.f1-news-page .np-card:nth-child(12){animation-delay:0.36s}
  .f1-news-page .np-card-bar { position:absolute; top:0; left:0; right:0; height:2px; background:#e10600; opacity:0; transition:opacity 0.3s ease; }
  .f1-news-page .np-card:hover .np-card-bar { opacity:1; }
  .f1-news-page .np-card-img-wrap { overflow:hidden; }
  .f1-news-page .np-card-img { width:100%; aspect-ratio:3/2; object-fit:cover; object-position:center top; display:block; filter:saturate(0.75); transition:filter 0.3s ease,transform 0.4s ease; }
  .f1-news-page .np-card:hover .np-card-img { filter:saturate(1); transform:scale(1.04); }
  .f1-news-page .np-card-body { padding:1.4rem 1.5rem 1.6rem; flex:1; display:flex; flex-direction:column; }
  .f1-news-page .np-card-meta { display:flex; align-items:center; justify-content:space-between; font-size:0.72rem; color:rgba(255,255,255,0.28); margin-bottom:0.7rem; gap:0.5rem; }
  .f1-news-page .np-card-meta span { display:inline-flex; align-items:center; gap:0.3rem; }
  .f1-news-page .np-card-title { font-family:'Barlow Condensed',sans-serif; font-size:1.2rem; font-weight:900; text-transform:uppercase; letter-spacing:0.01em; color:#fff; line-height:1.15; margin:0 0 0.6rem; padding:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .f1-news-page .np-card-excerpt { font-size:0.78rem; color:rgba(255,255,255,0.32); line-height:1.65; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; flex:1; margin-bottom:1rem; }
  .f1-news-page .np-card-cta { display:inline-flex; align-items:center; gap:0.3rem; font-size:0.72rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#e10600; margin-top:auto; transition:gap 0.2s ease; padding-top:0.9rem; border-top:1px solid rgba(255,255,255,0.06); width:100%; }
  .f1-news-page .np-card:hover .np-card-cta { gap:0.55rem; }

  /* ── PAGINATION ───────────────────────── */
  .f1-news-page .np-pagination {
    display:flex; align-items:center; justify-content:center; gap:0.35rem;
    margin-top:3rem; padding-top:2.5rem;
    border-top:1px solid rgba(255,255,255,0.06);
    flex-wrap:wrap;
  }
  .f1-news-page .np-page-info {
    font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:600;
    letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.22);
    margin:0 0.75rem;
  }
  .f1-news-page .np-page-btn {
    display:inline-flex; align-items:center; justify-content:center;
    min-width:2.2rem; height:2.2rem; padding:0 0.5rem;
    font-family:'Barlow Condensed',sans-serif; font-size:0.95rem; font-weight:700;
    background:transparent; border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.4); cursor:pointer; border-radius:2px;
    transition:all 0.2s ease;
  }
  .f1-news-page .np-page-btn:hover:not(:disabled) {
    background:rgba(255,255,255,0.05); color:#fff; border-color:rgba(255,255,255,0.25);
  }
  .f1-news-page .np-page-btn.active {
    background:#e10600; border-color:#e10600; color:#fff;
  }
  .f1-news-page .np-page-btn:disabled { opacity:0.2; cursor:not-allowed; }
  .f1-news-page .np-page-arrow {
    display:inline-flex; align-items:center; justify-content:center;
    width:2.2rem; height:2.2rem;
    background:transparent; border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.4); cursor:pointer; border-radius:2px;
    transition:all 0.2s ease;
  }
  .f1-news-page .np-page-arrow:hover:not(:disabled) {
    background:rgba(225,6,0,0.1); border-color:rgba(225,6,0,0.35); color:#e10600;
  }
  .f1-news-page .np-page-arrow:disabled { opacity:0.2; cursor:not-allowed; }

  /* ── EMPTY STATE ──────────────────────── */
  .f1-news-page .np-empty { background:#111114; border:1px solid rgba(255,255,255,0.05); padding:4rem; text-align:center; }
  .f1-news-page .np-empty-txt { font-family:'Barlow Condensed',sans-serif; font-size:1rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin:1rem 0 1.5rem; padding:0; }
  .f1-news-page .np-btn { display:inline-flex; align-items:center; gap:0.4rem; font-family:'Barlow Condensed',sans-serif; font-size:0.75rem; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#fff; background:#e10600; text-decoration:none; padding:0.6rem 1.25rem; border-radius:2px; transition:background 0.2s ease; }
  .f1-news-page .np-btn:hover { background:#c00; }

  /* ── LOADING ──────────────────────────── */
  .f1-news-page .np-loading { min-height:55vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; background:#0a0a0c; }
  .f1-news-page .np-bar-track { width:200px; height:2px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
  .f1-news-page .np-bar-fill { height:100%; background:#e10600; border-radius:2px; animation:np-slide 1.2s ease-in-out infinite; }
  .f1-news-page .np-load-txt { font-family:'Barlow Condensed',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.28); margin:0; padding:0; }

  @keyframes np-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes np-rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:700px){
    .f1-news-page .np-featured { grid-template-columns:1fr; }
    .f1-news-page .np-feat-img { min-height:280px; }
  }
`;

const PAGE_SIZE = 12;

const formatDate = (dateStr, full = false) =>
  new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
    ...(full && { hour: '2-digit', minute: '2-digit' }),
  });

const readTime = (text) => Math.max(1, Math.ceil((text?.length || 0) / 800));

const buildNewsUrl = (item) => {
  const d = new Date(item.created_at);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `/news/${y}/${m}/${item.slug}`;
};

const News = () => {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  useEffect(() => {
    supabase.from('news').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        setNews(data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="f1-news-page">
      <style>{SCOPED_CSS}</style>
      <div className="np-loading">
        <div className="np-bar-track"><div className="np-bar-fill" /></div>
        <p className="np-load-txt">Loading News</p>
      </div>
    </div>
  );

  const featured   = news[0];
  const allRest    = news.slice(1);
  const totalPages = Math.ceil(allRest.length / PAGE_SIZE);
  const pageItems  = allRest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  return (
    <div className="f1-news-page">
      <style>{SCOPED_CSS}</style>

      <div className="np-wrap">
        <div className="np-grid-bg" />
        <div className="np-glow" />
        <div className="np-inner">

          {/* Header */}
          <header className="np-hd">
            <div className="np-eyebrow">
              <Newspaper size={12} color="#e10600" />
              <p className="np-eyebrow-txt">Formula 1 Championship</p>
              <div className="np-eyebrow-line" />
            </div>
            <h1 className="np-title">ข่าวสาร <em>F1</em><span className="np-badge">2026</span></h1>
            <div className="np-subtitle">
              <span>{news.length} บทความ</span>
              <span>•</span>
              <span>อัพเดทล่าสุด</span>
            </div>
            <div className="np-ghost">{news.length}</div>
          </header>

          {news.length > 0 ? (
            <>
              {/* Featured — หน้าแรกเท่านั้น */}
              {featured && page === 1 && (
                <Link
                  to={featured.slug ? buildNewsUrl(featured) : `/news/${featured.id}`}
                  className="np-featured"
                >
                  <div className="np-feat-bar" />
                  {featured.image_url && (
                    <div className="np-feat-img-wrap">
                      <img src={featured.image_url} alt={featured.title} className="np-feat-img" />
                    </div>
                  )}
                  <div className="np-feat-body">
                    <div className="np-feat-ghost">01</div>
                    <div>
                      <div className="np-feat-tags">
                        <span className="np-tag-featured">ข่าวเด่น</span>
                        <span className="np-tag-latest"><TrendingUp size={10} /> ล่าสุด</span>
                      </div>
                      <h2 className="np-feat-title">{featured.title}</h2>
                      <div className="np-feat-meta">
                        <span><Calendar size={13} />{formatDate(featured.created_at, true)}</span>
                        <span><Clock size={13} />อ่าน {readTime(featured.content)} นาที</span>
                      </div>
                      <p className="np-feat-excerpt">{featured.content}</p>
                    </div>
                    <span className="np-feat-cta">อ่านต่อ <ChevronRight size={14} /></span>
                  </div>
                </Link>
              )}

              {/* Divider */}
              {pageItems.length > 0 && (
                <div className="np-divider">
                  <div className="np-divider-line" />
                  <span className="np-divider-txt">
                    {totalPages > 1 ? `หน้า ${page} จาก ${totalPages}` : 'ข่าวทั้งหมด'}
                  </span>
                  <div className="np-divider-line" />
                </div>
              )}

              {/* Grid */}
              {pageItems.length > 0 && (
                <div className="np-grid">
                  {pageItems.map((item, i) => (
                    <Link
                      key={item.id}
                      to={item.slug ? buildNewsUrl(item) : `/news/${item.id}`}
                      className="np-card"
                      style={{ animationDelay: `${0.03 + i * 0.03}s` }}
                    >
                      <div className="np-card-bar" />
                      {item.image_url && (
                        <div className="np-card-img-wrap">
                          <img src={item.image_url} alt={item.title} className="np-card-img" />
                        </div>
                      )}
                      <div className="np-card-body">
                        <div className="np-card-meta">
                          <span><Calendar size={11} />{formatDate(item.created_at)}</span>
                          <span><Clock size={11} />{readTime(item.content)} นาที</span>
                        </div>
                        <h3 className="np-card-title">{item.title}</h3>
                        <p className="np-card-excerpt">{item.content}</p>
                        <span className="np-card-cta">อ่านต่อ <ChevronRight size={12} /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="np-pagination">
                  <button
                    className="np-page-arrow"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {getPageNumbers().map((n) => (
                    <button
                      key={n}
                      className={`np-page-btn${page === n ? ' active' : ''}`}
                      onClick={() => handlePageChange(n)}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    className="np-page-arrow"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight size={15} />
                  </button>

                  <span className="np-page-info">{page} / {totalPages}</span>
                </div>
              )}
            </>
          ) : (
            <div className="np-empty">
              <Newspaper size={40} color="rgba(255,255,255,0.08)" />
              <p className="np-empty-txt">ยังไม่มีข่าวสาร</p>
              <Link to="/" className="np-btn">กลับสู่หน้าแรก <ChevronRight size={13} /></Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default News;