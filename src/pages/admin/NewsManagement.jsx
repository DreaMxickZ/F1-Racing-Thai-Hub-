import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Newspaper, Flag } from 'lucide-react';
import { supabase } from '../../config/supabase';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .nm-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
    background: #0a0a0c;
    min-height: 100vh;
  }
  .nm-page *, .nm-page *::before, .nm-page *::after { box-sizing: border-box; }

  .nm-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .nm-glow {
    position: fixed; top: -10%; left: 50%; transform: translateX(-50%);
    width: 800px; height: 400px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse, rgba(225,6,0,0.06) 0%, transparent 70%);
  }
  .nm-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* Header */
  .nm-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .nm-hd-left {}
  .nm-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .nm-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: #e10600;
    margin: 0; padding: 0; line-height: 1;
  }
  .nm-eyebrow-line {
    flex: 1; max-width: 100px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .nm-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #ffffff; margin: 0; padding: 0;
  }
  .nm-title em { font-style: italic; color: #e10600; }
  .nm-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 3.5rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: 0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }

  /* Add button */
  .nm-btn-add {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: #e10600; color: #fff; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.75rem 1.5rem; text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    white-space: nowrap;
  }
  .nm-btn-add:hover { background: #ff1a0e; transform: translateY(-2px); }

  /* Loading */
  .nm-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .nm-bar-track {
    width: 200px; height: 2px;
    background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;
  }
  .nm-bar-fill {
    height: 100%; background: #e10600; border-radius: 2px;
    animation: nm-slide 1.2s ease-in-out infinite;
  }
  .nm-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
    margin: 0; padding: 0;
  }

  /* News list */
  .nm-list { display: flex; flex-direction: column; gap: 2px; }

  .nm-item {
    background: #111114; border: 1px solid rgba(255,255,255,0.05);
    display: flex; overflow: hidden; position: relative;
    transition: background 0.3s ease, transform 0.3s ease;
    animation: nm-rise 0.4s ease both;
  }
  .nm-item:hover { background: #17171c; transform: translateY(-2px); z-index: 2; }
  .nm-item:nth-child(1) { animation-delay: 0.04s }
  .nm-item:nth-child(2) { animation-delay: 0.08s }
  .nm-item:nth-child(3) { animation-delay: 0.12s }
  .nm-item:nth-child(4) { animation-delay: 0.16s }
  .nm-item:nth-child(5) { animation-delay: 0.20s }

  .nm-item-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: #e10600; opacity: 0; transition: opacity 0.3s ease;
  }
  .nm-item:hover .nm-item-bar { opacity: 1; }

  .nm-item-img {
    width: 220px; flex-shrink: 0; overflow: hidden;
  }
  .nm-item-img img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(0.7); transition: filter 0.3s ease;
  }
  .nm-item:hover .nm-item-img img { filter: saturate(1); }

  .nm-item-body {
    flex: 1; padding: 1.75rem 2rem; display: flex;
    align-items: center; justify-content: space-between; gap: 1.5rem;
  }
  .nm-item-info { flex: 1; }
  .nm-item-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em;
    color: #e10600; text-transform: uppercase; margin-bottom: 0.5rem;
    display: block;
  }
  .nm-item-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.02em; color: #ffffff; margin: 0 0 0.5rem; line-height: 1.1;
    text-decoration: none; display: block;
    transition: color 0.2s ease;
  }
  .nm-item-title:hover { color: #e10600; }
  .nm-item-slug {
    font-size: 0.7rem; color: rgba(255,255,255,0.2);
    font-weight: 500; letter-spacing: 0.04em;
    margin: 0 0 0.4rem; font-family: monospace;
  }
  .nm-item-excerpt {
    font-size: 0.82rem; color: rgba(255,255,255,0.35);
    line-height: 1.5; margin: 0 0 0.75rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .nm-item-date {
    font-size: 0.7rem; color: rgba(255,255,255,0.22);
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  }

  .nm-item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .nm-btn-edit, .nm-btn-del {
    display: flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    transition: transform 0.2s ease, background 0.2s ease;
    text-decoration: none;
  }
  .nm-btn-edit { background: rgba(99,179,237,0.12); color: #63b3ed; }
  .nm-btn-edit:hover { background: #2b6cb0; color: #fff; transform: translateY(-2px); }
  .nm-btn-del { background: rgba(225,6,0,0.12); color: #e10600; }
  .nm-btn-del:hover { background: #e10600; color: #fff; transform: translateY(-2px); }

  /* No slug badge */
  .nm-no-slug {
    display: inline-block;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(225,6,0,0.15); color: #e10600;
    padding: 0.2rem 0.5rem; margin-bottom: 0.4rem;
  }

  /* Empty state */
  .nm-empty {
    background: #111114; border: 1px solid rgba(255,255,255,0.05);
    padding: 5rem 2rem; text-align: center;
  }
  .nm-empty-icon { color: rgba(255,255,255,0.1); margin: 0 auto 1.5rem; display: block; }
  .nm-empty-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.4rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: rgba(255,255,255,0.25); margin: 0 0 1.5rem;
  }

  @keyframes nm-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes nm-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// สร้าง URL แบบ SEO จาก news item
const buildNewsUrl = (item) => {
  const d = new Date(item.created_at);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  // ถ้ายังไม่มี slug ใช้ id เป็น fallback
  return item.slug ? `/news/${y}/${m}/${item.slug}` : `/news/${item.id}`;
};

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      fetchNews();
      alert('ลบข่าวสำเร็จ');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('เกิดข้อผิดพลาดในการลบข่าว');
    }
  };

  if (loading) {
    return (
      <div className="nm-page">
        <style>{SCOPED_CSS}</style>
        <div className="nm-loading">
          <div className="nm-bar-track"><div className="nm-bar-fill" /></div>
          <p className="nm-load-txt">Loading News</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nm-page">
      <style>{SCOPED_CSS}</style>
      <div className="nm-grid-bg" />
      <div className="nm-glow" />
      <div className="nm-inner">

        <header className="nm-hd">
          <div className="nm-hd-left">
            <div className="nm-eyebrow">
              <Flag size={12} color="#e10600" />
              <p className="nm-eyebrow-txt">Admin Panel</p>
              <div className="nm-eyebrow-line" />
            </div>
            <h1 className="nm-title">จัดการ<em>ข่าวสาร</em></h1>
          </div>
          <Link to="/admin/news/create" className="nm-btn-add">
            <Plus size={16} />
            เพิ่มข่าวใหม่
          </Link>
          <div className="nm-ghost-num">{news.length}</div>
        </header>

        {news.length > 0 ? (
          <div className="nm-list">
            {news.map((item, i) => (
              <div key={item.id} className="nm-item">
                <div className="nm-item-bar" />

                {item.image_url && (
                  <div className="nm-item-img">
                    <img src={item.image_url} alt={item.title} />
                  </div>
                )}

                <div className="nm-item-body">
                  <div className="nm-item-info">
                    <span className="nm-item-num">NEWS — {String(i + 1).padStart(2, '0')}</span>

                    {/* Title เป็น link ไปหน้าดูข่าว */}
                    <Link to={buildNewsUrl(item)} className="nm-item-title" target="_blank">
                      {item.title}
                    </Link>

                    {/* แสดง slug หรือ warning ถ้ายังไม่มี */}
                    {item.slug
                      ? <p className="nm-item-slug">/{buildNewsUrl(item)}</p>
                      : <span className="nm-no-slug">⚠ ยังไม่มี slug — กรุณาแก้ไข</span>
                    }

                    <p className="nm-item-excerpt">{item.content}</p>
                    <span className="nm-item-date">
                      {new Date(item.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="nm-item-actions">
                    <Link to={`/admin/news/edit/${item.id}`} className="nm-btn-edit">
                      <Edit size={17} />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="nm-btn-del">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="nm-empty">
            <Newspaper size={56} className="nm-empty-icon" />
            <p className="nm-empty-txt">ยังไม่มีข่าวสาร</p>
            <Link to="/admin/news/create" className="nm-btn-add">
              <Plus size={16} />
              เพิ่มข่าวแรก
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;