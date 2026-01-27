# 🏁 Quick Start Guide - F1 Racing Hub

เริ่มต้นใช้งานภายใน 10 นาที!

## 📋 สิ่งที่ต้องเตรียม

- Node.js 18+ ([ดาวน์โหลด](https://nodejs.org))
- Git ([ดาวน์โหลด](https://git-scm.com))
- บัญชี Supabase ([สมัคร](https://supabase.com))
- Code Editor (แนะนำ VS Code)

---

## ⚡ เริ่มใช้งานด่วน (5 นาที)

### 1. Clone และติดตั้ง

```bash
# Clone project
git clone <repository-url>
cd f1-website

# ติดตั้ง dependencies
npm install
```

### 2. ตั้งค่า Environment Variables

```bash
# คัดลอก .env.example
cp .env.example .env

# แก้ไขไฟล์ .env
# ใส่ Supabase URL และ Key
```

**ยังไม่มี Supabase?** → [ข้ามไปขั้นตอนที่ 3](#3-รันโปรเจค-dev-mode)

### 3. รันโปรเจค (Dev mode)

```bash
npm run dev
```

เปิดเบราว์เซอร์: `http://localhost:3000` 🎉

---

## 🗄️ ตั้งค่า Database (10 นาที)

### ถ้ายังไม่มี Supabase

1. **สร้าง Project**
   - ไปที่ [supabase.com](https://supabase.com)
   - Sign up + Create new project
   - รอ 2 นาที

2. **คัดลอก API Keys**
   ```
   Settings → API → Copy:
   - Project URL
   - anon public key
   ```
   ใส่ในไฟล์ `.env`

3. **สร้าง Tables**
   
   ไปที่ **SQL Editor** รัน:
   ```sql
   -- Table: news
   CREATE TABLE news (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table: drivers
   CREATE TABLE drivers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     driver_id TEXT UNIQUE NOT NULL,
     number TEXT,
     team TEXT,
     image_url TEXT,
     car_image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable read access
   ALTER TABLE news ENABLE ROW LEVEL SECURITY;
   ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Public read" ON news FOR SELECT USING (true);
   CREATE POLICY "Public read" ON drivers FOR SELECT USING (true);

   -- Enable write access (for demo - remove in production!)
   CREATE POLICY "Public write news" ON news FOR ALL USING (true);
   CREATE POLICY "Public write drivers" ON drivers FOR ALL USING (true);
   ```

4. **สร้าง Storage Bucket**
   ```
   Storage → New bucket
   Name: images
   ✅ Public bucket
   ```

**เสร็จแล้ว!** รีสตาร์ท dev server และลองเพิ่มข่าวได้เลย

---

## 🎨 Features พร้อมใช้

### หน้าสาธารณะ
- ✅ หน้าแรก → ข่าว + คะแนน + การแข่งถัดไป
- ✅ นักแข่ง → รายชื่อนักแข่งทั้งหมด
- ✅ ทีม → รายชื่อทีมทั้งหมด
- ✅ ตารางแข่ง → Schedule พร้อมรอบต่างๆ
- ✅ คะแนน → Driver & Constructor Standings

### หน้า Admin
- ✅ จัดการข่าว → เพิ่ม/แก้ไข/ลบ
- ✅ จัดการนักแข่ง → อัพโหลดรูป + ข้อมูล

---

## 📱 ทดสอบใช้งาน

### 1. เพิ่มข่าวแรก
```
1. ไป /admin/news/create
2. กรอกหัวข้อ: "ข่าวทดสอบ"
3. เนื้อหา: "นี่คือข่าวแรก!"
4. (Optional) ใส่ URL รูป
5. บันทึก
6. กลับไปหน้าแรก → จะเห็นข่าวแล้ว!
```

### 2. แก้ไขข้อมูลนักแข่ง
```
1. ไป /admin/drivers
2. เลือกนักแข่งจากรายการซ้าย
3. กรอก:
   - หมายเลข
   - ทีม
   - อัพโหลดรูป
4. บันทึก
5. ไป /drivers → จะเห็นรูปแล้ว!
```

### 3. ดูคะแนน
```
1. ไป /standings
2. เปลี่ยนระหว่าง Drivers ↔ Teams
3. ข้อมูลมาจาก Jolpica F1 API
```

---

## 🔧 คำสั่งที่ใช้บ่อย

```bash
# รัน dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# ติดตั้ง package ใหม่
npm install package-name

# อัพเดท dependencies
npm update
```

---

## 🚀 พร้อม Deploy?

### Deploy ใน 2 นาที (Vercel)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready to deploy"
git push

# 2. ไปที่ vercel.com
# 3. Import repository
# 4. เพิ่ม Environment Variables
# 5. Deploy!
```

[คู่มือ Deploy ฉบับเต็ม →](./DEPLOYMENT.md)

---

## 📚 เอกสารเพิ่มเติม

- [README.md](./README.md) - รายละเอียดโปรเจคเต็ม
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - ตั้งค่า Database
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy ขั้นสูง

---

## ❓ ปัญหาที่พบบ่อย

### ไม่สามารถรัน dev server
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

### ไม่เห็นข้อมูลจาก API
```bash
# เช็ค browser console
# กด F12 → Console
# ดู error message
```

### อัพโหลดรูปไม่ได้
```
1. ตรวจสอบ Supabase Storage bucket เป็น public
2. ตรวจสอบ API keys ใน .env ถูกต้อง
3. รีสตาร์ท dev server
```

### Build error
```bash
# ลอง build ดู error
npm run build

# แก้ error ตามที่บอก
# ส่วนใหญ่เป็นเรื่อง:
# - Missing dependencies
# - Syntax errors
# - Import paths ผิด
```

---

## 🎯 Next Steps

หลังจากเว็บทำงานแล้ว คุณสามารถ:

1. **ปรับแต่ง Design**
   - แก้สีใน `tailwind.config.js`
   - แก้ layout ใน components

2. **เพิ่ม Features**
   - ระบบ Authentication
   - Comment system
   - Search function
   - Real-time updates

3. **Optimize Performance**
   - Image optimization
   - Lazy loading
   - Caching strategies

4. **SEO**
   - Meta tags
   - Open Graph
   - Sitemap

---

## 💬 ต้องการความช่วยเหลือ?

1. เช็ค [README.md](./README.md) ก่อน
2. ดู error ใน console (F12)
3. ค้นหาปัญหาใน GitHub Issues
4. ถาม ChatGPT หรือ Claude! 😉

---

**ขอให้สนุกกับการพัฒนา!** 🏎️💨

Made with ❤️ by Claude
