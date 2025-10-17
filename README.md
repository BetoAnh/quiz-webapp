# 🧭 HƯỚNG DẪN CHẠY CHƯƠNG TRÌNH

## 🧩 1. Giới thiệu

Dự án bao gồm:
- **Frontend:** React + Vite + Tailwind CSS  
- **Backend:** OctoberCMS (Laravel base)

Mục tiêu: Xây dựng hệ thống web quản lý quiz / câu hỏi, với giao diện hiện đại và backend ổn định.

---

## ⚙️ 2. Yêu cầu môi trường

### 🔹 Frontend
- **Node.js:** >= 18.0  
- **npm:** >= 9.0  
- **Trình duyệt:** Chrome, Edge hoặc Firefox mới nhất

### 🔹 Backend
- **PHP:** >= 8.0.2  
- **Composer:** >= 2.5  
- **Database:** SQLite hoặc MySQL  
- **Web server:** Apache / Nginx / hoặc chạy trực tiếp qua `php artisan serve`

---

## 🚀 3. Cài đặt và khởi chạy

### 🖥️ Frontend (React + Vite)
```bash
# Di chuyển đến thư mục frontend
cd fe

# Cài đặt các gói phụ thuộc
npm install

# Chạy ở chế độ phát triển
npm run dev
```

Mặc định chạy tại: 👉 **http://localhost:5173**

> ⚙️ Nếu cần chỉnh URL backend API, sửa trong:
> ```
> fe/src/services/quizService.js
> ```
> Ví dụ:
> ```js
> axios.defaults.baseURL = "http://localhost:8000/api";
> ```

---

### 🗄️ Backend (OctoberCMS)
```bash
# Di chuyển đến thư mục backend
cd be

# Cài đặt các gói PHP
composer install

# Tạo file môi trường (có thể bỏ qua nếu đã có)
cp .env.example .env

# Chỉnh thông tin database trong .env
# (VD: DB_CONNECTION=mysql, DB_DATABASE=project, DB_USERNAME=root, DB_PASSWORD=)

# Tạo key ứng dụng
php artisan key:generate

# Chạy server
php artisan serve
```

Mặc định chạy tại: 👉 **http://127.0.0.1:8000**

> 🔧 Nếu sử dụng XAMPP hoặc Laragon, đặt thư mục `be` vào `htdocs` hoặc `www`, sau đó truy cập qua:
> ```
> http://localhost/be/public
> ```

---

## 🔐 4. Tài khoản đăng nhập mặc định

| Loại tài khoản | Email/Username | Mật khẩu | Đăng nhập tại |
|----------------|--------|-----------|----------------|
| **Quản trị viên (Backend)** | betoan | Vietanh2003 | [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) |
| **Người dùng (Frontend)** | vtahvp@gmail.com  | Vietanh2003 | Giao diện React tại [http://localhost:5173](http://localhost:5173) |

> ⚙️ **Lưu ý:**  
> - Tài khoản **quản trị viên** được lưu trong bảng **`backend_users`**.  
> - Tài khoản **người dùng thường** được lưu trong bảng **`users`** (plugin RainLab.User).  
> - Có thể thay đổi hoặc tạo mới trong giao diện quản trị OctoberCMS.

---

## 🧱 5. Cấu trúc thư mục

### 📂 Frontend (`/fe`)
```
fe/
│
├── src/
│   ├── components/       # Thành phần UI tái sử dụng
│   ├── pages/            # Các trang chính của ứng dụng
│   ├── services/         # Gọi API bằng Axios
│   ├── store/            # Quản lý state (Redux/Zustand)
│   ├── utils/            # Hàm tiện ích
│   ├── App.jsx           # Cấu trúc route chính
│   └── main.jsx          # File khởi chạy ứng dụng
│
├── public/               # Ảnh, icon, favicon, ...
└── vite.config.js        # Cấu hình Vite (port, alias @,...)
```

### ⚙️ Backend (`/be`)
```
be/
│
├── modules/              # Module lõi của OctoberCMS
├── plugins/              # Plugin mở rộng (RainLab.User, Builder, CORS,...)
├── themes/               # Giao diện trang web
├── storage/              # Cache, log, file tạm
├── config/               # Cấu hình hệ thống
├── artisan               # CLI của Laravel / October
└── .env                  # Biến môi trường
```

---

## 🌐 6. Cấu hình CORS cho kết nối FE ↔ BE

Để FE (http://localhost:5173) gọi được API BE (http://localhost:8000), cần cấu hình CORS.

### ✅ Bước 1. Sửa file middleware

Mở file:
```
plugins/tober/cors/http/middleware/CorsMiddleware.php
```

Tìm đoạn:
```php
$headers = [
    'Access-Control-Allow-Origin'  => $origin,
    'Access-Control-Allow-Headers' => config('tober.cors::headers', $defaultHeaders),
    'Access-Control-Allow-Methods' => config('tober.cors::methods', $defaultMethods)
];
```

Thay thành:
```php
$headers = [
    'Access-Control-Allow-Origin'  => $origin,
    'Access-Control-Allow-Headers' => config('tober.cors::headers', $defaultHeaders),
    'Access-Control-Allow-Methods' => config('tober.cors::methods', $defaultMethods),
    'Access-Control-Allow-Credentials' => 'true', // ✅ thêm dòng này
];
```

---

### ✅ Bước 2. Kiểm tra kết nối

- Frontend gọi API qua Axios, ví dụ:
  ```
  http://localhost:8000/api/quiz
  ```
- Nếu gặp lỗi **CORS**, bật plugin `tober/cors-plugin` hoặc thêm cấu hình trong `.env`:
  ```env
  CORS_ENABLED=true
  CORS_ORIGIN=http://localhost:5173
  ```

---

## 🏗️ 7. Build và triển khai

### 🔹 Build Frontend
```bash
cd fe
npm run build
```
Kết quả nằm tại:  
```
fe/dist/
```

👉 Có thể:
- Copy nội dung `dist/` vào thư mục `be/themes/<theme-name>/assets/`, hoặc  
- Triển khai riêng trên **Netlify**, **Vercel**, hoặc hosting tĩnh khác.

---

## 🧾 8. Ghi chú
- Cổng mặc định:
  - Frontend: **5173**
  - Backend: **8000**
- Chạy backend trước để frontend có thể gọi API.
- Khi deploy thực tế, nên bật HTTPS và cập nhật `API_BASE_URL` trong frontend.

---

✨ **Tác giả:** *Việt Anh Nguyễn*  
📅 **Cập nhật:** 2025-10-17  
💻 **Công nghệ:** React, Vite, TailwindCSS, OctoberCMS, PHP 8, Laravel 9
