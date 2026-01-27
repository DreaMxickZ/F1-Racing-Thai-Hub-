import { useState, useEffect } from 'react';
import { MapPin, Activity, Calendar } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

const Circuits = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      // ดึงข้อมูลจาก Schedule เพื่อเอาข้อมูลสนาม
      const schedule = await jolpicaApi.getSchedule(2026);
      
      // แปลงเป็นข้อมูลสนาม (unique circuits)
      const circuitsData = schedule.map(race => ({
        ...race.Circuit,
        raceName: race.raceName,
        round: race.round,
        date: race.date
      }));
      
      setCircuits(circuitsData);
    } catch (error) {
      console.error('Error fetching circuits:', error);
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
        <MapPin className="text-f1-red w-8 h-8 mr-3" />
        <div>
          <h1 className="text-4xl font-bold">สนามแข่ง F1 2026</h1>
          <p className="text-f1-lightgray mt-2">
            ทั้งหมด {circuits.length} สนาม
          </p>
        </div>
      </div>

      {/* Circuits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((circuit) => (
          <div key={circuit.circuitId} className="card overflow-hidden hover:scale-105 transition-transform">
            {/* Circuit Header */}
            <div className="bg-gradient-to-br from-f1-red to-red-900 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-white text-f1-red px-3 py-1 rounded-full text-sm font-bold">
                  Round {circuit.round}
                </span>
                <Calendar className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {circuit.circuitName}
              </h2>
              <p className="text-white/80 text-sm">{circuit.raceName}</p>
            </div>

            {/* Circuit Details */}
            <div className="p-6">
              {/* Location */}
              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-f1-red mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-f1-white">
                    {circuit.Location.locality}, {circuit.Location.country}
                  </p>
                  <p className="text-sm text-f1-lightgray">
                    {new Date(circuit.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Coordinates */}
              {circuit.Location.lat && circuit.Location.long && (
                <div className="flex items-start mb-4">
                  <Activity className="w-5 h-5 text-f1-red mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-f1-lightgray">พิกัด</p>
                    <p className="text-sm font-mono">
                      {parseFloat(circuit.Location.lat).toFixed(4)}°, {parseFloat(circuit.Location.long).toFixed(4)}°
                    </p>
                  </div>
                </div>
              )}

              {/* View on Map Button */}
              {circuit.Location.lat && circuit.Location.long && (
                <a
                  href={`https://www.google.com/maps?q=${circuit.Location.lat},${circuit.Location.long}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center inline-block mb-2"
                >
                  📍 ดูบน Google Maps
                </a>
              )}

              {/* Wikipedia Link */}
              {circuit.url && (
                <a
                  href={circuit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-f1-red hover:underline text-sm block text-center"
                >
                  ข้อมูลเพิ่มเติม →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Track Stats Summary */}
      <div className="mt-12 card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">สถิติสนามแข่ง</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-f1-red mb-2">
              {circuits.length}
            </div>
            <p className="text-f1-lightgray">จำนวนสนามทั้งหมด</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-f1-red mb-2">
              {new Set(circuits.map(c => c.Location.country)).size}
            </div>
            <p className="text-f1-lightgray">ประเทศ</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-f1-red mb-2">
              {new Set(circuits.map(c => c.Location.locality)).size}
            </div>
            <p className="text-f1-lightgray">เมือง</p>
          </div>
        </div>
      </div>

      {/* Countries List */}
      <div className="mt-8 card p-8">
        <h2 className="text-2xl font-bold mb-6">ประเทศที่จัดการแข่งขัน</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from(new Set(circuits.map(c => c.Location.country)))
            .sort()
            .map((country) => (
              <div
                key={country}
                className="bg-f1-black rounded-lg p-4 text-center hover:bg-f1-gray transition-colors"
              >
                <p className="font-semibold">{country}</p>
                <p className="text-sm text-f1-lightgray">
                  {circuits.filter(c => c.Location.country === country).length} สนาม
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Circuits;
