import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Facebook } from 'lucide-react';
import { supabase } from '../config/supabase';
import { Helmet } from 'react-helmet-async';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-news-detail {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
    background: #0a0a0c;
    min-height: 100vh;
  }
  .f1-news-detail *, .f1-news-detail *::before, .f1-news-detail *::after {
    box-sizing: border-box;
  }

  /* ── HERO IMAGE fullscreen ───────────── */
  .f1-news-detail .nd-hero {
    width: 100%; height: 100vh;
    position: relative; overflow: hidden;
  }
  .f1-news-detail .nd-hero img {
    width: 100%; height: 100%; object-fit: cover;
    object-position: center top;
    filter: saturate(0.85);
  }
  /* Strong bottom fade so title is readable */
  .f1-news-detail .nd-hero-fade {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      #0a0a0c 0%,
      rgba(10,10,12,0.75) 35%,
      rgba(10,10,12,0.2) 65%,
      transparent 100%
    );
  }
  /* Grid overlay */
  .f1-news-detail .nd-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }
  /* Title pinned to bottom of hero */
  .f1-news-detail .nd-hero-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    max-width: 860px; margin: 0 auto;
    padding: 0 2rem 3rem;
    z-index: 2;
  }
  .f1-news-detail .nd-hero-back {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    background: none; border: none; cursor: pointer;
    padding: 0; margin-bottom: 1.5rem;
    transition: color 0.2s ease;
  }
  .f1-news-detail .nd-hero-back:hover { color: #e10600; }
  .f1-news-detail .nd-hero-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.85rem;
  }
  .f1-news-detail .nd-hero-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #e10600; flex-shrink: 0;
  }
  .f1-news-detail .nd-hero-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0;
  }
  .f1-news-detail .nd-hero-eyebrow-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .f1-news-detail .nd-hero-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900;
    text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.05;
    color: #ffffff; margin: 0; padding: 0;
    text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  }
  /* Scroll hint */
  .f1-news-detail .nd-scroll-hint {
    position: absolute; bottom: 1.5rem; right: 2rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    animation: nd-bounce 2s ease-in-out infinite;
  }

  /* ── CONTENT WRAPPER ─────────────────── */
  .f1-news-detail .nd-wrap {
    position: relative;
    max-width: 860px;
    margin: 0 auto;
    padding: 3.5rem 2rem 6rem;
    z-index: 1;
  }

  /* ── ARTICLE ─────────────────────────── */
  .f1-news-detail .nd-article {
    animation: nd-rise 0.5s ease both;
  }

  /* Eyebrow */
  .f1-news-detail .nd-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
  }
  .f1-news-detail .nd-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #e10600; flex-shrink: 0;
  }
  .f1-news-detail .nd-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0;
  }
  .f1-news-detail .nd-eyebrow-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }

  /* Title */
  .f1-news-detail .nd-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
    text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.05;
    color: #ffffff; margin: 0 0 1.75rem; padding: 0;
  }

  /* Meta row */
  .f1-news-detail .nd-meta {
    display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .f1-news-detail .nd-meta-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.3);
    text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500;
  }

  /* Body content */
  .f1-news-detail .nd-body {
    font-size: 1.05rem; line-height: 1.85;
    color: rgba(255,255,255,0.72);
    white-space: pre-wrap;
    margin-bottom: 2.5rem;
  }

  /* Content image */
  .f1-news-detail .nd-content-img {
    width: 100%; border-radius: 2px;
    margin: 2rem 0;
    border: 1px solid rgba(255,255,255,0.06);
    filter: saturate(0.9);
  }

  /* ── SHARE SECTION ───────────────────── */
  .f1-news-detail .nd-share {
    margin-top: 3.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .f1-news-detail .nd-share-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); margin: 0 0 1.25rem; padding: 0;
  }
  .f1-news-detail .nd-share-btns {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
  }
  .f1-news-detail .nd-share-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.65rem 1.25rem; border: none; cursor: pointer;
    border-radius: 2px; transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .f1-news-detail .nd-share-btn:hover { opacity: 0.85; transform: translateY(-1px); }
  .f1-news-detail .nd-share-btn-fb   { background: #1877f2; color: #fff; }
  .f1-news-detail .nd-share-btn-x    { background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.15); }
  .f1-news-detail .nd-share-btn-copy {
    background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ── FOOTER CTA ──────────────────────── */
  .f1-news-detail .nd-cta {
    margin-top: 3.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .f1-news-detail .nd-cta-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); margin: 0 0 1.25rem; padding: 0;
  }
  .f1-news-detail .nd-cta-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    background: #e10600; color: #fff;
    padding: 0.75rem 1.75rem; border: none; cursor: pointer; border-radius: 2px;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .f1-news-detail .nd-cta-btn:hover { background: #c00500; transform: translateY(-1px); }

  /* ── LOADING ─────────────────────────── */
  .f1-news-detail .nd-loading {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .f1-news-detail .nd-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .f1-news-detail .nd-bar-fill {
    height: 100%; background: #e10600;
    animation: nd-slide 1.2s ease-in-out infinite;
  }
  .f1-news-detail .nd-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  /* ── NOT FOUND ───────────────────────── */
  .f1-news-detail .nd-notfound {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1.5rem; background: #0a0a0c;
    text-align: center;
  }
  .f1-news-detail .nd-notfound-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 3rem; font-weight: 900; text-transform: uppercase;
    color: rgba(255,255,255,0.15); margin: 0;
  }
  .f1-news-detail .nd-notfound-sub {
    font-size: 0.9rem; color: rgba(255,255,255,0.35); margin: 0;
  }

  @keyframes nd-bounce {
    0%, 100% { transform: translateY(0); opacity: 0.2; }
    50% { transform: translateY(4px); opacity: 0.45; }
  }
  @keyframes nd-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes nd-rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareFacebook = () => {
    if (!news) return;
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      'facebook-share-dialog', 'width=626,height=436'
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('คัดลอกลิงก์แล้ว!');
  };

  const handleShareX = () => {
    const url = window.location.href;
    const text = news.title;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      'twitter-share', 'width=550,height=420'
    );
  };

  return (
    <div className="f1-news-detail">
      <style>{SCOPED_CSS}</style>

      {/* Loading */}
      {loading && (
        <div className="nd-loading">
          <div className="nd-bar-track"><div className="nd-bar-fill" /></div>
          <p className="nd-load-txt">Loading Article</p>
        </div>
      )}

      {/* Not Found */}
      {!loading && !news && (
        <div className="nd-notfound">
          <p className="nd-notfound-title">ไม่พบข่าว</p>
          <p className="nd-notfound-sub">ข่าวที่คุณกำลังมองหาอาจถูกลบหรือย้ายไปแล้ว</p>
          <button className="nd-cta-btn" onClick={() => navigate('/')}>
            กลับสู่หน้าแรก
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && news && (
        <>
          {/* Meta tags */}
          <Helmet>
            <title>{news.title} | F1 Racing Hub</title>
            <meta name="title" content={news.title} />
            <meta name="description" content={news.content.substring(0, 160)} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:title" content={news.title} />
            <meta property="og:description" content={news.content.substring(0, 160)} />
            {news.image_url && <meta property="og:image" content={news.image_url} />}
            <meta property="og:site_name" content="F1 Racing Hub" />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={window.location.href} />
            <meta property="twitter:title" content={news.title} />
            <meta property="twitter:description" content={news.content.substring(0, 160)} />
            {news.image_url && <meta property="twitter:image" content={news.image_url} />}
          </Helmet>

          {/* Hero — fullscreen with title pinned at bottom */}
          {news.image_url && (
            <div className="nd-hero">
              <img src={news.image_url} alt={news.title} />
              <div className="nd-hero-grid" />
              <div className="nd-hero-fade" />

              {/* Back + Title overlaid on hero */}
              <div className="nd-hero-content">
                <button className="nd-hero-back" onClick={() => navigate('/')}>
                  <ArrowLeft size={13} />
                  กลับสู่หน้าแรก
                </button>
                <div className="nd-hero-eyebrow">
                  <div className="nd-hero-eyebrow-dot" />
                  <p className="nd-hero-eyebrow-txt">F1 Racing Hub — ข่าวสาร</p>
                  <div className="nd-hero-eyebrow-line" />
                </div>
                <h1 className="nd-hero-title">{news.title}</h1>
              </div>

              {/* Scroll hint */}
              <div className="nd-scroll-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                scroll
              </div>
            </div>
          )}

          {/* Article — scrolls below hero */}
          <div className="nd-wrap">
            <article className="nd-article">
              {/* Meta */}
              <div className="nd-meta">
                <div className="nd-meta-item">
                  <Calendar size={12} />
                  <span>
                    {new Date(news.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="nd-meta-item">
                  <User size={12} />
                  <span>F1 Racing Hub</span>
                </div>
              </div>

              {/* Body */}
              <div className="nd-body">{news.content}</div>

              {/* Content image */}
              {news.image_url && (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="nd-content-img"
                />
              )}

              {/* Share */}
              <div className="nd-share">
                <p className="nd-share-title">แชร์ข่าวนี้</p>
                <div className="nd-share-btns">
                  <button className="nd-share-btn nd-share-btn-fb" onClick={handleShareFacebook}>
                    <Facebook size={14} />
                    Facebook
                  </button>
                  <button className="nd-share-btn nd-share-btn-x" onClick={handleShareX}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    แชร์บน X
                  </button>
                  <button className="nd-share-btn nd-share-btn-copy" onClick={handleCopyLink}>
                    <Share2 size={13} />
                    คัดลอกลิงก์
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="nd-cta">
                <p className="nd-cta-label">ข่าวอื่นๆ</p>
                <button className="nd-cta-btn" onClick={() => navigate('/')}>
                  ดูข่าวทั้งหมด
                </button>
              </div>

            </article>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsDetail;