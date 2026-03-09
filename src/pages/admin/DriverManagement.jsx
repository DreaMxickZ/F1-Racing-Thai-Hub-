import { useState, useEffect } from 'react';
import { Users, Upload, Save, Flag } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { jolpicaApi } from '../../services/f1Api';

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600&display=swap');

  .dm-page {
    font-family: 'Barlow', sans-serif;
    color: #f0f0f0;
    background: #0a0a0c;
    min-height: 100vh;
  }
  .dm-page *, .dm-page *::before, .dm-page *::after { box-sizing: border-box; }

  .dm-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .dm-glow {
    position: fixed; top: -10%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 400px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse, rgba(225,6,0,0.06) 0%, transparent 70%);
  }
  .dm-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 5rem;
    position: relative; z-index: 1;
  }

  /* Header */
  .dm-hd {
    padding: 3.5rem 0 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 3rem; position: relative;
  }
  .dm-eyebrow {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;
  }
  .dm-eyebrow-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: #e10600; margin: 0; line-height: 1;
  }
  .dm-eyebrow-line {
    flex: 1; max-width: 100px; height: 1px;
    background: linear-gradient(90deg, #e10600, transparent);
  }
  .dm-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900;
    line-height: 0.9; text-transform: uppercase; letter-spacing: -0.02em;
    color: #fff; margin: 0; padding: 0;
  }
  .dm-title em { font-style: italic; color: #e10600; }
  .dm-ghost-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 3.5rem; font-weight: 900; color: rgba(255,255,255,0.04);
    position: absolute; right: 0; bottom: 0.5rem;
    letter-spacing: -0.05em; line-height: 1;
    user-select: none; pointer-events: none;
  }

  /* Layout */
  .dm-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .dm-layout { grid-template-columns: 1fr; }
  }

  /* Driver list panel */
  .dm-list-panel {
    background: #111114; border: 1px solid rgba(255,255,255,0.06);
    position: sticky; top: 1rem;
    animation: dm-rise 0.35s ease both;
  }
  .dm-list-header {
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .dm-list-header-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.3); margin: 0;
  }
  .dm-list-scroll {
    max-height: 620px; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(225,6,0,0.3) transparent;
  }
  .dm-list-scroll::-webkit-scrollbar { width: 3px; }
  .dm-list-scroll::-webkit-scrollbar-thumb { background: rgba(225,6,0,0.3); }

  .dm-driver-btn {
    width: 100%; text-align: left; background: none; border: none;
    cursor: pointer; padding: 0.9rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s ease;
    position: relative;
  }
  .dm-driver-btn::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 2px; background: #e10600;
    transform: scaleY(0); transition: transform 0.2s ease;
  }
  .dm-driver-btn:hover { background: rgba(255,255,255,0.04); }
  .dm-driver-btn:hover::before { transform: scaleY(1); }
  .dm-driver-btn.active { background: rgba(225,6,0,0.1); }
  .dm-driver-btn.active::before { transform: scaleY(1); }

  .dm-driver-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.03em; color: #fff; margin: 0 0 0.2rem; line-height: 1;
  }
  .dm-driver-btn.active .dm-driver-name { color: #e10600; }
  .dm-driver-meta {
    font-size: 0.72rem; color: rgba(255,255,255,0.3);
    font-weight: 500; letter-spacing: 0.05em;
  }

  /* Form panel */
  .dm-form-panel {
    background: #111114; border: 1px solid rgba(255,255,255,0.06);
    animation: dm-rise 0.4s ease both;
  }

  .dm-form-hd {
    padding: 1.75rem 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .dm-form-hd-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: #e10600; margin: 0 0 0.3rem;
  }
  .dm-form-hd-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2rem; font-weight: 900; text-transform: uppercase;
    letter-spacing: 0.02em; color: #fff; margin: 0; line-height: 1;
  }

  .dm-section {
    padding: 1.75rem 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .dm-section:last-child { border-bottom: none; }

  /* Two-col grid for number + team */
  .dm-row-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  }

  .dm-label {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    margin-bottom: 0.65rem;
  }
  .dm-label-dot { width: 5px; height: 5px; border-radius: 50%; background: #e10600; flex-shrink: 0; }

  .dm-input {
    width: 100%; background: rgba(0,0,0,0.4);
    color: #f0f0f0; border: 1px solid rgba(255,255,255,0.08);
    padding: 0.85rem 1rem;
    font-family: 'Barlow', sans-serif; font-size: 0.95rem;
    outline: none; transition: border-color 0.2s ease, background 0.2s ease;
  }
  .dm-input::placeholder { color: rgba(255,255,255,0.18); }
  .dm-input:focus { border-color: rgba(225,6,0,0.5); background: rgba(225,6,0,0.04); }

  /* Image upload area */
  .dm-img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 700px) { .dm-img-grid { grid-template-columns: 1fr; } }

  .dm-img-block {}
  .dm-img-preview {
    width: 100%; height: 160px; overflow: hidden;
    margin-bottom: 0.75rem; background: rgba(0,0,0,0.3);
    position: relative;
  }
  .dm-img-preview img { width: 100%; height: 100%; object-fit: cover; }
  .dm-img-preview.contain img { object-fit: contain; }
  .dm-img-preview-label {
    position: absolute; bottom: 0.5rem; left: 0.5rem;
    background: rgba(0,0,0,0.75); padding: 0.2rem 0.5rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
  }

  .dm-upload-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
  .dm-btn-upload {
    display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5); padding: 0.55rem 1rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    transition: all 0.2s ease;
  }
  .dm-btn-upload:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .dm-btn-upload input { display: none; }
  .dm-btn-rm {
    background: none; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #e10600; padding: 0; transition: opacity 0.2s ease;
  }
  .dm-btn-rm:hover { opacity: 0.65; }
  .dm-url-hint {
    font-size: 0.68rem; color: rgba(255,255,255,0.2);
    text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;
    margin: 0 0 0.4rem;
  }

  /* Save action */
  .dm-actions {
    padding: 1.75rem 2.5rem;
    background: rgba(0,0,0,0.2);
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .dm-btn-save {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    background: #e10600; color: #fff; border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.95rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 1rem 2rem;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .dm-btn-save:hover { background: #ff1a0e; transform: translateY(-2px); }

  /* Empty state */
  .dm-empty {
    background: #111114; border: 1px solid rgba(255,255,255,0.06);
    padding: 5rem 2rem; text-align: center;
    animation: dm-rise 0.4s ease both;
  }
  .dm-empty-icon { color: rgba(255,255,255,0.08); margin: 0 auto 1.5rem; display: block; }
  .dm-empty-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.2rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.2); margin: 0;
  }

  /* Loading */
  .dm-loading {
    min-height: 55vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem; background: #0a0a0c;
  }
  .dm-bar-track { width: 200px; height: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
  .dm-bar-fill { height: 100%; background: #e10600; animation: dm-slide 1.2s ease-in-out infinite; }
  .dm-load-txt {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(255,255,255,0.28); margin: 0;
  }

  @keyframes dm-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
  @keyframes dm-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

const ImageBlock = ({ label, fieldKey, formData, setFormData, uploading, handleImageUpload, contain = false }) => (
  <div className="dm-img-block">
    <label className="dm-label"><span className="dm-label-dot" />{label}</label>

    {formData[fieldKey] && (
      <div className={`dm-img-preview${contain ? ' contain' : ''}`}>
        <img src={formData[fieldKey]} alt={label} />
        <span className="dm-img-preview-label">Preview</span>
      </div>
    )}

    <div className="dm-upload-row">
      <label className="dm-btn-upload">
        <Upload size={13} />
        {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, fieldKey)} disabled={uploading} />
      </label>
      {formData[fieldKey] && (
        <button type="button" className="dm-btn-rm" onClick={() => setFormData({ ...formData, [fieldKey]: '' })}>
          ลบรูป
        </button>
      )}
    </div>

    <p className="dm-url-hint">หรือใส่ URL</p>
    <input
      type="url"
      className="dm-input"
      value={formData[fieldKey]}
      onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
      placeholder="https://example.com/image.jpg"
    />
  </div>
);

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({ driver_id: '', number: '', team: '', image_url: '', car_image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDrivers(); }, []);

  const fetchDrivers = async () => {
    try {
      const apiDrivers = await jolpicaApi.getDrivers(2026);
      setDrivers(apiDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectDriver = async (driver) => {
    setSelectedDriver(driver);
    const { data } = await supabase.from('drivers').select('*').eq('driver_id', driver.driverId).single();
    if (data) {
      setFormData(data);
    } else {
      setFormData({ driver_id: driver.driverId, number: driver.permanentNumber || '', team: '', image_url: '', car_image_url: '' });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `drivers/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData({ ...formData, [type]: data.publicUrl });
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
    try {
      const { data: existing } = await supabase.from('drivers').select('*').eq('driver_id', formData.driver_id).single();
      if (existing) {
        const { error } = await supabase.from('drivers')
          .update({ number: formData.number, team: formData.team, image_url: formData.image_url, car_image_url: formData.car_image_url })
          .eq('driver_id', formData.driver_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('drivers').insert([formData]);
        if (error) throw error;
      }
      alert('บันทึกข้อมูลนักแข่งสำเร็จ');
    } catch (error) {
      console.error('Error saving driver:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  if (loading) {
    return (
      <div className="dm-page">
        <style>{SCOPED_CSS}</style>
        <div className="dm-loading">
          <div className="dm-bar-track"><div className="dm-bar-fill" /></div>
          <p className="dm-load-txt">Loading Drivers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-page">
      <style>{SCOPED_CSS}</style>
      <div className="dm-grid-bg" />
      <div className="dm-glow" />
      <div className="dm-inner">

        <header className="dm-hd">
          <div className="dm-eyebrow">
            <Flag size={12} color="#e10600" />
            <p className="dm-eyebrow-txt">Admin Panel</p>
            <div className="dm-eyebrow-line" />
          </div>
          <h1 className="dm-title">จัดการ<em>นักแข่ง</em></h1>
          <div className="dm-ghost-num">{drivers.length}</div>
        </header>

        <div className="dm-layout">

          {/* Driver list */}
          <div className="dm-list-panel">
            <div className="dm-list-header">
              <p className="dm-list-header-txt">เลือกนักแข่ง — {drivers.length} คน</p>
            </div>
            <div className="dm-list-scroll">
              {drivers.map((driver) => (
                <button
                  key={driver.driverId}
                  onClick={() => selectDriver(driver)}
                  className={`dm-driver-btn${selectedDriver?.driverId === driver.driverId ? ' active' : ''}`}
                >
                  <p className="dm-driver-name">{driver.givenName} {driver.familyName}</p>
                  <span className="dm-driver-meta">#{driver.permanentNumber} · {driver.nationality}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          {selectedDriver ? (
            <div className="dm-form-panel">
              <div className="dm-form-hd">
                <p className="dm-form-hd-label">แก้ไขข้อมูล</p>
                <h2 className="dm-form-hd-name">{selectedDriver.givenName} {selectedDriver.familyName}</h2>
              </div>

              {/* Number + Team */}
              <div className="dm-section">
                <div className="dm-row-2">
                  <div>
                    <label className="dm-label"><span className="dm-label-dot" />หมายเลขนักแข่ง</label>
                    <input
                      type="text"
                      className="dm-input"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      placeholder="เช่น 1, 44, 33"
                    />
                  </div>
                  <div>
                    <label className="dm-label"><span className="dm-label-dot" />ทีม</label>
                    <input
                      type="text"
                      className="dm-input"
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      placeholder="เช่น Red Bull Racing"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="dm-section">
                <div className="dm-img-grid">
                  <ImageBlock
                    label="รูปนักแข่ง"
                    fieldKey="image_url"
                    formData={formData}
                    setFormData={setFormData}
                    uploading={uploading}
                    handleImageUpload={handleImageUpload}
                  />
                  <ImageBlock
                    label="รูปรถ"
                    fieldKey="car_image_url"
                    formData={formData}
                    setFormData={setFormData}
                    uploading={uploading}
                    handleImageUpload={handleImageUpload}
                    contain
                  />
                </div>
              </div>

              {/* Save */}
              <div className="dm-actions">
                <button className="dm-btn-save" onClick={handleSubmit}>
                  <Save size={16} />
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          ) : (
            <div className="dm-empty">
              <Users size={52} className="dm-empty-icon" />
              <p className="dm-empty-txt">เลือกนักแข่งจากรายการเพื่อแก้ไขข้อมูล</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DriverManagement;