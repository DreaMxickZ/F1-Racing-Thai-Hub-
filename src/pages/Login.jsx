import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');

:root{
  --bg:#070708;--s1:#0e0e11;--s2:#141418;
  --bd:rgba(255,255,255,0.06);--bd2:rgba(255,255,255,0.1);
  --red:#e10600;--txt:#ececec;--t2:rgba(255,255,255,0.42);--t3:rgba(255,255,255,0.18);
}

.lg{font-family:'Barlow',sans-serif;color:var(--txt);background:var(--bg);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;}
.lg *,.lg *::before,.lg *::after{box-sizing:border-box;margin:0;padding:0;}

/* atmosphere */
.lg-atm{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%,rgba(225,6,0,0.08) 0%,transparent 65%),
    repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.012) 79px,rgba(255,255,255,0.012) 80px);
}

.lg-card{
  width:100%;max-width:420px;position:relative;z-index:1;
  animation:lg-up 0.5s ease both;
}

/* Logo / Brand */
.lg-brand{text-align:center;margin-bottom:2.5rem;}
.lg-logo{
  display:inline-flex;align-items:baseline;gap:0.15em;
  font-family:'Barlow Condensed',sans-serif;font-size:3rem;font-weight:900;
  text-transform:uppercase;line-height:1;color:#fff;margin-bottom:0.75rem;
}
.lg-logo em{font-style:italic;color:var(--red);}
.lg-logo-dot{width:8px;height:8px;background:var(--red);border-radius:50%;margin-bottom:0.4rem;flex-shrink:0;align-self:flex-end;}
.lg-brand-sub{font-family:'Barlow Condensed',sans-serif;font-size:0.68rem;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:var(--t3);}

/* Card body */
.lg-box{background:var(--s1);border:1px solid var(--bd);overflow:hidden;}

.lg-box-head{
  padding:1.5rem 2rem 1.25rem;
  border-bottom:1px solid var(--bd);
  position:relative;overflow:hidden;
}
.lg-box-head::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--red);
}
.lg-box-title{font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:0.2rem;}
.lg-box-sub{font-size:0.8rem;color:var(--t2);}

.lg-form{padding:1.75rem 2rem 2rem;display:flex;flex-direction:column;gap:1.25rem;}

/* Fields */
.lg-field{}
.lg-label{display:block;font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:var(--t3);margin-bottom:0.45rem;}
.lg-input{
  width:100%;background:rgba(0,0,0,0.3);color:var(--txt);
  border:1px solid var(--bd2);
  padding:0.75rem 1rem;font-family:'Barlow',sans-serif;font-size:0.95rem;
  outline:none;transition:border-color 0.2s,background 0.2s;
}
.lg-input:focus{border-color:var(--red);background:rgba(0,0,0,0.45);}
.lg-input::placeholder{color:var(--t3);}

/* Error */
.lg-error{
  display:flex;align-items:center;gap:0.5rem;
  background:rgba(225,6,0,0.08);border:1px solid rgba(225,6,0,0.25);
  padding:0.7rem 1rem;font-size:0.83rem;color:rgba(255,120,120,0.9);
  animation:lg-up 0.2s ease both;
}
.lg-error::before{content:'';width:3px;height:100%;background:var(--red);flex-shrink:0;}

/* Submit */
.lg-submit{
  display:flex;align-items:center;justify-content:center;gap:0.5rem;
  width:100%;font-family:'Barlow Condensed',sans-serif;font-size:0.88rem;font-weight:800;
  letter-spacing:0.15em;text-transform:uppercase;
  background:var(--red);color:#fff;border:none;
  padding:0.85rem;cursor:pointer;
  box-shadow:0 0 24px rgba(225,6,0,0.25);
  transition:background 0.2s,box-shadow 0.2s;
}
.lg-submit:hover:not(:disabled){background:#c00500;box-shadow:0 0 32px rgba(225,6,0,0.35);}
.lg-submit:disabled{background:#2a2a2a;box-shadow:none;cursor:not-allowed;color:var(--t2);}

/* Info note */
.lg-note{
  margin:0 2rem 1.75rem;
  padding:0.75rem 1rem;
  background:rgba(255,255,255,0.03);border:1px solid var(--bd);
  font-size:0.78rem;color:var(--t3);text-align:center;
  font-family:'Barlow Condensed',sans-serif;font-weight:700;
  letter-spacing:0.08em;text-transform:uppercase;
}

/* Back link */
.lg-back{
  display:flex;align-items:center;justify-content:center;gap:0.4rem;
  margin-top:1.5rem;font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;
  font-weight:700;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--t3);background:none;border:none;cursor:pointer;
  transition:color 0.2s;
}
.lg-back:hover{color:var(--red);}

@keyframes lg-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
`;

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      else navigate('/admin');
    } catch {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg">
      <style>{S}</style>
      <div className="lg-atm"/>

      <div className="lg-card">
        {/* Brand */}
        <div className="lg-brand">
          <div className="lg-logo">
            F1&nbsp;<em>Thai</em>&nbsp;Hub
          </div>
          <p className="lg-brand-sub">Admin Portal</p>
        </div>

        {/* Box */}
        <div className="lg-box">
          <div className="lg-box-head">
            <p className="lg-box-title">เข้าสู่ระบบ</p>
            <p className="lg-box-sub">สำหรับผู้ดูแลระบบเท่านั้น</p>
          </div>

          <div className="lg-form" onSubmit={handleSubmit}>
            <div className="lg-field">
              <label className="lg-label">อีเมล</label>
              <input type="email" className="lg-input" placeholder="admin@example.com"
                value={email} onChange={e=>setEmail(e.target.value)}
                required autoComplete="email"/>
            </div>

            <div className="lg-field">
              <label className="lg-label">รหัสผ่าน</label>
              <input type="password" className="lg-input" placeholder="••••••••"
                value={password} onChange={e=>setPassword(e.target.value)}
                required autoComplete="current-password"/>
            </div>

            {error && <div className="lg-error">{error}</div>}

            <button type="button" className="lg-submit" disabled={loading}
              onClick={handleSubmit}>
              <LogIn size={15}/>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>

          <div className="lg-note">💡 สำหรับผู้ดูแลระบบเท่านั้น</div>
        </div>

        <button className="lg-back" onClick={() => navigate('/')}>
          <ArrowLeft size={12}/> กลับสู่หน้าแรก
        </button>
      </div>
    </div>
  );
};

export default Login;