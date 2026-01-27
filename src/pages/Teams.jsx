import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await jolpicaApi.getConstructors(2026);
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
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
        <Flag className="text-f1-red w-8 h-8 mr-3" />
        <h1 className="text-4xl font-bold">ทีม F1 2026</h1>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.constructorId} className="card p-6 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-4 text-f1-red">
              {team.name}
            </h2>
            
            <div className="space-y-2 text-f1-lightgray">
              <p>
                <span className="font-semibold text-f1-white">สัญชาติ:</span> {team.nationality}
              </p>
              
              {team.url && (
                <a 
                  href={team.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-f1-red hover:underline inline-block mt-4"
                >
                  ดูข้อมูลเพิ่มเติม →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
