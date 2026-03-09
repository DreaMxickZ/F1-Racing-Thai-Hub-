import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../config/supabase';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500&display=swap');

:root{--bg:#070708;--s1:#0e0e11;--s2:#141418;--bd:rgba(255,255,255,0.06);--bd2:rgba(255,255,255,0.1);--red:#e10600;--txt:#ececec;--t2:rgba(255,255,255,0.42);--t3:rgba(255,255,255,0.18);}

.km{font-family:'Barlow',sans-serif;color:var(--txt);background:var(--bg);min-height:100vh;}
.km *,.km *::before,.km *::after{box-sizing:border-box;margin:0;padding:0;}

.km-atm{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 70% 40% at 50% -5%,rgba(225,6,0,0.06) 0%,transparent 65%),
    repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px);
}
.km-wrap{max-width:1100px;margin:0 auto;padding:0 2rem 6rem;position:relative;z-index:1;}

/* ── HEADER ── */
.km-hd{padding:4rem 0 3rem;display:flex;align-items:flex-end;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;border-bottom:1px solid var(--bd);margin-bottom:3rem;position:relative;overflow:hidden;}
.km-hd::after{content:'KB';position:absolute;right:-0.5rem;bottom:-1.5rem;font-family:'Barlow Condensed',sans-serif;font-size:8rem;font-weight:900;color:rgba(255,255,255,0.025);letter-spacing:-0.05em;user-select:none;pointer-events:none;line-height:1;}
.km-eyebrow{display:inline-flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:var(--red);margin-bottom:0.75rem;}
.km-eyebrow::before{content:'';width:22px;height:1px;background:var(--red);}
.km-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;line-height:0.88;text-transform:uppercase;color:#fff;}
.km-title em{font-style:italic;color:var(--red);}

.km-add{display:inline-flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-size:0.8rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;background:var(--red);color:#fff;padding:0.7rem 1.4rem;text-decoration:none;transition:background 0.2s,box-shadow 0.2s;box-shadow:0 0 20px rgba(225,6,0,0.25);}
.km-add:hover{background:#c00500;box-shadow:0 0 28px rgba(225,6,0,0.35);}

/* ── TABLE ── */
.km-table-wrap{background:var(--s1);border:1px solid var(--bd);}
.km-table-head{display:grid;grid-template-columns:64px 1fr 140px 120px 100px;gap:0;padding:0.7rem 1.25rem;background:rgba(0,0,0,0.3);border-bottom:1px solid var(--bd);}
.km-th{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:var(--t3);}

.km-row{display:grid;grid-template-columns:64px 1fr 140px 120px 100px;gap:0;padding:0.9rem 1.25rem;border-bottom:1px solid var(--bd);align-items:center;animation:km-up 0.35s ease both;transition:background 0.2s;}
.km-row:last-child{border-bottom:none;}
.km-row:hover{background:var(--s2);}
.km-row:nth-child(1){animation-delay:0.03s}.km-row:nth-child(2){animation-delay:0.06s}
.km-row:nth-child(3){animation-delay:0.09s}.km-row:nth-child(4){animation-delay:0.12s}
.km-row:nth-child(5){animation-delay:0.15s}.km-row:nth-child(6){animation-delay:0.18s}
.km-row:nth-child(7){animation-delay:0.21s}.km-row:nth-child(8){animation-delay:0.24s}

.km-thumb{width:52px;height:36px;object-fit:cover;display:block;border:1px solid var(--bd2);}
.km-thumb-ph{width:52px;height:36px;background:var(--s2);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;}

.km-row-main{padding:0 1rem;}
.km-row-cat{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:var(--red);margin-bottom:0.2rem;}
.km-row-title{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;text-transform:uppercase;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.km-row-excerpt{font-size:0.75rem;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:0.1rem;}

.km-row-date{font-size:0.75rem;color:var(--t2);}

.km-badge{display:inline-flex;align-items:center;gap:0.35rem;font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;padding:0.2rem 0.55rem;}
.km-badge.pub{background:rgba(34,200,100,0.08);border:1px solid rgba(34,200,100,0.2);color:rgba(34,200,100,0.8);}
.km-badge.draft{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:var(--t3);}
.km-badge-dot{width:5px;height:5px;border-radius:50%;}
.km-badge.pub .km-badge-dot{background:rgba(34,200,100,0.8);}
.km-badge.draft .km-badge-dot{background:var(--t3);}

.km-acts{display:flex;align-items:center;gap:0.35rem;}
.km-act{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all 0.15s;flex-shrink:0;}
.km-act-pub{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:var(--t2);}
.km-act-pub:hover{background:rgba(34,200,100,0.12);border-color:rgba(34,200,100,0.25);color:rgba(34,200,100,0.8);}
.km-act-edit{background:rgba(54,113,198,0.08);border:1px solid rgba(54,113,198,0.18);color:#3671C6;}
.km-act-edit:hover{background:rgba(54,113,198,0.18);}
.km-act-del{background:rgba(225,6,0,0.06);border:1px solid rgba(225,6,0,0.15);color:rgba(225,6,0,0.6);}
.km-act-del:hover{background:rgba(225,6,0,0.14);color:var(--red);}

/* ── MOBILE fallback ── */
@media(max-width:700px){
  .km-table-head{display:none;}
  .km-row{grid-template-columns:52px 1fr auto;grid-template-rows:auto auto;gap:0.5rem;}
  .km-row-date,.km-badge-col{display:none;}
}

/* ── EMPTY / LOAD ── */
.km-empty{text-align:center;padding:5rem 2rem;border:1px dashed var(--bd2);background:var(--s1);}
.km-empty-t{font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:900;text-transform:uppercase;color:var(--t3);margin:1rem 0 0.4rem;}
.km-empty-s{font-size:0.82rem;color:var(--t3);}

.km-load{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;background:var(--bg);}
.km-track{width:180px;height:2px;background:rgba(255,255,255,0.07);overflow:hidden;}
.km-fill{height:100%;background:var(--red);animation:km-slide 1.1s ease-in-out infinite;}
.km-load-t{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;font-weight:800;letter-spacing:0.35em;text-transform:uppercase;color:var(--t3);}

@keyframes km-up   {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes km-slide{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
`;

export default function KnowledgeManagement() {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase
      .from('knowledge')
      .select('*, knowledge_categories(name,icon)')
      .order('created_at',{ascending:false});
    setArticles(data||[]);
    setLoading(false);
  };

  const del = async (id) => {
    if (!confirm('ลบบทความนี้?')) return;
    await supabase.from('knowledge').delete().eq('id',id);
    fetch();
  };

  const togglePub = async (item) => {
    await supabase.from('knowledge').update({published:!item.published}).eq('id',item.id);
    fetch();
  };

  const fmt = (d) => new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'});

  if (loading) return (
    <div className="km"><style>{S}</style>
      <div className="km-load">
        <div className="km-track"><div className="km-fill"/></div>
        <p className="km-load-t">Loading</p>
      </div>
    </div>
  );

  return (
    <div className="km">
      <style>{S}</style>
      <div className="km-atm"/>
      <div className="km-wrap">

        <header className="km-hd">
          <div>
            <div className="km-eyebrow"><BookOpen size={11}/> Admin</div>
            <h1 className="km-title">จัดการ<em>ความรู้ F1</em></h1>
          </div>
          <Link to="/admin/knowledge/create" className="km-add">
            <Plus size={14}/> เพิ่มบทความ
          </Link>
        </header>

        {articles.length === 0 ? (
          <div className="km-empty">
            <BookOpen size={40} color="rgba(255,255,255,0.08)"/>
            <p className="km-empty-t">ยังไม่มีบทความ</p>
            <p className="km-empty-s">สร้างบทความความรู้ F1 บทความแรก</p>
          </div>
        ) : (
          <div className="km-table-wrap">
            <div className="km-table-head">
              <div className="km-th"/>
              <div className="km-th" style={{paddingLeft:'1rem'}}>บทความ</div>
              <div className="km-th">วันที่</div>
              <div className="km-th">สถานะ</div>
              <div className="km-th">จัดการ</div>
            </div>
            {articles.map(a => (
              <div key={a.id} className="km-row">
                {/* Thumb */}
                {a.cover_url
                  ? <img src={a.cover_url} alt="" className="km-thumb"/>
                  : <div className="km-thumb-ph"><BookOpen size={14} color="rgba(255,255,255,0.12)"/></div>
                }
                {/* Title */}
                <div className="km-row-main">
                  <p className="km-row-cat">{a.knowledge_categories?.icon} {a.knowledge_categories?.name}</p>
                  <p className="km-row-title">{a.title}</p>
                  {a.excerpt && <p className="km-row-excerpt">{a.excerpt}</p>}
                </div>
                {/* Date */}
                <div className="km-row-date">{fmt(a.created_at)}</div>
                {/* Status */}
                <div className="km-badge-col">
                  <span className={`km-badge ${a.published?'pub':'draft'}`}>
                    <span className="km-badge-dot"/>
                    {a.published?'Published':'Draft'}
                  </span>
                </div>
                {/* Actions */}
                <div className="km-acts">
                  <button className="km-act km-act-pub" onClick={()=>togglePub(a)} title={a.published?'ซ่อน':'เผยแพร่'}>
                    {a.published ? <EyeOff size={13}/> : <Eye size={13}/>}
                  </button>
                  <Link to={`/admin/knowledge/edit/${a.id}`} className="km-act km-act-edit">
                    <Edit2 size={13}/>
                  </Link>
                  <button className="km-act km-act-del" onClick={()=>del(a.id)}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}