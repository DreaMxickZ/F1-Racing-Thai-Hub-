import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { jolpicaApi } from '../services/f1Api';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLaps, setTotalLaps] = useState({});

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await jolpicaApi.getSchedule(2026);
      setSchedule(data);
      
      // ข้อมูลจำนวนรอบแข่งโดยประมาณของแต่ละสนาม (ตามมาตรฐาน)
      // ในการใช้งานจริงควรดึงจาก API หรือ database
      const lapsData = {
        'albert_park': 58,
        'bahrain': 57,
        'shanghai': 56,
        'suzuka': 53,
        'miami': 57,
        'imola': 63,
        'monaco': 78,
        'catalunya': 66,
        'villeneuve': 70,
        'red_bull_ring': 71,
        'silverstone': 52,
        'hungaroring': 70,
        'spa': 44,
        'zandvoort': 72,
        'monza': 53,
        'baku': 51,
        'marina_bay': 62,
        'americas': 56,
        'rodriguez': 71,
        'interlagos': 71,
        'vegas': 50,
        'losail': 57,
        'yas_marina': 58
      };
      setTotalLaps(lapsData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr + 'T' + (timeStr || '00:00:00'));
    return {
      date: date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: timeStr ? date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      }) : 'TBA'
    };
  };

  const isPastRace = (dateStr) => {
    return new Date(dateStr) < new Date();
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
        <Calendar className="text-f1-red w-8 h-8 mr-3" />
        <h1 className="text-4xl font-bold">ตารางแข่ง F1 2026</h1>
      </div>

      {/* Schedule List */}
      <div className="space-y-6">
        {schedule.map((race, index) => {
          const raceDate = formatDateTime(race.date, race.time);
          const isPast = isPastRace(race.date);
          
          return (
            <div 
              key={race.round} 
              className={`card p-6 ${isPast ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Race Info */}
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-f1-red text-white px-4 py-1 rounded-full text-sm font-bold mr-3">
                      Round {race.round}
                    </span>
                    {isPast && (
                      <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                        จบแล้ว
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2 text-f1-red">
                    {race.raceName}
                  </h2>
                  
                  <div className="flex items-center text-f1-lightgray mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {race.Circuit.circuitName}, {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-f1-lightgray">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="mr-4">{raceDate.date}</span>
                    {race.time && (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{raceDate.time}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Session Details */}
                <div className="mt-4 md:mt-0 md:ml-6 bg-f1-black rounded-lg p-4 min-w-[250px]">
                  <h3 className="font-bold mb-3 text-f1-red">รอบการแข่งขัน</h3>
                  
                  <div className="space-y-2 text-sm">
                    {race.FirstPractice && (
                      <div className="flex justify-between">
                        <span className="text-f1-lightgray">FP1:</span>
                        <span>
                          {formatDateTime(race.FirstPractice.date, race.FirstPractice.time).time}
                        </span>
                      </div>
                    )}
                    
                    {race.SecondPractice && (
                      <div className="flex justify-between">
                        <span className="text-f1-lightgray">FP2:</span>
                        <span>
                          {formatDateTime(race.SecondPractice.date, race.SecondPractice.time).time}
                        </span>
                      </div>
                    )}
                    
                    {race.ThirdPractice && (
                      <div className="flex justify-between">
                        <span className="text-f1-lightgray">FP3:</span>
                        <span>
                          {formatDateTime(race.ThirdPractice.date, race.ThirdPractice.time).time}
                        </span>
                      </div>
                    )}
                    
                    {race.Sprint && (
                      <div className="flex justify-between">
                        <span className="text-f1-lightgray">Sprint:</span>
                        <span>
                          {formatDateTime(race.Sprint.date, race.Sprint.time).time}
                        </span>
                      </div>
                    )}
                    
                    {race.Qualifying && (
                      <div className="flex justify-between">
                        <span className="text-f1-lightgray">Qualifying:</span>
                        <span className="font-bold text-f1-red">
                          {formatDateTime(race.Qualifying.date, race.Qualifying.time).time}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2 border-t border-f1-gray">
                      <span className="text-f1-white font-bold">Race:</span>
                      <span className="font-bold text-f1-red">
                        {raceDate.time}
                      </span>
                    </div>

                    {/* จำนวนรอบแข่ง */}
                    {totalLaps[race.Circuit.circuitId] && (
                      <div className="flex justify-between pt-2 border-t border-f1-gray mt-2">
                        <span className="text-f1-lightgray">จำนวนรอบ:</span>
                        <span className="font-bold text-f1-white">
                          {totalLaps[race.Circuit.circuitId]} รอบ
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Circuit Link */}
              {race.Circuit.url && (
                <div className="mt-4 flex items-center space-x-3">
                  <a 
                    href={race.Circuit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-f1-red hover:underline text-sm inline-flex items-center"
                  >
                    📖 ข้อมูลสนาม →
                  </a>
                  
                  {race.Circuit.Location?.lat && race.Circuit.Location?.long && (
                    <a
                      href={`https://www.google.com/maps?q=${race.Circuit.Location.lat},${race.Circuit.Location.long}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-f1-red hover:underline text-sm inline-flex items-center"
                    >
                      📍 ดูบน Maps →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
