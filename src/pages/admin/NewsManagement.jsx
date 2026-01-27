import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Newspaper } from 'lucide-react';
import { supabase } from '../../config/supabase';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
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
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh list
      fetchNews();
      alert('ลบข่าวสำเร็จ');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('เกิดข้อผิดพลาดในการลบข่าว');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-f1-red">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Newspaper className="text-f1-red w-8 h-8 mr-3" />
          <h1 className="text-4xl font-bold">จัดการข่าวสาร</h1>
        </div>
        <Link to="/admin/news/create" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>เพิ่มข่าวใหม่</span>
        </Link>
      </div>

      {/* News List */}
      {news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="card p-6 flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {item.image_url && (
                  <img 
                    src={item.image_url}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-f1-lightgray text-sm line-clamp-2 mb-2">
                    {item.content}
                  </p>
                  <p className="text-xs text-f1-lightgray">
                    สร้างเมื่อ: {new Date(item.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Link
                  to={`/admin/news/edit/${item.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Newspaper className="w-16 h-16 text-f1-lightgray mx-auto mb-4" />
          <p className="text-xl text-f1-lightgray mb-4">ยังไม่มีข่าวสาร</p>
          <Link to="/admin/news/create" className="btn-primary inline-block">
            เพิ่มข่าวแรก
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;
