import { useState, useEffect } from 'react';
import { Users, Upload, Save } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { jolpicaApi } from '../../services/f1Api';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    driver_id: '',
    number: '',
    team: '',
    image_url: '',
    car_image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

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
    
    // Fetch existing data from Supabase
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('driver_id', driver.driverId)
      .single();
    
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        driver_id: driver.driverId,
        number: driver.permanentNumber || '',
        team: '',
        image_url: '',
        car_image_url: ''
      });
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

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

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
      // Check if driver exists
      const { data: existing } = await supabase
        .from('drivers')
        .select('*')
        .eq('driver_id', formData.driver_id)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from('drivers')
          .update({
            number: formData.number,
            team: formData.team,
            image_url: formData.image_url,
            car_image_url: formData.car_image_url
          })
          .eq('driver_id', formData.driver_id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('drivers')
          .insert([formData]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-f1-red">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Users className="text-f1-red w-8 h-8 mr-3" />
        <h1 className="text-4xl font-bold">จัดการข้อมูลนักแข่ง</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Driver List */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h2 className="text-xl font-bold mb-4">เลือกนักแข่ง</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {drivers.map((driver) => (
                <button
                  key={driver.driverId}
                  onClick={() => selectDriver(driver)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDriver?.driverId === driver.driverId
                      ? 'bg-f1-red text-white'
                      : 'bg-f1-black hover:bg-f1-gray'
                  }`}
                >
                  <p className="font-bold">
                    {driver.givenName} {driver.familyName}
                  </p>
                  <p className="text-sm opacity-75">
                    #{driver.permanentNumber} • {driver.nationality}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Driver Form */}
        <div className="lg:col-span-2">
          {selectedDriver ? (
            <form onSubmit={handleSubmit} className="card p-6">
              <h2 className="text-2xl font-bold mb-6">
                แก้ไขข้อมูล: {selectedDriver.givenName} {selectedDriver.familyName}
              </h2>

              {/* Number */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">หมายเลขนักแข่ง</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none"
                  placeholder="เช่น 1, 44, 33"
                />
              </div>

              {/* Team */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">ทีม</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full bg-f1-black text-f1-white px-4 py-3 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none"
                  placeholder="เช่น Red Bull Racing, Ferrari"
                />
              </div>

              {/* Driver Image */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">รูปนักแข่ง (ยืนข้างรถ)</label>
                
                {formData.image_url && (
                  <div className="mb-4">
                    <img 
                      src={formData.image_url}
                      alt="Driver"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>{uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดรูป'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image_url')}
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
                  หรือใส่ URL:
                </p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-f1-black text-f1-white px-4 py-2 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none mt-2"
                  placeholder="https://example.com/driver.jpg"
                />
              </div>

              {/* Car Image */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">รูปรถ</label>
                
                {formData.car_image_url && (
                  <div className="mb-4 bg-f1-black p-4 rounded-lg">
                    <img 
                      src={formData.car_image_url}
                      alt="Car"
                      className="w-full h-48 object-contain"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>{uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดรูปรถ'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'car_image_url')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  
                  {formData.car_image_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, car_image_url: '' })}
                      className="text-f1-red hover:underline"
                    >
                      ลบรูป
                    </button>
                  )}
                </div>
                
                <p className="text-sm text-f1-lightgray mt-2">
                  หรือใส่ URL:
                </p>
                <input
                  type="url"
                  value={formData.car_image_url}
                  onChange={(e) => setFormData({ ...formData, car_image_url: e.target.value })}
                  className="w-full bg-f1-black text-f1-white px-4 py-2 rounded-lg border border-f1-gray focus:border-f1-red focus:outline-none mt-2"
                  placeholder="https://example.com/car.jpg"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>บันทึกข้อมูล</span>
              </button>
            </form>
          ) : (
            <div className="card p-12 text-center">
              <Users className="w-16 h-16 text-f1-lightgray mx-auto mb-4" />
              <p className="text-xl text-f1-lightgray">
                เลือกนักแข่งจากรายการด้านซ้ายเพื่อแก้ไขข้อมูล
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
