# โครงสร้างโปรเจค F1 Racing Hub

## 📁 โครงสร้างไฟล์

```
f1-website/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & Scripts
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS + F1 colors
│   ├── postcss.config.js           # PostCSS config
│   ├── .env.example                # Environment variables template
│   └── .gitignore                  # Git ignore rules
│
├── 📖 Documentation
│   ├── README.md                   # โครงสร้างและคำแนะนำหลัก
│   ├── QUICKSTART.md              # เริ่มต้นใช้งานด่วน (5-10 นาที)
│   ├── SUPABASE_SETUP.md          # ตั้งค่า Database
│   ├── AUTH_SETUP.md              # ตั้งค่า Authentication & Admin Login
│   └── DEPLOYMENT.md               # Deploy บน Vercel/Netlify/etc
│
├── 📂 src/
│   │
│   ├── 🎨 Styles
│   │   └── index.css              # Global styles + Tailwind
│   │
│   ├── ⚙️ Configuration
│   │   └── config/
│   │       └── supabase.js        # Supabase client config
│   │
│   ├── 🔌 Services (APIs)
│   │   └── services/
│   │       └── f1Api.js           # OpenF1 + Jolpica API calls
│   │
│   ├── 🧩 Components
│   │   └── components/
│   │       ├── Navbar.jsx         # Navigation bar
│   │       └── Footer.jsx         # Footer
│   │
│   ├── 📄 Pages (Public)
│   │   └── pages/
│   │       ├── Home.jsx           # หน้าแรก (ข่าว + คะแนน)
│   │       ├── Drivers.jsx        # รายชื่อนักแข่ง + รูป
│   │       ├── Teams.jsx          # รายชื่อทีม
│   │       ├── Circuits.jsx       # ข้อมูลสนามแข่ง + พิกัด
│   │       ├── Schedule.jsx       # ตารางแข่ง + รอบต่างๆ + จำนวนรอบ
│   │       └── Standings.jsx      # ตารางคะแนน
│   │
│   ├── 🔐 Admin Pages
│   │   └── pages/admin/
│   │       ├── AdminDashboard.jsx     # Dashboard หลัก
│   │       ├── NewsManagement.jsx     # รายการข่าว
│   │       ├── NewsForm.jsx           # ฟอร์มเพิ่ม/แก้ไขข่าว
│   │       └── DriverManagement.jsx   # จัดการนักแข่ง + รูปภาพ
│   │
│   ├── 🚀 Main Files
│   │   ├── App.jsx                # Main App + Router
│   │   └── main.jsx               # Entry point
│   │
│   └── index.html                 # HTML template
│
└── 🌐 Public Files (รูปภาพ, static files)
```

---

## 📦 Dependencies

### Production
- **react** (18.3.1) - UI framework
- **react-dom** (18.3.1) - React rendering
- **react-router-dom** (6.22.0) - Routing
- **@supabase/supabase-js** (2.39.0) - Database & Storage
- **lucide-react** (0.263.1) - Icons

### Development
- **vite** (5.1.0) - Build tool
- **@vitejs/plugin-react** (4.2.1) - React plugin for Vite
- **tailwindcss** (3.4.1) - CSS framework
- **autoprefixer** (10.4.17) - CSS vendor prefixes
- **postcss** (8.4.35) - CSS processing

---

## 🎯 ฟีเจอร์ในแต่ละหน้า

### 🏠 Home (`/`)
- แสดงข่าวสาร 3 รายการล่าสุด
- ตารางคะแนนนักแข่ง Top 5
- ตารางคะแนนทีม Top 5
- การแข่งขันถัดไป (Next Race)

### 👤 Drivers (`/drivers`)
- รายชื่อนักแข่งทั้งหมด (จาก Jolpica API)
- รูปนักแข่งยืนข้างรถ (จาก Supabase)
- รูปรถแต่ละคัน
- หมายเลขนักแข่ง
- ข้อมูลทีม

### 🏁 Teams (`/teams`)
- รายชื่อทีมทั้งหมด
- สัญชาติของทีม
- Link ไป Wikipedia

### 🏟️ Circuits (`/circuits`)
- ข้อมูลสนามแข่งทั้งหมด
- สถานที่ตั้ง (เมือง, ประเทศ)
- พิกัด GPS (Latitude, Longitude)
- ลิงก์ Google Maps
- สถิติสนาม (จำนวนสนามต่อประเทศ/เมือง)
- รายชื่อประเทศที่จัดการแข่ง

### 📅 Schedule (`/schedule`)
- ตารางแข่งทั้งฤดูกาล 2026
- แยกรอบ FP1, FP2, FP3, Qualifying, Sprint, Race
- วันเวลาแต่ละรอบ
- **จำนวนรอบแข่งของแต่ละสนาม** (ใหม่!)
- ข้อมูลสนาม
- ลิงก์ข้อมูลสนามและ Google Maps
- แสดงสถานะแข่งแล้ว/ยังไม่แข่ง

### 🏆 Standings (`/standings`)
- Tab สลับระหว่าง Drivers / Teams
- อันดับ + คะแนน + จำนวนชนะ
- Highlight อันดับ 1-3 (Podium)
- ข้อมูลทีมของนักแข่ง

### 🔐 Admin (`/admin/*`)
- **Dashboard** - เมนูหลัก
- **News Management** - CRUD ข่าวสาร
- **News Form** - เพิ่ม/แก้ไขข่าว + อัพโหลดรูป
- **Driver Management** - อัพโหลดรูปนักแข่ง + รูปรถ

---

## 🎨 Theme Colors (F1 Official)

```javascript
f1: {
  red: '#E10600',        // สีแดง F1
  black: '#15151E',      // พื้นหลังหลัก
  gray: '#38383F',       // Card background
  lightgray: '#949498',  // Text secondary
  white: '#FFFFFF',      // Text primary
}
```

---

## 🔌 APIs ที่ใช้

### 1. OpenF1 API (https://api.openf1.org/v1)
**ฟรี - ไม่ต้อง API key**
- Sessions (รอบการแข่ง)
- Drivers data
- Position tracking
- Lap times
- Live timing data

### 2. Jolpica F1 API (https://api.jolpi.ca/ergast/f1)
**ฟรี - ไม่ต้อง API key** (แทน Ergast ที่ปิดไปแล้ว)
- Schedule (ตารางแข่ง)
- Drivers list
- Constructors (ทีม)
- Driver Standings
- Constructor Standings
- Race Results

### 3. Supabase
**ฐานข้อมูลและ Storage**
- News table (ข่าวสาร)
- Drivers table (ข้อมูลเพิ่มเติมนักแข่ง)
- Storage bucket (รูปภาพ)

---

## 🗄️ Database Schema

### Table: news
```sql
- id: UUID (primary key)
- title: TEXT
- content: TEXT
- image_url: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Table: drivers
```sql
- id: UUID (primary key)
- driver_id: TEXT (unique)
- number: TEXT
- team: TEXT
- image_url: TEXT (รูปนักแข่ง)
- car_image_url: TEXT (รูปรถ)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## 🚀 Available Scripts

```bash
npm run dev       # รัน development server (port 3000)
npm run build     # Build สำหรับ production (→ dist/)
npm run preview   # Preview production build
```

---

## 📝 Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **สำคัญ:** ตัวแปรต้องขึ้นต้นด้วย `VITE_` เพื่อให้ Vite เข้าถึงได้

---

## 🔐 Security & Best Practices

### สำหรับ Demo/Development
- ใช้ RLS policy: `FOR ALL USING (true)` → ทุกคนแก้ไขได้

### สำหรับ Production
- เพิ่ม Authentication (Supabase Auth)
- อัพเดท RLS policies:
  ```sql
  CREATE POLICY "Admin only" ON news
  FOR ALL USING (auth.role() = 'authenticated');
  ```
- Rate limiting
- Input validation
- CORS configuration

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - `md:` - 768px+ (Tablet)
  - `lg:` - 1024px+ (Desktop)
  - `xl:` - 1280px+ (Large desktop)

---

## 🎯 Roadmap (ฟีเจอร์ในอนาคต)

- [ ] Authentication สำหรับ Admin
- [ ] Live Timing จาก OpenF1
- [ ] Comparison tools (lap times)
- [ ] Notifications (การแข่งใกล้เข้ามา)
- [ ] Dark/Light mode toggle
- [ ] ระบบค้นหา
- [ ] SEO optimization
- [ ] Progressive Web App (PWA)
- [ ] Multilanguage (EN/TH)

---

## 📄 License

MIT License - ใช้ได้อย่างอิสระ

---

**สร้างด้วย ❤️ โดย Claude AI**
