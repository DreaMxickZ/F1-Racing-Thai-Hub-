import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Flag } from 'lucide-react';
import { supabase } from '../../config/supabase';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .nf-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
    background: #0a0a0c;
    min-height: 100vh;
  }
  .nf-page *, .nf-page *::before, .nf-page *::after { box-sizing: border-box; }

  .nf-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .nf-glow {
    position: fixed; top: -10%; left: 50%; transform: translateX(-50%);
    width: 800px; height: 400px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse, rgba(225,6,0,0.06) 0%, transparent 70%);
  }
  .nf-inner {
    max-width: 760px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* Header */
  .nf-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem;
    display: flex; align-items: center; gap: 1.2rem;
  }
  .nf-back {
    display: flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
    color: rgba(255,255,255,0.4); transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .nf-back:hover { background: rgba(225,6,0,0.15); border-color: rgba(225,6,0,0.4); color: #e10600; }
  .nf-hd-text {}
  .nf-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;
  }
  .nf-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: #e10600; margin: 0; line-height: 1;
  }
  .nf-eyebrow-line {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .nf-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900;
    text-transform: uppercase; letter-spacing: -0.01em;
    color: #fff; margin: 0; line-height: 0.95;
  }
  .nf-title em { font-style: italic; color: #e10600; }

  /* Form panel */
  .nf-panel {
    background: #111114; border: 1px solid rgba(255,255,255,0.06);
    animation: nf-rise 0.4s ease both;
  }

  /* Sections */
  .nf-section {
    padding: 2rem 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nf-section:last-child { border-bottom: none; }

  .nf-label {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
    margin-bottom: 0.75rem;
  }
  .nf-label-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #e10600;
    flex-shrink: 0;
  }
  .nf-label-req { color: #e10600; }

  .nf-input, .nf-textarea {
    width: 100%; background: rgba(0,0,0,0.4);
    color: #f0f0f0; border: 1px solid rgba(255,255,255,0.08);
    padding: 0.9rem 1.1rem;
    font-family: 'Barlow', sans-serif; font-size: 0.95rem;
    outline: none; transition: border-color 0.2s ease, background 0.2s ease;
    resize: none;
  }
  .nf-input::placeholder, .nf-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .nf-input:focus, .nf-textarea:focus {
    border-color: rgba(225,6,0,0.5); background: rgba(225,6,0,0.04);
  }
  .nf-textarea { min-height: 260px; line-height: 1.65; }

  /* Image preview */
  .nf-img-preview {
    width: 100%; height: 220px; overflow: hidden;
    margin-bottom: 1rem; position: relative;
    background: rgba(0,0,0,0.3);
  }
  .nf-img-preview img { width: 100%; height: 100%; object-fit: cover; }
  .nf-img-preview-label {
    position: absolute; bottom: 0.75rem; left: 0.75rem;
    background: rgba(0,0,0,0.7); padding: 0.3rem 0.65rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.5);
  }

  .nf-upload-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .nf-btn-upload {
    display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.55); padding: 0.65rem 1.2rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    transition: all 0.2s ease;
  }
  .nf-btn-upload:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }
  .nf-btn-upload input { display: none; }
  .nf-btn-rm {
    background: none; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; padding: 0; transition: opacity 0.2s ease;
  }
  .nf-btn-rm:hover { opacity: 0.7; }

  .nf-url-hint {
    font-size: 0.72rem; color: rgba(255,255,255,0.25);
    letter-spacing: 0.05em; margin: 0 0 0.5rem;
    text-transform: uppercase; font-weight: 600;
  }

  /* Actions */
  .nf-actions {
    display: flex; gap: 0.5rem; padding: 1.75rem 2.5rem;
    background: rgba(0,0,0,0.2);
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .nf-btn-save {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: #e10600; color: #fff; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.9rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 1rem 2rem;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .nf-btn-save:hover:not(:disabled) { background: #ff1a0e; transform: translateY(-2px); }
  .nf-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .nf-btn-cancel {
    flex: 0 0 140px; display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4); cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 1rem; transition: all 0.2s ease;
  }
  .nf-btn-cancel:hover { background: rgba(255,255,255,0.1); color: #fff; }

  @keyframes nf-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({ title: '', content: '', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (isEdit) fetchNews(); }, [id]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `news/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
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
    if (!formData.title || !formData.content) { alert('กรุณากรอกข้อมูลให้ครบถ้วน'); return; }
    try {
      setLoading(true);
      if (isEdit) {
        const { error } = await supabase.from('news')
          .update({ title: formData.title, content: formData.content, image_url: formData.image_url })
          .eq('id', id);
        if (error) throw error;
        alert('แก้ไขข่าวสำเร็จ');
      } else {
        const { error } = await supabase.from('news')
          .insert([{ title: formData.title, content: formData.content, image_url: formData.image_url }]);
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
    <div className="nf-page">
      <style>{SCOPED_CSS}</style>
      <div className="nf-grid-bg" />
      <div className="nf-glow" />
      <div className="nf-inner">

        <header className="nf-hd">
          <button className="nf-back" onClick={() => navigate('/admin/news')}>
            <ArrowLeft size={18} />
          </button>
          <div className="nf-hd-text">
            <div className="nf-eyebrow">
              <Flag size={11} color="#e10600" />
              <p className="nf-eyebrow-txt">Admin Panel</p>
              <div className="nf-eyebrow-line" />
            </div>
            <h1 className="nf-title">
              {isEdit ? <>แก้ไข<em>ข่าว</em></> : <>เพิ่ม<em>ข่าวใหม่</em></>}
            </h1>
          </div>
        </header>

        <div className="nf-panel">

          {/* Title */}
          <div className="nf-section">
            <label className="nf-label">
              <span className="nf-label-dot" />
              หัวข้อข่าว <span className="nf-label-req">*</span>
            </label>
            <input
              type="text"
              className="nf-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ใส่หัวข้อข่าว..."
            />
          </div>

          {/* Content */}
          <div className="nf-section">
            <label className="nf-label">
              <span className="nf-label-dot" />
              เนื้อหาข่าว <span className="nf-label-req">*</span>
            </label>
            <textarea
              className="nf-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="เขียนเนื้อหาข่าว..."
            />
          </div>

          {/* Image */}
          <div className="nf-section">
            <label className="nf-label">
              <span className="nf-label-dot" />
              รูปภาพ
            </label>

            {formData.image_url && (
              <div className="nf-img-preview">
                <img src={formData.image_url} alt="Preview" />
                <span className="nf-img-preview-label">Preview</span>
              </div>
            )}

            <div className="nf-upload-row">
              <label className="nf-btn-upload">
                <ImageIcon size={15} />
                {uploading ? 'กำลังอัพโหลด...' : 'เลือกรูปภาพ'}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
              {formData.image_url && (
                <button type="button" className="nf-btn-rm" onClick={() => setFormData({ ...formData, image_url: '' })}>
                  ลบรูป
                </button>
              )}
            </div>

            <p className="nf-url-hint">หรือใส่ URL รูปภาพ</p>
            <input
              type="url"
              className="nf-input"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Actions */}
          <div className="nf-actions">
            <button className="nf-btn-save" onClick={handleSubmit} disabled={loading}>
              <Save size={16} />
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button className="nf-btn-cancel" onClick={() => navigate('/admin/news')}>
              ยกเลิก
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsForm;