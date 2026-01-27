# คู่มือการตั้งค่า Authentication สำหรับ Admin

## 🔐 ระบบความปลอดภัย

เว็บไซต์นี้มีระบบ Login สำหรับป้องกันไม่ให้คนอื่นเข้าถึงหน้า Admin โดยใช้ Supabase Authentication

---

## ขั้นตอนที่ 1: เปิดใช้งาน Email Authentication

### 1.1 ไปที่ Supabase Dashboard

1. เข้า [supabase.com](https://supabase.com)
2. เลือก Project ของคุณ
3. ไปที่ **Authentication** → **Providers**

### 1.2 ตั้งค่า Email Provider

1. หา **Email** provider
2. ตรวจสอบว่า **Enable Email provider** เปิดอยู่ (เปิดอยู่แล้วโดย default)
3. ตั้งค่า:
   - ✅ **Enable Email Signups**: เปิด (สำหรับสร้าง user)
   - ✅ **Confirm Email**: ปิดได้ (สำหรับ dev/testing)
   - ✅ **Secure Email Change**: เปิด (recommended)

---

## ขั้นตอนที่ 2: สร้าง Admin User แรก

### วิธีที่ 1: ผ่าน Supabase Dashboard (แนะนำ)

1. ไปที่ **Authentication** → **Users**
2. คลิก **Add user** → **Create new user**
3. กรอกข้อมูล:
   ```
   Email: admin@yourdomain.com
   Password: รหัสผ่านที่แข็งแรง (อย่างน้อย 8 ตัวอักษร)
   ```
4. ✅ **Auto Confirm User** (เพื่อไม่ต้องยืนยันอีเมล)
5. คลิก **Create User**

### วิธีที่ 2: ผ่าน SQL (สำหรับ advanced users)

```sql
-- สร้าง user โดยตรง (ใช้ในกรณีที่ต้องการควบคุมเต็มที่)
-- ไม่แนะนำ เพราะต้องจัดการ password hash เอง
```

---

## ขั้นตอนที่ 3: ทดสอบการ Login

### 3.1 รันเว็บไซต์

```bash
npm run dev
```

### 3.2 ทดสอบ Login

1. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`
2. คลิก **"เข้าสู่ระบบ"** ที่มุมบนขวา (หรือไปที่ `/login`)
3. ใส่:
   - Email: `admin@yourdomain.com`
   - Password: รหัสผ่านที่ตั้งไว้
4. คลิก **"เข้าสู่ระบบ"**

### 3.3 ตรวจสอบ

- ✅ ถ้า login สำเร็จ → จะไปหน้า `/admin` โดยอัตโนมัติ
- ✅ เมนู Admin จะแสดงใน navbar
- ✅ มีปุ่ม "ออกจากระบบ" แทนปุ่ม "เข้าสู่ระบบ"

---

## ขั้นตอนที่ 4: อัพเดท Row Level Security (RLS)

เพื่อป้องกันไม่ให้คนที่ไม่ได้ login แก้ไขข้อมูล

### 4.1 สำหรับตาราง `news`

ไปที่ **SQL Editor** และรัน:

```sql
-- ลบ policy เก่าที่เปิดให้ทุกคนแก้ไขได้
DROP POLICY IF EXISTS "Public write news" ON news;

-- สร้าง policy ใหม่: เฉพาะคนที่ login แล้วถึงจะแก้ไขได้
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE 
  USING (auth.role() = 'authenticated');
```

### 4.2 สำหรับตาราง `drivers`

```sql
-- ลบ policy เก่า
DROP POLICY IF EXISTS "Public write drivers" ON drivers;

-- สร้าง policy ใหม่
CREATE POLICY "Authenticated users can insert drivers" ON drivers
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update drivers" ON drivers
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete drivers" ON drivers
  FOR DELETE 
  USING (auth.role() = 'authenticated');
```

### 4.3 สำหรับ Storage

```sql
-- ลบ policy เก่าที่ให้ทุกคนอัพโหลดได้
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;

-- เฉพาะคนที่ login ถึงจะอัพโหลดได้
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'images' AND 
    auth.role() = 'authenticated'
  );
```

---

## 🎯 วิธีใช้งาน Admin หลัง Deploy

### เมื่อ Deploy บน Vercel/Netlify แล้ว

1. **เข้าสู่ระบบ**
   - ไปที่ `https://your-website.com/login`
   - ใส่ Email และ Password
   - คลิก "เข้าสู่ระบบ"

2. **จัดการข้อมูล**
   - เมนู Admin จะปรากฏในหน้า navbar
   - สามารถเพิ่ม/แก้ไข/ลบ ข่าวสาร
   - อัพโหลดรูปนักแข่งและรถ

3. **ออกจากระบบ**
   - คลิก "ออกจากระบบ" ที่มุมบนขวา
   - เมนู Admin จะหายไป

---

## 🔑 การเพิ่ม Admin คนอื่น

### วิธีที่ 1: ผ่าน Supabase Dashboard (แนะนำ)

1. ไปที่ **Authentication** → **Users**
2. คลิก **Add user**
3. กรอก Email และ Password ของ admin คนใหม่
4. ✅ **Auto Confirm User**
5. Save

### วิธีที่ 2: สร้างหน้า Register (สำหรับอนาคต)

สามารถสร้างหน้า Register สำหรับให้ admin คนแรกสร้าง admin คนอื่นได้

```javascript
// ตัวอย่างโค้ด (ใน AuthContext.jsx)
const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};
```

---

## 🛡️ Best Practices สำหรับความปลอดภัย

### 1. รหัสผ่านที่แข็งแรง
```
✅ ดี: MyF1Admin2026!@#
❌ ไม่ดี: 12345678
```

### 2. เปิด Email Confirmation สำหรับ Production
```
Authentication → Providers → Email
✅ Confirm Email: เปิด
```

### 3. ใช้ Password Recovery
```
// ถ้าลืมรหัสผ่าน ใช้ Supabase Reset Password
Authentication → Users → Reset password
```

### 4. จำกัดการ Sign Up
```
Authentication → Providers → Email
❌ Enable Email Signups: ปิด (หลังจากสร้าง admin แล้ว)
```

### 5. เปิด 2FA (Two-Factor Authentication)
```
Authentication → Providers → Phone
เปิดใช้ SMS OTP (optional)
```

---

## 🔍 Troubleshooting

### ปัญหา: Login ไม่ได้

**สาเหตุ 1:** Email/Password ผิด
- ✅ ตรวจสอบใน Authentication → Users ว่ามี user นี้จริง

**สาเหตุ 2:** Email ยังไม่ยืนยัน
- ✅ ไปที่ Authentication → Users
- ✅ คลิก user → ตั้ง **Email Confirmed** เป็น true

**สาเหตุ 3:** Supabase URL/Key ผิด
- ✅ ตรวจสอบไฟล์ `.env`
- ✅ ลอง restart dev server

### ปัญหา: Login ได้แต่แก้ไขข้อมูลไม่ได้

**สาเหตุ:** RLS policies ไม่ถูกต้อง
- ✅ รัน SQL ในขั้นตอนที่ 4 อีกครั้ง
- ✅ ตรวจสอบ policies ในตาราง:
  - Table Editor → เลือกตาราง → Policies tab

### ปัญหา: อัพโหลดรูปไม่ได้หลัง login

**สาเหตุ:** Storage policies ไม่ถูกต้อง
- ✅ รัน SQL สำหรับ Storage ในขั้นตอนที่ 4.3
- ✅ ตรวจสอบ bucket policies:
  - Storage → images → Policies tab

---

## 📱 การใช้งานบนมือถือ

เว็บ responsive ใช้งานบนมือถือได้:
1. เปิดเบราว์เซอร์มือถือ
2. ไปที่ `https://your-website.com/login`
3. Login ตามปกติ
4. จัดการข้อมูลได้เหมือนบน desktop

---

## 🚀 Checklist ก่อน Deploy

- [ ] สร้าง admin user แล้ว
- [ ] ทดสอบ login ได้
- [ ] อัพเดท RLS policies แล้ว
- [ ] ทดสอบเพิ่ม/แก้ไข/ลบข้อมูลได้
- [ ] ทดสอบอัพโหลดรูปได้
- [ ] ทดสอบ logout ได้
- [ ] ตั้งค่า Environment Variables ใน hosting platform
- [ ] ปิด Email Signups (optional)

---

## 📧 ติดต่อ/ช่วยเหลือ

หากมีปัญหา:
1. ตรวจสอบ browser console (F12)
2. ตรวจสอบ Supabase Logs
3. ดูเอกสาร Supabase Auth: https://supabase.com/docs/guides/auth

---

**ระบบ Admin พร้อมใช้งานแล้ว! 🔐**
