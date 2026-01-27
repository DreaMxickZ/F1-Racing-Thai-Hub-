import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flag, Users, Calendar, Trophy, Newspaper, Settings, LogIn, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-f1-red border-b-2 border-f1-red' : '';
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-f1-gray shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flag className="text-f1-red w-8 h-8" />
            <span className="text-2xl font-bold text-f1-red">F1 Racing Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/')}`}
            >
              <Newspaper className="w-5 h-5" />
              <span>หน้าแรก</span>
            </Link>
            
            <Link 
              to="/drivers" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/drivers')}`}
            >
              <Users className="w-5 h-5" />
              <span>นักแข่ง</span>
            </Link>
            
            <Link 
              to="/teams" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/teams')}`}
            >
              <Flag className="w-5 h-5" />
              <span>ทีม</span>
            </Link>
            
            <Link 
              to="/circuits" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/circuits')}`}
            >
              <MapPin className="w-5 h-5" />
              <span>สนาม</span>
            </Link>
            
            <Link 
              to="/schedule" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/schedule')}`}
            >
              <Calendar className="w-5 h-5" />
              <span>ตารางแข่ง</span>
            </Link>
            
            <Link 
              to="/standings" 
              className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/standings')}`}
            >
              <Trophy className="w-5 h-5" />
              <span>คะแนน</span>
            </Link>
            
            {/* Admin Link - แสดงเฉพาะเมื่อ login แล้ว */}
            {user && (
              <Link 
                to="/admin" 
                className={`nav-link flex items-center space-x-2 pb-1 ${isActive('/admin')}`}
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Login/Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-f1-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-f1-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-f1-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
