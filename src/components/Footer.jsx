import { Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-f1-gray mt-12 py-8 border-t border-f1-lightgray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Flag className="text-f1-red w-6 h-6" />
              <span className="text-xl font-bold text-f1-red">F1 Racing Hub</span>
            </div>
            <p className="text-f1-lightgray text-sm">
              ศูนย์รวมข้อมูล Formula 1 ฤดูกาล 2026 และต่อๆ ไป
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-f1-white mb-4">หน้าหลัก</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  นักแข่ง
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  ทีม
                </Link>
              </li>
              <li>
                <Link to="/circuits" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  สนาม
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="font-bold text-f1-white mb-4">ข้อมูล</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/schedule" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  ตารางแข่ง
                </Link>
              </li>
              <li>
                <Link to="/standings" className="text-f1-lightgray hover:text-f1-red transition-colors">
                  คะแนน
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-bold text-f1-white mb-4">แหล่งข้อมูล</h3>
            <ul className="space-y-2 text-sm text-f1-lightgray">
              <li>📊 OpenF1 API</li>
              <li>📊 Jolpica F1 API</li>
              <li>💾 Supabase</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-f1-lightgray">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-f1-lightgray">
            <p>© 2026 F1 Racing Hub. All rights reserved.</p>
            <p>Made with ❤️ by Claude AI</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
