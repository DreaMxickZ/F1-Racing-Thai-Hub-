// OpenF1 API
const OPENF1_BASE_URL = 'https://api.openf1.org/v1';

// Jolpica F1 API (แทน Ergast)
const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// ฟังก์ชันสำหรับ OpenF1 API
export const openF1Api = {
  // ข้อมูล Sessions
  async getSessions(year = 2026) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/sessions?year=${year}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  },

  // ข้อมูลนักแข่ง
  async getDrivers(session_key) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=${session_key}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  },

  // ข้อมูลตำแหน่งรถ
  async getPosition(session_key) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/position?session_key=${session_key}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  },

  // ข้อมูล Lap times
  async getLaps(session_key, driver_number) {
    try {
      const url = driver_number 
        ? `${OPENF1_BASE_URL}/laps?session_key=${session_key}&driver_number=${driver_number}`
        : `${OPENF1_BASE_URL}/laps?session_key=${session_key}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching laps:', error);
      return [];
    }
  }
};

// ฟังก์ชันสำหรับ Jolpica F1 API
export const jolpicaApi = {
  // ตารางแข่ง
  async getSchedule(year = 2026) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  },

  // ข้อมูลนักแข่ง
  async getDrivers(year = 2026) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}/drivers.json`);
      const data = await response.json();
      return data.MRData.DriverTable.Drivers;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  },

  // ข้อมูลทีม
  async getConstructors(year = 2026) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}/constructors.json`);
      const data = await response.json();
      return data.MRData.ConstructorTable.Constructors;
    } catch (error) {
      console.error('Error fetching constructors:', error);
      return [];
    }
  },

  // ตารางคะแนนนักแข่ง
  async getDriverStandings(year = 2026) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}/driverStandings.json`);
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      return [];
    }
  },

  // ตารางคะแนนทีม
  async getConstructorStandings(year = 2026) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}/constructorStandings.json`);
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      return [];
    }
  },

  // ผลการแข่งของแต่ละสนาม
  async getRaceResults(year = 2026, round) {
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${year}/${round}/results.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races[0];
    } catch (error) {
      console.error('Error fetching race results:', error);
      return null;
    }
  }
};
