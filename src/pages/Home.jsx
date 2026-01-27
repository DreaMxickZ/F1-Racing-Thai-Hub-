import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Newspaper } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';
import { supabase } from '../config/supabase';

const Home = () => {
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [nextRace, setNextRace] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch driver standings (top 5)
      const drivers = await jolpicaApi.getDriverStandings(2026);
      setDriverStandings(drivers.slice(0, 5));

      // Fetch constructor standings (top 5)
      const constructors = await jolpicaApi.getConstructorStandings(2026);
      setConstructorStandings(constructors.slice(0, 5));

      // Fetch schedule and find next race
      const schedule = await jolpicaApi.getSchedule(2026);
      const now = new Date();
      const upcoming = schedule.find(race => new Date(race.date) > now);
      setNextRace(upcoming);

      // Fetch news from Supabase
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      setNews(newsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-f1-red to-red-900 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Formula 1 2026</h1>
        <p className="text-xl text-gray-200">
          ติดตามข้อมูล ข่าวสาร และผลการแข่งขัน F1 ทุกสนาม
        </p>
      </div>

      {/* Next Race Section */}
      {nextRace && (
        <div className="card p-6 mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="text-f1-red w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">การแข่งขันต่อไป</h2>
          </div>
          <div className="bg-f1-black rounded-lg p-4">
            <h3 className="text-xl font-bold text-f1-red mb-2">{nextRace.raceName}</h3>
            <p className="text-f1-lightgray">สนาม: {nextRace.Circuit.circuitName}</p>
            <p className="text-f1-lightgray">สถานที่: {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}</p>
            <p className="text-f1-white font-bold mt-2">
              วันที่: {new Date(nextRace.date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Link to="/schedule" className="btn-primary mt-4 inline-block">
            ดูตารางแข่งทั้งหมด
          </Link>
        </div>
      )}

      {/* News Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Newspaper className="text-f1-red w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">ข่าวสาร F1</h2>
          </div>
          <Link to="/news" className="text-f1-red hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link 
                key={item.id} 
                to={`/news/${item.id}`}
                className="card overflow-hidden hover:scale-105 transition-transform"
              >
                {item.image_url && (
                  <div className="w-full h-56 overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-f1-lightgray text-sm mb-4">
                    {new Date(item.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-f1-lightgray line-clamp-3">{item.content}</p>
                  <div className="mt-4">
                    <span className="text-f1-red hover:underline inline-flex items-center">
                      อ่านต่อ →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-f1-lightgray">ยังไม่มีข่าวสาร</p>
            <Link to="/admin/news/create" className="btn-primary mt-4 inline-block">
              เพิ่มข่าวสาร
            </Link>
          </div>
        )}
      </div>

      {/* Standings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Driver Standings */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Trophy className="text-f1-red w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">คะแนนนักแข่ง</h2>
          </div>
          
          <div className="space-y-3">
            {driverStandings.map((standing, index) => (
              <div 
                key={standing.Driver.driverId}
                className="bg-f1-black rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-f1-red w-8">
                    {standing.position}
                  </span>
                  <div>
                    <p className="font-bold">
                      {standing.Driver.givenName} {standing.Driver.familyName}
                    </p>
                    <p className="text-sm text-f1-lightgray">
                      {standing.Constructors[0].name}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold">{standing.points}</span>
              </div>
            ))}
          </div>
          
          <Link to="/standings" className="btn-secondary mt-4 inline-block w-full text-center">
            ดูคะแนนทั้งหมด
          </Link>
        </div>

        {/* Constructor Standings */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Trophy className="text-f1-red w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">คะแนนทีม</h2>
          </div>
          
          <div className="space-y-3">
            {constructorStandings.map((standing) => (
              <div 
                key={standing.Constructor.constructorId}
                className="bg-f1-black rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-f1-red w-8">
                    {standing.position}
                  </span>
                  <p className="font-bold">{standing.Constructor.name}</p>
                </div>
                <span className="text-xl font-bold">{standing.points}</span>
              </div>
            ))}
          </div>
          
          <Link to="/standings" className="btn-secondary mt-4 inline-block w-full text-center">
            ดูคะแนนทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
