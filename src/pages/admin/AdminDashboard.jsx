import { Link } from 'react-router-dom';
import { Newspaper, Users, Image, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const adminMenus = [
    {
      title: 'จัดการข่าวสาร',
      description: 'เพิ่ม แก้ไข ลบข่าวสาร F1',
      icon: Newspaper,
      link: '/admin/news',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'จัดการนักแข่ง',
      description: 'อัพโหลดรูปนักแข่ง รูปรถ และข้อมูล',
      icon: Users,
      link: '/admin/drivers',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'จัดการรูปภาพ',
      description: 'อัพโหลดและจัดการรูปภาพทั้งหมด',
      icon: Image,
      link: '/admin/media',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Settings className="text-f1-red w-8 h-8 mr-3" />
        <h1 className="text-4xl font-bold">ระบบจัดการ Admin</h1>
      </div>

      {/* Welcome Card */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">ยินดีต้อนรับสู่ระบบจัดการ</h2>
        <p className="text-f1-lightgray">
          คุณสามารถจัดการข้อมูล เพิ่มข่าวสาร และอัพโหลดรูปภาพต่างๆ ได้ที่นี่
        </p>
      </div>

      {/* Admin Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenus.map((menu) => (
          <Link
            key={menu.link}
            to={menu.link}
            className={`${menu.color} rounded-lg p-6 text-white transition-all duration-300 transform hover:scale-105 shadow-lg`}
          >
            <menu.icon className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">{menu.title}</h3>
            <p className="text-sm opacity-90">{menu.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-f1-lightgray mb-2">ข่าวสารทั้งหมด</h3>
          <p className="text-3xl font-bold text-f1-red">-</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-f1-lightgray mb-2">นักแข่ง</h3>
          <p className="text-3xl font-bold text-f1-red">20</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-f1-lightgray mb-2">ทีม</h3>
          <p className="text-3xl font-bold text-f1-red">10</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
