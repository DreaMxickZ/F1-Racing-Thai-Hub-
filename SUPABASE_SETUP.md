# คู่มือตั้งค่า Supabase สำหรับ F1 Racing Hub

## ขั้นตอนที่ 1: สร้าง Supabase Project

1. ไปที่ https://supabase.com
2. Sign in หรือ Sign up
3. คลิก "New Project"
4. กรอกข้อมูล:
   - **Name**: F1 Racing Hub
   - **Database Password**: สร้างรหัสผ่านที่แข็งแรง (เก็บไว้ให้ดี)
   - **Region**: เลือก Region ที่ใกล้ที่สุด
5. คลิก "Create new project" (รอประมาณ 2 นาที)

## ขั้นตอนที่ 2: คัดลอก API Keys

1. ไปที่ **Settings** → **API**
2. คัดลอก:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public key** (VITE_SUPABASE_ANON_KEY)
3. นำไปใส่ในไฟล์ `.env`

## ขั้นตอนที่ 3: สร้าง Database Tables

### Table 1: news (ข่าวสาร)

ไปที่ **SQL Editor** และรัน:

```sql
-- สร้างตาราง news
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง index สำหรับการค้นหาเร็วขึ้น
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- เปิดให้ทุกคนอ่านได้ (แต่แก้ไขได้เฉพาะ admin)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON news
  FOR SELECT USING (true);

-- สำหรับ INSERT, UPDATE, DELETE จะใส่ policy ตอนทำ authentication
```

### Table 2: drivers (ข้อมูลนักแข่ง)

```sql
-- สร้างตาราง drivers
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id TEXT UNIQUE NOT NULL,
  number TEXT,
  team TEXT,
  image_url TEXT,
  car_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง index
CREATE INDEX idx_drivers_driver_id ON drivers(driver_id);

-- เปิดให้ทุกคนอ่านได้
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON drivers
  FOR SELECT USING (true);
```

### Table 3: teams (ข้อมูลทีม - Optional)

```sql
-- สร้างตาราง teams (ถ้าต้องการ)
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  base TEXT,
  team_chief TEXT,
  technical_chief TEXT,
  chassis TEXT,
  power_unit TEXT,
  first_entry INTEGER,
  world_championships INTEGER,
  logo_url TEXT,
  car_image_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง index
CREATE INDEX idx_teams_team_id ON teams(team_id);

-- เปิดให้ทุกคนอ่านได้
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON teams
  FOR SELECT USING (true);
```

## ขั้นตอนที่ 4: สร้าง Storage Bucket

1. ไปที่ **Storage** ในเมนูด้านซ้าย
2. คลิก "New bucket"
3. กรอกข้อมูล:
   - **Name**: `images`
   - **Public bucket**: ✅ เปิด (เพื่อให้เข้าถึงรูปได้โดยไม่ต้อง auth)
4. คลิก "Create bucket"

### ตั้งค่า Policies สำหรับ Storage

```sql
-- อนุญาตให้ทุกคนอ่าน (GET)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- อนุญาตให้ทุกคนอัพโหลด (INSERT) - สำหรับ demo
-- ในการใช้งานจริงควรมี authentication
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- อนุญาตให้ลบและแก้ไข
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );
```

## ขั้นตอนที่ 5: เพิ่ม Authentication (Optional - สำหรับระบบ Admin)

หากต้องการให้มี login สำหรับ Admin:

1. ไปที่ **Authentication** → **Policies**
2. เปิดใช้งาน Email authentication
3. สร้าง user แรกด้วยตนเอง:
   - ไปที่ **Authentication** → **Users**
   - คลิก "Add user"
   - ใส่ email และ password

### อัพเดท Policies สำหรับ Admin

```sql
-- สำหรับตาราง news
CREATE POLICY "Enable insert for authenticated users only" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- สำหรับตาราง drivers
CREATE POLICY "Enable insert for authenticated users only" ON drivers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON drivers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON drivers
  FOR DELETE USING (auth.role() = 'authenticated');
```

## ขั้นตอนที่ 6: ทดสอบการเชื่อมต่อ

1. เปิดโปรเจค React
2. ไปที่หน้า `/admin/news/create`
3. ลองเพิ่มข่าวทดสอบ
4. ตรวจสอบใน Supabase Dashboard → Table Editor → news

## โครงสร้าง Folders ใน Storage

แนะนำให้จัด folder ดังนี้:

```
images/
├── news/           # รูปข่าว
├── drivers/        # รูปนักแข่งและรถ
├── teams/          # logo และรูปทีม
└── circuits/       # รูปสนาม (optional)
```

## ข้อควรระวัง

1. **Public Bucket**: รูปใน bucket `images` จะเข้าถึงได้สาธารณะ อย่าเก็บข้อมูลสำคัญ
2. **Rate Limits**: Supabase ฟรีมีข้อจำกัดด้าน bandwidth และ storage
3. **Authentication**: ถ้าใช้งานจริง ควรใส่ระบบ login สำหรับ Admin
4. **Backup**: ควร backup database เป็นระยะ

## Free Tier Limits (Supabase)

- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 5 GB per month
- **Monthly Active Users**: 50,000

ถ้าเกินสามารถอัพเกรดเป็น Pro ($25/month)

## ปัญหาที่อาจเจอและวิธีแก้

### 1. ไม่สามารถอัพโหลดรูปได้
- ตรวจสอบว่า bucket เป็น public
- ตรวจสอบ policies ใน storage

### 2. ไม่สามารถเพิ่มข่าวได้
- ตรวจสอบ RLS policies
- ดู error ใน browser console

### 3. API ช้า
- ลองเปลี่ยน region ให้ใกล้กว่าเดิม
- ใช้ indexing ในตาราง

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

หากมีปัญหาสามารถดู logs ใน Supabase Dashboard → Logs
