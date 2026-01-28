import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flag, Users, Calendar, Trophy, Newspaper, Settings, LogIn, LogOut, MapPin, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-f1-red border-b-2 border-f1-red' : '';
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { path: '/', icon: Newspaper, label: 'หน้าแรก' },
    { path: '/news', icon: Newspaper, label: 'ข่าวสาร' },
    { path: '/drivers', icon: Users, label: 'นักแข่ง' },
    { path: '/teams', icon: Flag, label: 'ทีม' },
    { path: '/circuits', icon: MapPin, label: 'สนาม' },
    { path: '/schedule', icon: Calendar, label: 'ตารางแข่ง' },
    { path: '/standings', icon: Trophy, label: 'คะแนน' },
  ];

  return (
    <nav className="bg-f1-gray shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Flag className="text-f1-red w-8 h-8" />
            <span className="text-2xl font-bold text-f1-red">F1 Racing Thai Hub</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link flex items-center space-x-2 pb-1 ${isActive(item.path)}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            
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
          <button 
            className="md:hidden text-f1-white hover:text-f1-red transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`nav-link flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    location.pathname === item.path ? 'bg-gray-700 text-f1-red' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Admin Link - Mobile */}
              {user && (
                <Link 
                  to="/admin" 
                  className={`nav-link flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    location.pathname === '/admin' ? 'bg-gray-700 text-f1-red' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Login/Logout Button - Mobile */}
              <div className="pt-2 border-t border-gray-700">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-f1-red hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>ออกจากระบบ</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center space-x-2 bg-f1-red hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>เข้าสู่ระบบ</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;