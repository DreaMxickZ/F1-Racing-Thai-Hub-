# คู่มือการ Deploy F1 Racing Hub

## ทางเลือกในการ Deploy (ฟรีทั้งหมด!)

1. **Vercel** (แนะนำ ⭐) - รองรับ React + Vite ได้ดี
2. **Netlify** - ใช้งานง่าย
3. **GitHub Pages** - ฟรี แต่ต้องตั้งค่าเพิ่ม
4. **Railway** - รองรับ full-stack

---

## 🚀 วิธีที่ 1: Deploy บน Vercel (แนะนำ)

### ข้อดี
- ✅ ฟรีไม่จำกัด bandwidth
- ✅ Deploy อัตโนมัติเมื่อ push to GitHub
- ✅ รองรับ environment variables
- ✅ CDN ทั่วโลก
- ✅ Custom domain ฟรี

### ขั้นตอน

#### 1. Push โค้ดขึ้น GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/f1-racing-hub.git
git push -u origin main
```

#### 2. ไปที่ Vercel

1. เข้า [vercel.com](https://vercel.com)
2. Sign up ด้วย GitHub account
3. คลิก "New Project"
4. Import repository ที่พึ่ง push
5. Vercel จะ detect Vite อัตโนมัติ

#### 3. ตั้งค่า Environment Variables

ใน Vercel Dashboard:
- ไปที่ **Settings** → **Environment Variables**
- เพิ่ม:
  ```
  VITE_SUPABASE_URL = your_supabase_url
  VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
  ```

#### 4. Deploy

- คลิก "Deploy"
- รอประมาณ 1-2 นาที
- เสร็จแล้ว! 🎉

#### 5. Custom Domain (Optional)

- ไปที่ **Settings** → **Domains**
- เพิ่ม domain ของคุณ
- ตั้งค่า DNS ตามที่ Vercel บอก

---

## 🌐 วิธีที่ 2: Deploy บน Netlify

### ข้อดี
- ✅ ฟรี 100GB bandwidth/เดือน
- ✅ Deploy ง่าย drag & drop ได้
- ✅ Form handling ฟรี
- ✅ Functions สำหรับ backend

### ขั้นตอน

#### แบบที่ 1: Deploy ผ่าน GitHub (แนะนำ)

1. Push โค้ดขึ้น GitHub (ดูวิธีด้านบน)
2. เข้า [netlify.com](https://netlify.com)
3. คลิก "Add new site" → "Import an existing project"
4. เชื่อมต่อกับ GitHub
5. เลือก repository
6. ตั้งค่า:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
7. เพิ่ม Environment Variables ใน **Site settings** → **Environment variables**
8. คลิก "Deploy"

#### แบบที่ 2: Deploy ด้วย Drag & Drop

```bash
# Build โปรเจค
npm run build

# จะได้ folder dist/
```

1. เข้า [netlify.com](https://netlify.com)
2. ลาก folder `dist/` ไป drop ในหน้า Netlify
3. เสร็จแล้ว! (แต่จะไม่มี auto-deploy)

---

## 📦 วิธีที่ 3: Deploy บน GitHub Pages

### ข้อดี
- ✅ ฟรี 100%
- ✅ ไม่มี bandwidth limit
- ✅ HTTPS ฟรี

### ข้อเสีย
- ⚠️ ต้องตั้งค่า routing เอง
- ⚠️ ไม่มี environment variables (ต้องใช้ build time)

### ขั้นตอน

#### 1. แก้ไข vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/f1-racing-hub/', // ชื่อ repository ของคุณ
  server: {
    port: 3000,
    open: true
  }
})
```

#### 2. ติดตั้ง gh-pages

```bash
npm install --save-dev gh-pages
```

#### 3. แก้ไข package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4. Build และ Deploy

```bash
npm run build
npm run deploy
```

#### 5. ตั้งค่า GitHub Pages

1. ไปที่ repository settings
2. **Pages** → Source → `gh-pages` branch
3. Save
4. เข้า `https://YOUR_USERNAME.github.io/f1-racing-hub/`

---

## 🚂 วิธีที่ 4: Deploy บน Railway

### ข้อดี
- ✅ ฟรี $5 credit/เดือน
- ✅ รองรับ backend ได้ (ถ้ามี)
- ✅ Deploy ง่าย

### ขั้นตอน

1. Push โค้ดขึ้น GitHub
2. เข้า [railway.app](https://railway.app)
3. คลิก "New Project" → "Deploy from GitHub repo"
4. เลือก repository
5. Railway จะ detect Vite อัตโนมัติ
6. เพิ่ม Environment Variables
7. Deploy!

---

## ⚙️ การตั้งค่า Environment Variables สำหรับ Production

### สำหรับ Vercel/Netlify/Railway

เพิ่มตัวแปรเหล่านี้:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
```

### สำหรับ GitHub Pages

เนื่องจาก GitHub Pages ไม่รองรับ environment variables คุณต้อง:

**ไม่แนะนำ:** ใส่ค่าตรงๆ ใน code (ไม่ปลอดภัย)

**แนะนำ:** ใช้ GitHub Secrets + GitHub Actions

#### ตัวอย่าง GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

จากนั้นเพิ่ม secrets ใน:
**Repository Settings** → **Secrets and variables** → **Actions** → **New repository secret**

---

## 🔧 Troubleshooting

### ปัญหา: 404 Not Found เมื่อ refresh หน้า

**สาเหตุ:** React Router ไม่ work บน static hosting

**แก้:**

#### สำหรับ Vercel
สร้างไฟล์ `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### สำหรับ Netlify
สร้างไฟล์ `public/_redirects`:
```
/*    /index.html   200
```

#### สำหรับ GitHub Pages
ใช้ Hash Router แทน Browser Router:
```javascript
// เปลี่ยนจาก BrowserRouter เป็น HashRouter
import { HashRouter as Router } from 'react-router-dom';
```

### ปัญหา: Environment variables ไม่ work

- ✅ ตรวจสอบว่าขึ้นต้นด้วย `VITE_`
- ✅ Restart dev server หลังเปลี่ยน .env
- ✅ ใน production ต้องตั้งใน hosting platform ไม่ใช่แค่ .env

### ปัญหา: Build error

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ปัญหา: Images ไม่โหลด

- ✅ ตรวจสอบ CORS ใน Supabase Storage
- ✅ ตรวจสอบว่า bucket เป็น public
- ✅ ตรวจสอบ URL ถูกต้อง

---

## 📊 เปรียบเทียบ Hosting Platforms

| Feature | Vercel | Netlify | GitHub Pages | Railway |
|---------|--------|---------|--------------|---------|
| ราคา | ฟรี | ฟรี | ฟรี | ฟรี $5/mo |
| Bandwidth | ไม่จำกัด | 100GB/mo | ไม่จำกัด | ตาม credit |
| Custom Domain | ✅ | ✅ | ✅ | ✅ |
| Auto Deploy | ✅ | ✅ | ต้องตั้งค่า | ✅ |
| Env Variables | ✅ | ✅ | ❌ | ✅ |
| Backend Support | Limited | Limited | ❌ | ✅ |

---

## 🎯 คำแนะนำ

### สำหรับ Development & Testing
→ ใช้ **Vercel** (deploy ง่าย preview สำหรับ PR)

### สำหรับ Production จริงๆ
→ ใช้ **Vercel** หรือ **Netlify** (มี custom domain CDN ดี)

### ถ้าต้องการควบคุมเต็มที่
→ ใช้ **Railway** หรือ VPS (DigitalOcean, Linode)

---

## 🔗 Custom Domain

### Vercel
1. ไปที่ **Settings** → **Domains**
2. เพิ่ม domain
3. ตั้งค่า DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

### Netlify
1. ไปที่ **Domain settings**
2. เพิ่ม custom domain
3. ตั้งค่า DNS ตามที่แนะนำ

---

## ✅ Checklist ก่อน Deploy

- [ ] Test บน localhost ให้ทำงานถูกต้อง
- [ ] ตั้งค่า Supabase เรียบร้อย
- [ ] Build ผ่าน (`npm run build`)
- [ ] ตรวจสอบไฟล์ .env.example
- [ ] เตรียม Environment Variables
- [ ] อัพเดท README.md
- [ ] ลบ console.log() ที่ไม่จำเป็น
- [ ] ทดสอบ responsive design
- [ ] ตรวจสอบ SEO (meta tags, title)

---

สำเร็จ! เว็บไซต์ F1 Racing Hub ของคุณพร้อม deploy แล้ว 🏎️💨
