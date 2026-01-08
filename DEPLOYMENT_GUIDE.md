# 🚀 HƯỚNG DẪN DEPLOY HỆ THỐNG QUẢN LÝ LỊCH HẸN Y TẾ

## 📋 MỤC LỤC
1. [Chuẩn bị trước khi deploy](#1-chuẩn-bị-trước-khi-deploy)
2. [Cấu hình Database](#2-cấu-hình-database)
3. [Cấu hình Environment Variables](#3-cấu-hình-environment-variables)
4. [Deploy lên Vercel](#4-deploy-lên-vercel)
5. [Deploy lên các platform khác](#5-deploy-lên-các-platform-khác)
6. [Kiểm tra sau deploy](#6-kiểm-tra-sau-deploy)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. CHUẨN BỊ TRƯỚC KHI DEPLOY

### ✅ Checklist cần thiết:

- [ ] **Node.js 18+** đã cài đặt
- [ ] **Git** đã cài đặt
- [ ] **Supabase Account** (hoặc PostgreSQL database)
- [ ] **Gemini API Key** từ Google AI Studio
- [ ] **Code đã được test kỹ** trên local

### 📦 Kiểm tra dependencies:

```bash
npm install
npm run build
```

Nếu build thành công → Sẵn sàng deploy!

---

## 2. CẤU HÌNH DATABASE

### Bước 1: Tạo Supabase Project

1. Truy cập: https://supabase.com
2. Tạo project mới
3. Chọn region gần người dùng nhất (Singapore cho VN)

### Bước 2: Chạy Database Schema

Vào **SQL Editor** trong Supabase Dashboard, chạy **lần lượt** các file:

1. **Schema cơ bản:**
   ```sql
   -- Copy toàn bộ nội dung file database/schema.sql
   ```

2. **Hệ thống đa chi nhánh:**
   ```sql
   -- Copy toàn bộ nội dung file database/multi_branch_schema.sql
   ```

3. **Thêm dữ liệu bác sĩ:**
   ```sql
   -- Copy toàn bộ nội dung file database/add_more_doctors.sql
   ```

4. **Hệ thống chat:**
   ```sql
   -- Copy toàn bộ nội dung file database/messages_schema.sql
   ```

### Bước 3: Lấy thông tin kết nối

Trong Supabase Dashboard → **Settings** → **API**:
- Copy **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
- Copy **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## 3. CẤU HÌNH ENVIRONMENT VARIABLES

### Local Development (.env.local):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Gemini AI Configuration (Optional - for AI Chatbot)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Production Environment:

**QUAN TRỌNG:** Không commit file `.env.local` lên Git!

Các platform sẽ yêu cầu bạn nhập environment variables qua UI:

---

## 4. DEPLOY LÊN VERCEL (Khuyến nghị)

### Cách 1: Deploy qua Vercel Dashboard (Dễ nhất)

1. **Truy cập:** https://vercel.com
2. **Import Git Repository:**
   - Click "New Project"
   - Connect GitHub account
   - Select repository `appointment_app`

3. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables:**
   Add 3 biến sau:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   GEMINI_API_KEY = your_gemini_key (optional)
   ```

5. **Deploy:**
   - Click "Deploy"
   - Đợi 2-3 phút
   - ✅ Hoàn thành!

### Cách 2: Deploy qua Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
# → Link to existing project? No
# → Project name? appointment-app
# → Deploy? Yes

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

---

## 5. DEPLOY LÊN CÁC PLATFORM KHÁC

### 🔷 Netlify

1. **Connect Repository:**
   - https://app.netlify.com
   - "Add new site" → "Import from Git"

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables:**
   - Settings → Environment Variables
   - Add 3 biến như Vercel

### 🔷 Railway

1. **New Project:**
   - https://railway.app
   - "New Project" → "Deploy from GitHub repo"

2. **Configure:**
   - Auto-detect Next.js
   - Add environment variables
   - Deploy

### 🔷 DigitalOcean App Platform

```bash
# Build command
npm run build

# Run command
npm start

# Port
3000
```

### 🔷 Docker (Self-hosted)

```dockerfile
# Dockerfile (tạo file mới)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build & Run:
```bash
docker build -t appointment-app .
docker run -p 3000:3000 --env-file .env.local appointment-app
```

---

## 6. KIỂM TRA SAU DEPLOY

### ✅ Checklist kiểm tra:

- [ ] **Home page loads:** https://your-domain.com
- [ ] **Login works:** Test với patient1@test.com / password1
- [ ] **Database connection:** Xem được danh sách bác sĩ
- [ ] **Booking works:** Đặt lịch thành công
- [ ] **AI Chatbot:** Click nút tím, chat thử (nếu có API key)
- [ ] **Responsive:** Test trên mobile, tablet
- [ ] **Console errors:** Mở DevTools, check không có lỗi đỏ

### 🧪 Test Accounts:

**Bệnh nhân:**
- Email: `patient1@test.com` / Password: `password1`
- Email: `patient2@test.com` / Password: `password2`

**Bác sĩ:**
- Email: `doctor1@test.com` / Password: `password1`
- Email: `doctor2@test.com` / Password: `password2`

---

## 7. TROUBLESHOOTING

### ❌ Lỗi: "Failed to fetch"

**Nguyên nhân:** Database không kết nối được

**Giải pháp:**
1. Kiểm tra Supabase URL và Key đúng chưa
2. Kiểm tra Supabase project còn hoạt động không
3. Check network từ server deploy có bị block không

### ❌ Lỗi: "Authentication failed"

**Nguyên nhân:** RLS (Row Level Security) chặn

**Giải pháp:**
1. Vào Supabase → Authentication → Settings
2. Bật: "Enable email provider"
3. Tắt: "Enable email confirmations" (cho testing)

### ❌ Lỗi: AI Chatbot không hoạt động

**Nguyên nhân:** GEMINI_API_KEY chưa cấu hình hoặc hết quota

**Giải pháp:**
1. Kiểm tra API key tại: https://makersuite.google.com/app/apikey
2. Tạo key mới nếu cần
3. Update environment variable trên platform
4. Redeploy

### ❌ Lỗi: Build failed

**Nguyên nhân:** Dependencies hoặc syntax error

**Giải pháp:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build

# Check errors
npm run lint
```

### ❌ Lỗi: "Module not found"

**Nguyên nhân:** Import path không đúng

**Giải pháp:**
- Check tất cả import paths dùng `@/` prefix
- Example: `import { supabase } from '@/utils/supabase';`

---

## 📊 PERFORMANCE OPTIMIZATION (Production)

### ✅ Đã áp dụng:

- ✅ React Strict Mode enabled
- ✅ SWC Minification enabled
- ✅ Compression enabled
- ✅ Image optimization configured
- ✅ Code splitting automatic (Next.js)

### 🔮 Tối ưu thêm (Optional):

1. **Enable CDN:**
   - Vercel tự động enable CDN
   - Các platform khác: configure Cloudflare

2. **Database Connection Pooling:**
   - Supabase tự động handle
   - Self-hosted: use PgBouncer

3. **Redis Caching:** (Nếu scale lớn)
   - Cache danh sách bác sĩ
   - Cache availability data

---

## 🔒 SECURITY CHECKLIST

- ✅ `.env.local` đã được gitignore
- ✅ API keys không bị expose ra client
- ✅ Supabase RLS đã được enable
- ✅ CORS configured properly
- ✅ SQL injection prevention (Supabase tự động)
- ✅ XSS protection (React tự động escape)

---

## 📞 SUPPORT

Nếu gặp vấn đề:

1. **Check logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Netlify: Site → Deploys → Deploy log
   
2. **Check database:**
   - Supabase Dashboard → Logs
   
3. **Community:**
   - Next.js Discord
   - Supabase Discord

---

## ✅ DEPLOYMENT COMPLETE!

Sau khi hoàn tất tất cả bước trên, hệ thống của bạn đã sẵn sàng phục vụ người dùng! 🎉

**Production URL:** https://your-app.vercel.app (hoặc domain custom)

**Next steps:**
- Thêm custom domain
- Setup monitoring (Vercel Analytics)
- Configure backup cho database
- Setup CI/CD pipeline

---

**Last updated:** December 25, 2025
