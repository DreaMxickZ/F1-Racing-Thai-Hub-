import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Flag } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';
import { supabase } from '../config/supabase';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [driverDetails, setDriverDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      // Fetch drivers from API
      const apiDrivers = await jolpicaApi.getDrivers(2026);
      
      // Fetch additional details from Supabase
      const { data: dbDrivers } = await supabase
        .from('drivers')
        .select('*');
      
      // Create a map of driver details
      const detailsMap = {};
      if (dbDrivers) {
        dbDrivers.forEach(driver => {
          detailsMap[driver.driver_id] = driver;
        });
      }
      
      setDrivers(apiDrivers);
      setDriverDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching drivers:', error);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="text-f1-red w-8 h-8 mr-3" />
          <h1 className="text-4xl font-bold">นักแข่ง F1 2026</h1>
        </div>
        <Link to="/admin/drivers" className="btn-primary">
          จัดการข้อมูลนักแข่ง
        </Link>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const details = driverDetails[driver.driverId] || {};
          
          return (
            <div key={driver.driverId} className="card overflow-hidden group">
              {/* Driver Image with Car */}
              <div className="relative h-64 bg-gradient-to-br from-f1-black to-f1-gray overflow-hidden">
                {details.image_url ? (
                  <img 
                    src={details.image_url}
                    alt={`${driver.givenName} ${driver.familyName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-24 h-24 text-f1-lightgray" />
                  </div>
                )}
                
                {/* Driver Number Badge */}
                {details.number && (
                  <div className="absolute top-4 right-4 bg-f1-red text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {details.number}
                  </div>
                )}
              </div>

              {/* Driver Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  {driver.givenName} <span className="text-f1-red">{driver.familyName}</span>
                </h2>
                
                <div className="space-y-2 text-f1-lightgray">
                  <div className="flex items-center">
                    <Flag className="w-4 h-4 mr-2" />
                    <span>{driver.nationality}</span>
                  </div>
                  
                  {driver.dateOfBirth && (
                    <p className="text-sm">
                      เกิด: {new Date(driver.dateOfBirth).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  {details.team && (
                    <p className="text-f1-white font-semibold mt-3">
                      ทีม: {details.team}
                    </p>
                  )}
                  
                  {driver.permanentNumber && (
                    <p className="text-sm">
                      หมายเลขถาวร: {driver.permanentNumber}
                    </p>
                  )}
                </div>

                {/* Car Image */}
                {details.car_image_url && (
                  <div className="mt-4 rounded-lg overflow-hidden bg-f1-black p-2">
                    <img 
                      src={details.car_image_url}
                      alt={`${driver.familyName}'s car`}
                      className="w-full h-32 object-contain"
                    />
                  </div>
                )}

                {driver.url && (
                  <a 
                    href={driver.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-f1-red hover:underline text-sm mt-4 inline-block"
                  >
                    ดูข้อมูลเพิ่มเติม →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drivers;
