import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar } from 'lucide-react';
import { supabase } from '../config/supabase';

const News = () => {
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
      <div className="flex items-center mb-8">
        <Newspaper className="text-f1-red w-8 h-8 mr-3" />
        <div>
          <h1 className="text-4xl font-bold">ข่าวสาร F1</h1>
          <p className="text-f1-lightgray mt-2">
            อัพเดทข่าว Formula 1 ล่าสุด
          </p>
        </div>
      </div>

      {/* News List */}
      {news.length > 0 ? (
        <div className="space-y-8">
          {news.map((item, index) => {
            // Featured news (first one) - แสดงใหญ่
            if (index === 0) {
              return (
                <Link 
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="block card overflow-hidden hover:scale-[1.02] transition-transform"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image */}
                    {item.image_url && (
                      <div className="h-64 md:h-96 overflow-hidden">
                        <img 
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="bg-f1-red text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block w-fit">
                        ข่าวเด่น
                      </div>
                      <h2 className="text-3xl font-bold mb-4 line-clamp-2">
                        {item.title}
                      </h2>
                      <div className="flex items-center text-f1-lightgray text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <p className="text-f1-lightgray line-clamp-4 mb-4">
                        {item.content}
                      </p>
                      <span className="text-f1-red font-bold inline-flex items-center">
                        อ่านต่อ →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            // Regular news - grid
            return (
              <Link 
                key={item.id}
                to={`/news/${item.id}`}
                className="block card overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Image */}
                  {item.image_url && (
                    <div className="h-56 overflow-hidden">
                      <img 
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {/* Content */}
                  <div className={`p-6 ${item.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-f1-lightgray text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <p className="text-f1-lightgray line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    <span className="text-f1-red hover:underline inline-flex items-center">
                      อ่านต่อ →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Newspaper className="w-16 h-16 text-f1-lightgray mx-auto mb-4" />
          <p className="text-xl text-f1-lightgray mb-4">ยังไม่มีข่าวสาร</p>
          <Link to="/" className="btn-primary inline-block">
            กลับสู่หน้าแรก
          </Link>
        </div>
      )}
    </div>
  );
};

export default News;
