import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { supabase } from '../config/supabase';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setNews(data);
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

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">ไม่พบข่าว</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-f1-black">
      {/* Header Image */}
      {news.image_url && (
        <div className="w-full h-96 md:h-[500px] relative overflow-hidden">
          <img 
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-f1-black via-f1-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-f1-lightgray hover:text-f1-red transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>กลับสู่หน้าแรก</span>
        </button>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-f1-white leading-tight">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center space-x-6 mb-8 text-f1-lightgray">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(news.created_at).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="text-sm">F1 Racing Hub</span>
            </div>
          </div>

          {/* Featured Image (if not shown in header) */}
          {!news.image_url && news.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={news.image_url}
                alt={news.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-f1-white text-lg leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-f1-gray">
            <h3 className="text-xl font-bold mb-4">แชร์ข่าวนี้</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('คัดลอกลิงก์แล้ว!');
                }}
                className="btn-secondary"
              >
                📋 คัดลอกลิงก์
              </button>
            </div>
          </div>

          {/* Related News */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">ข่าวอื่นๆ</h3>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              ดูข่าวทั้งหมด
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
