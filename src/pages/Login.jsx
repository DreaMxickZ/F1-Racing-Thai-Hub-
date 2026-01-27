import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Flag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-f1-black via-f1-gray to-f1-black px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flag className="text-f1-red w-12 h-12" />
            <span className="text-4xl font-bold text-f1-red">F1 Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-f1-white mb-2">Admin Login</h1>
          <p className="text-f1-lightgray">เข้าสู่ระบบจัดการ</p>
        </div>

        {/* Login Form */}
        <div className="bg-f1-gray rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2 text-f1-white">
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-lightgray focus:border-f1-red focus:outline-none transition-colors"
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 text-f1-white">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-lightgray focus:border-f1-red focus:outline-none transition-colors"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-f1-black rounded-lg">
            <p className="text-sm text-f1-lightgray text-center">
              💡 สำหรับผู้ดูแลระบบเท่านั้น
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-f1-lightgray hover:text-f1-red transition-colors"
          >
            ← กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
