import { useState, useEffect } from 'react';
import { Trophy, Users, Flag } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

const Standings = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const [drivers, constructors] = await Promise.all([
        jolpicaApi.getDriverStandings(2026),
        jolpicaApi.getConstructorStandings(2026)
      ]);
      
      setDriverStandings(drivers);
      setConstructorStandings(constructors);
    } catch (error) {
      console.error('Error fetching standings:', error);
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
        <Trophy className="text-f1-red w-8 h-8 mr-3" />
        <h1 className="text-4xl font-bold">ตารางคะแนน F1 2026</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'drivers'
              ? 'bg-f1-red text-white'
              : 'bg-f1-gray text-f1-lightgray hover:bg-f1-gray/80'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>นักแข่ง</span>
        </button>
        
        <button
          onClick={() => setActiveTab('constructors')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'constructors'
              ? 'bg-f1-red text-white'
              : 'bg-f1-gray text-f1-lightgray hover:bg-f1-gray/80'
          }`}
        >
          <Flag className="w-5 h-5" />
          <span>ทีม</span>
        </button>
      </div>

      {/* Driver Standings */}
      {activeTab === 'drivers' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-f1-red">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">อันดับ</th>
                  <th className="px-6 py-4 text-left font-bold">นักแข่ง</th>
                  <th className="px-6 py-4 text-left font-bold">ทีม</th>
                  <th className="px-6 py-4 text-center font-bold">คะแนน</th>
                  <th className="px-6 py-4 text-center font-bold">ชนะ</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((standing, index) => (
                  <tr 
                    key={standing.Driver.driverId}
                    className={`border-b border-f1-gray hover:bg-f1-gray/50 transition-colors ${
                      index < 3 ? 'bg-f1-gray/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className={`text-2xl font-bold ${
                          standing.position === '1' ? 'text-yellow-400' :
                          standing.position === '2' ? 'text-gray-300' :
                          standing.position === '3' ? 'text-orange-400' :
                          'text-f1-lightgray'
                        }`}>
                          {standing.position}
                        </span>
                        {index < 3 && (
                          <Trophy className={`w-5 h-5 ${
                            standing.position === '1' ? 'text-yellow-400' :
                            standing.position === '2' ? 'text-gray-300' :
                            'text-orange-400'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-lg">
                          {standing.Driver.givenName} <span className="text-f1-red">{standing.Driver.familyName}</span>
                        </p>
                        <p className="text-sm text-f1-lightgray">{standing.Driver.nationality}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{standing.Constructors[0].name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-f1-red">{standing.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold">{standing.wins}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Constructor Standings */}
      {activeTab === 'constructors' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-f1-red">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">อันดับ</th>
                  <th className="px-6 py-4 text-left font-bold">ทีม</th>
                  <th className="px-6 py-4 text-left font-bold">สัญชาติ</th>
                  <th className="px-6 py-4 text-center font-bold">คะแนน</th>
                  <th className="px-6 py-4 text-center font-bold">ชนะ</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((standing, index) => (
                  <tr 
                    key={standing.Constructor.constructorId}
                    className={`border-b border-f1-gray hover:bg-f1-gray/50 transition-colors ${
                      index < 3 ? 'bg-f1-gray/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className={`text-2xl font-bold ${
                          standing.position === '1' ? 'text-yellow-400' :
                          standing.position === '2' ? 'text-gray-300' :
                          standing.position === '3' ? 'text-orange-400' :
                          'text-f1-lightgray'
                        }`}>
                          {standing.position}
                        </span>
                        {index < 3 && (
                          <Trophy className={`w-5 h-5 ${
                            standing.position === '1' ? 'text-yellow-400' :
                            standing.position === '2' ? 'text-gray-300' :
                            'text-orange-400'
                          }`} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-lg text-f1-red">
                        {standing.Constructor.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-f1-lightgray">{standing.Constructor.nationality}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-f1-red">{standing.points}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold">{standing.wins}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Standings;
