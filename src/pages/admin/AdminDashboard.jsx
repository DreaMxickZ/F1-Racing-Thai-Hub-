import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, BookOpen, Users, ChevronRight, Zap } from 'lucide-react';
import { supabase } from '../../config/supabase';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,600;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

:root{--bg:#070708;--s1:#0e0e11;--s2:#141418;--bd:rgba(255,255,255,0.06);--bd2:rgba(255,255,255,0.1);--red:#e10600;--red2:rgba(225,6,0,0.12);--txt:#ececec;--t2:rgba(255,255,255,0.45);--t3:rgba(255,255,255,0.18);}

.ad{font-family:'Barlow',sans-serif;color:var(--txt);background:var(--bg);min-height:100vh;}
.ad *,.ad *::before,.ad *::after{box-sizing:border-box;margin:0;padding:0;}

.ad-atm{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 70% 50% at 50% -5%,rgba(225,6,0,0.07) 0%,transparent 70%),
    repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.013) 79px,rgba(255,255,255,0.013) 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.013) 79px,rgba(255,255,255,0.013) 80px);
}
.ad-wrap{max-width:1180px;margin:0 auto;padding:0 2rem 6rem;position:relative;z-index:1;}

/* ── HEADER ── */
.ad-hd{padding:5rem 0 4rem;display:grid;grid-template-columns:1fr auto;align-items:end;gap:2rem;border-bottom:1px solid var(--bd);margin-bottom:4rem;position:relative;overflow:hidden;}
.ad-hd::after{content:'ADMIN';position:absolute;right:-1rem;bottom:-1.5rem;font-family:'Barlow Condensed',sans-serif;font-size:10rem;font-weight:900;color:rgba(255,255,255,0.025);letter-spacing:-0.05em;user-select:none;pointer-events:none;line-height:1;}
.ad-eyebrow{display:inline-flex;align-items:center;gap:0.6rem;font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:var(--red);margin-bottom:1rem;}
.ad-eyebrow::before{content:'';width:28px;height:1px;background:var(--red);}
.ad-hd-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(3rem,7vw,5.5rem);font-weight:900;line-height:0.88;text-transform:uppercase;color:#fff;}
.ad-hd-title em{font-style:italic;color:var(--red);}
.ad-hd-sub{font-size:0.88rem;color:var(--t2);margin-top:1rem;max-width:360px;line-height:1.6;}

/* ── STATS ── */
.ad-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-bottom:4rem;background:var(--bd);}
.ad-stat{
  background:var(--s1);padding:2rem 2rem 1.75rem;position:relative;overflow:hidden;
  animation:ad-up 0.4s ease both;
}
.ad-stat:nth-child(1){animation-delay:0.05s}
.ad-stat:nth-child(2){animation-delay:0.10s}
.ad-stat:nth-child(3){animation-delay:0.15s}
.ad-stat-accent{position:absolute;top:0;left:0;right:0;height:2px;}
.ad-stat-ghost{position:absolute;right:-0.25rem;bottom:-1rem;font-family:'Barlow Condensed',sans-serif;font-size:7rem;font-weight:900;color:rgba(255,255,255,0.03);line-height:1;user-select:none;}
.ad-stat-label{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:var(--t3);margin-bottom:0.6rem;}
.ad-stat-num{font-family:'Barlow Condensed',sans-serif;font-size:3.5rem;font-weight:900;line-height:1;color:#fff;}
.ad-stat-unit{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--t2);margin-top:0.3rem;}
@media(max-width:600px){.ad-stats{grid-template-columns:1fr}}

/* ── MENU ── */
.ad-sec-label{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:var(--t3);margin-bottom:1.25rem;display:flex;align-items:center;gap:0.75rem;}
.ad-sec-label::after{content:'';flex:1;height:1px;background:var(--bd);}

.ad-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1px;background:var(--bd);}
.ad-card{
  background:var(--s1);padding:2rem;display:flex;align-items:center;gap:1.25rem;
  text-decoration:none;position:relative;overflow:hidden;
  transition:background 0.25s;animation:ad-up 0.45s ease both;
}
.ad-card:nth-child(1){animation-delay:0.08s}
.ad-card:nth-child(2){animation-delay:0.13s}
.ad-card:nth-child(3){animation-delay:0.18s}
.ad-card:hover{background:var(--s2);}
.ad-card-stripe{position:absolute;top:0;left:0;bottom:0;width:3px;opacity:0;transition:opacity 0.25s;}
.ad-card:hover .ad-card-stripe{opacity:1;}
.ad-card-icon{width:52px;height:52px;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ad-card-text{flex:1;min-width:0;}
.ad-card-name{font-family:'Barlow Condensed',sans-serif;font-size:1.05rem;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;color:#fff;margin-bottom:0.3rem;}
.ad-card-desc{font-size:0.78rem;color:var(--t2);line-height:1.5;}
.ad-card-arrow{color:var(--t3);flex-shrink:0;transition:color 0.2s,transform 0.2s;}
.ad-card:hover .ad-card-arrow{color:var(--red);transform:translateX(4px);}

@keyframes ad-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
`;

const MENUS = [
  { to:'/admin/news',      icon:Newspaper, name:'จัดการข่าวสาร',   desc:'เพิ่ม แก้ไข ลบข่าว F1 พร้อมรูปภาพ',              iconBg:'rgba(225,6,0,0.1)',       iconColor:'#e10600',  stripe:'#e10600'  },
  { to:'/admin/knowledge', icon:BookOpen,  name:'จัดการความรู้',   desc:'เขียนบทความด้วย Block Editor พร้อมรูปภาพ',        iconBg:'rgba(54,113,198,0.12)',    iconColor:'#3671C6',  stripe:'#3671C6'  },
  { to:'/admin/drivers',   icon:Users,     name:'จัดการนักแข่ง',  desc:'อัพโหลดรูปนักแข่ง รูปรถ และข้อมูลทีม',            iconBg:'rgba(34,153,113,0.12)',    iconColor:'#229971',  stripe:'#229971'  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ news:'—', knowledge:'—' });

  useEffect(() => {
    Promise.all([
      supabase.from('news').select('*',{count:'exact',head:true}),
      supabase.from('knowledge').select('*',{count:'exact',head:true}),
    ]).then(([{count:n},{count:k}]) => setStats({ news:n??0, knowledge:k??0 }));
  }, []);

  return (
    <div className="ad">
      <style>{S}</style>
      <div className="ad-atm"/>
      <div className="ad-wrap">

        <header className="ad-hd">
          <div>
            <div className="ad-eyebrow"><Zap size={11}/> F1 Thai Hub</div>
            <h1 className="ad-hd-title">ระบบ<br/><em>จัดการ</em></h1>
            <p className="ad-hd-sub">จัดการข้อมูล เพิ่มข่าวสาร อัพโหลดรูปภาพ และบทความความรู้ F1</p>
          </div>
        </header>

        {/* Stats */}
        <div className="ad-stats">
          {[
            { label:'ข่าวสาร',    num:stats.news,      unit:'บทความ', accent:'#e10600', ghost:'N' },
            { label:'ความรู้ F1', num:stats.knowledge, unit:'บทความ', accent:'#3671C6', ghost:'K' },
            { label:'ทีม F1',    num:11,              unit:'ทีม',   accent:'#229971', ghost:'T' },
          ].map((s,i) => (
            <div key={i} className="ad-stat">
              <div className="ad-stat-accent" style={{background:s.accent}}/>
              <p className="ad-stat-label">{s.label}</p>
              <p className="ad-stat-num">{String(s.num).padStart(2,'0')}</p>
              <p className="ad-stat-unit">{s.unit}</p>
              <span className="ad-stat-ghost">{s.ghost}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <p className="ad-sec-label">เมนูจัดการ</p>
        <div className="ad-cards">
          {MENUS.map(m => (
            <Link key={m.to} to={m.to} className="ad-card">
              <div className="ad-card-stripe" style={{background:m.stripe}}/>
              <div className="ad-card-icon" style={{background:m.iconBg}}>
                <m.icon size={22} color={m.iconColor}/>
              </div>
              <div className="ad-card-text">
                <p className="ad-card-name">{m.name}</p>
                <p className="ad-card-desc">{m.desc}</p>
              </div>
              <ChevronRight size={16} className="ad-card-arrow"/>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}