import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flag, Users, Calendar, Trophy, Newspaper, Settings, LogIn, LogOut, MapPin, Menu, X, BookOpen, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .f1-navbar {
    font-family: 'Barlow', sans-serif;
    position: sticky; top: 0; z-index: 9999;
    background: rgba(8, 8, 10, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .f1-navbar *, .f1-navbar *::before, .f1-navbar *::after {
    box-sizing: border-box;
  }

  /* Red accent line at very top */
  .f1-navbar::before {
    content: '';
    display: block;
    height: 2px;
    background: linear-gradient(90deg, #e10600 0%, #ff4433 50%, transparent 100%);
  }

  .f1-navbar .nb-inner {
    max-width: 1400px; margin: 0 auto;
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px;
  }

  /* ── LOGO ─────────────────────────────── */
  .f1-navbar .nb-logo {
    display: flex; align-items: center; gap: 0.6rem;
    text-decoration: none; flex-shrink: 0;
  }
  .f1-navbar .nb-logo-icon {
    width: 28px; height: 28px; color: #e10600;
  }
  .f1-navbar .nb-logo-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.15rem; font-weight: 900;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: #ffffff; line-height: 1;
  }
  .f1-navbar .nb-logo-text em {
    font-style: italic; color: #e10600;
  }

  /* ── DESKTOP NAV ─────────────────────── */
  .f1-navbar .nb-links {
    display: flex; align-items: center; gap: 0.25rem;
  }
  .f1-navbar .nb-link {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    text-decoration: none; padding: 0.4rem 0.7rem;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
    white-space: nowrap;
  }
  .f1-navbar .nb-link:hover {
    color: rgba(255,255,255,0.85);
  }
  .f1-navbar .nb-link.active {
    color: #e10600;
    border-bottom-color: #e10600;
  }

  /* Auth button */
  .f1-navbar .nb-auth {
    display: flex; align-items: center; gap: 0.4rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    background: #e10600; color: #fff;
    padding: 0.45rem 1rem; border: none; cursor: pointer;
    border-radius: 2px; text-decoration: none;
    transition: background 0.2s ease;
    white-space: nowrap;
  }
  .f1-navbar .nb-auth:hover { background: #c00500; }
  .f1-navbar .nb-auth-ghost {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.45);
  }
  .f1-navbar .nb-auth-ghost:hover {
    border-color: rgba(255,255,255,0.35);
    color: rgba(255,255,255,0.75);
    background: transparent;
  }

  /* ── MOBILE TOGGLE ───────────────────── */
  .f1-navbar .nb-toggle {
    display: none;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.55); padding: 0.25rem;
    transition: color 0.2s ease;
  }
  .f1-navbar .nb-toggle:hover { color: #e10600; }

  /* ── MOBILE MENU ─────────────────────── */
  .f1-navbar .nb-mobile {
    display: none;
    flex-direction: column;
    background: #0d0d10;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 1rem 1.5rem 1.5rem;
    gap: 0.25rem;
    animation: nb-drop 0.2s ease both;
  }
  .f1-navbar .nb-mobile.open { display: flex; }

  .f1-navbar .nb-mobile-link {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.9rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    text-decoration: none; padding: 0.75rem 0.75rem;
    border-left: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    border-radius: 2px;
  }
  .f1-navbar .nb-mobile-link:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.04);
  }
  .f1-navbar .nb-mobile-link.active {
    color: #e10600;
    border-left-color: #e10600;
    background: rgba(225,6,0,0.06);
  }
  .f1-navbar .nb-mobile-divider {
    height: 1px; background: rgba(255,255,255,0.06); margin: 0.5rem 0;
  }
  .f1-navbar .nb-mobile-auth {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    background: #e10600; color: #fff;
    padding: 0.75rem; border: none; cursor: pointer;
    border-radius: 2px; text-decoration: none; width: 100%;
    transition: background 0.2s ease; margin-top: 0.25rem;
  }
  .f1-navbar .nb-mobile-auth:hover { background: #c00500; }

  @media (max-width: 1024px) {
    .f1-navbar .nb-links { display: none; }
    .f1-navbar .nb-toggle { display: flex; }
  }

  @keyframes nb-drop {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuItems = [
    { path: '/',           icon: Newspaper,  label: 'หน้าแรก' },
    { path: '/news',       icon: Newspaper,  label: 'ข่าวสาร' },
    { path: '/drivers',    icon: Users,      label: 'นักแข่ง' },
    { path: '/teams',      icon: Flag,       label: 'ทีม' },
    { path: '/circuits',   icon: MapPin,     label: 'สนาม' },
    { path: '/schedule',   icon: Calendar,   label: 'ตารางแข่ง' },
    { path: '/standings',  icon: Trophy,     label: 'คะแนน' },
    { path: '/results',    icon: Activity,   label: 'ผลการแข่งขัน' },
    { path: '/knowledge',  icon: BookOpen,   label: 'ความรู้ F1' },
  ];

  return (
    <nav className="f1-navbar">
      <style>{SCOPED_CSS}</style>

      <div className="nb-inner">
        {/* Logo */}
        <Link to="/" className="nb-logo" onClick={closeMobileMenu}>
          <Flag className="nb-logo-icon" />
          <span className="nb-logo-text">F1 <em>ThaiHub</em></span>
        </Link>

        {/* Desktop Links */}
        <div className="nb-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nb-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={13} />
              {item.label}
            </Link>
          ))}

          {user && (
            <Link to="/admin" className={`nb-link ${isActive('/admin') ? 'active' : ''}`}>
              <Settings size={13} />
              Admin
            </Link>
          )}

          {user ? (
            <button className="nb-auth nb-auth-ghost" onClick={handleLogout}>
              <LogOut size={13} />
              ออกจากระบบ
            </button>
          ) : null}
        </div>

        {/* Mobile toggle */}
        <button
          className="nb-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nb-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nb-mobile-link ${isActive(item.path) ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        ))}

        {user && (
          <Link
            to="/admin"
            className={`nb-mobile-link ${isActive('/admin') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <Settings size={15} />
            Admin
          </Link>
        )}

        {user && (
          <>
            <div className="nb-mobile-divider" />
            <button className="nb-mobile-auth" onClick={handleLogout}>
              <LogOut size={15} />
              ออกจากระบบ
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;