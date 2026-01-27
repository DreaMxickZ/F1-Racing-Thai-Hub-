import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('ไม่พบข่าวที่ต้องการแก้ไข');
      navigate('/admin/news');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      alert('อัพโหลดรูปสำเร็จ');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลดรูป');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url
          })
          .eq('id', id);

        if (error) throw error;
        alert('แก้ไขข่าวสำเร็จ');
      } else {
        // Create new news
        const { error } = await supabase
          .from('news')
          .insert([{
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url
          }]);

        if (error) throw error;
        alert('เพิ่มข่าวสำเร็จ');
      }

      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข่าว');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/admin/news')}
          className="mr-4 text-f1-lightgray hover:text-f1-red"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold">
          {isEdit ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-8">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">หัวข้อข่าว *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none"
            placeholder="ใส่หัวข้อข่าว..."
            required
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">เนื้อหาข่าว *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="10"
            className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none"
            placeholder="เขียนเนื้อหาข่าว..."
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">รูปภาพ</label>
          
          {formData.image_url && (
            <div className="mb-4">
              <img 
                src={formData.image_url}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <label className="btn-secondary cursor-pointer flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>{uploading ? 'กำลังอัพโหลด...' : 'เลือกรูปภาพ'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            {formData.image_url && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image_url: '' })}
                className="text-f1-red hover:underline"
              >
                ลบรูป
              </button>
            )}
          </div>
          
          <p className="text-sm text-f1-lightgray mt-2">
            หรือใส่ URL รูปภาพ:
          </p>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-f1-black text-f1-white px-4 py-2 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none mt-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2 flex-1"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="btn-secondary flex-1"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
