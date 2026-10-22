# 📘 HƯỚNG DẪN TRIỂN KHAI ZALO MINI APP TOÀN DIỆN
## VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG (VP THADSPR)

Tài liệu này được biên soạn dựa trên yêu cầu kỹ thuật và nghiệp vụ thực tế của **Văn phòng Thừa phát lại Phan Rang**, hướng dẫn chi tiết từng bước xây dựng, kiểm thử, cấp quyền Zalo SDK (Họ tên + Số điện thoại 1-Click), triển khai Backend giải mã Token và nộp xét duyệt lên Zalo Platforms.

---

## 📂 1. Cấu Trúc Mã Nguồn Mini App Đã Xây Dựng

```text
zalo_mini_app/
├── app-config.json               # Cấu hình Zalo Mini App (Tiêu đề, màu sắc, trang điều hướng)
├── package.json                  # Khai báo thư viện (React, zmp-ui, zmp-sdk, vite, zmp-cli)
├── vite.config.js                # Cấu hình bundle Vite cho Zalo Mini App
├── index.html                    # File HTML gốc tích hợp font Inter & ZMP runtime
│
├── src/
│   ├── app.jsx                   # Cấu trúc ứng dụng & ZMP Router (Điều hướng các trang)
│   ├── css/
│   │   └── app.css               # Styling chuẩn ZMP UI, phối màu nhận diện pháp lý (#0068FF & #1a365d)
│   ├── components/
│   │   └── HeaderBanner.jsx      # Banner thương hiệu VP Thừa Phát Lại Phan Rang & Hotline
│   └── pages/
│       ├── index.jsx             # Trang chủ (Giới thiệu, Dịch vụ cốt lõi, Cảnh báo pháp lý, Hotline)
│       ├── contact.jsx           # Form Đăng Ký Tư Vấn (Tự lấy Họ Tên & Nút 1-Click lấy SĐT Zalo)
│       ├── services.jsx          # Chi tiết 4 dịch vụ chính & Bảng giá tham khảo
│       └── about.jsx             # Giới thiệu thông tin pháp nhân, địa chỉ, sứ mệnh
│
└── backend/
    ├── package.json              # Khai báo backend Node.js (Express, Axios, CORS, Dotenv)
    ├── server.js                 # Backend Node.js giải mã SĐT Zalo & Gửi thông báo về Zalo OA Admin
    ├── api_register.php          # Backend PHP (dành cho Hosting cPanel/DirectAdmin hoặc Nginx)
    └── .env.example              # Cấu hình mẫu biến môi trường bảo mật
```

---

## ⚡ 2. Hướng Dẫn Cài Đặt & Chạy Thử Nghiệm

### Bước 1: Cài đặt công cụ Zalo Mini App CLI
Mở terminal (PowerShell hoặc Command Prompt) và chạy lệnh:
```bash
npm install -g zmp-cli
```

### Bước 2: Cài đặt thư viện dự án
Truy cập vào thư mục `zalo_mini_app`:
```bash
cd "d:\Hệ thống điều hành VPTHADS PR\zalo_mini_app"
npm install
```

### Bước 3: Chạy thử trên máy tính & quét mã QR trải nghiệm trên điện thoại
```bash
npm run start
# hoặc
zmp start
```
* Hệ thống sẽ tự động mở trang xem trước giả lập trên trình duyệt.
* Quét mã QR hiển thị trên màn hình bằng ứng dụng Zalo trên điện thoại thật để trải nghiệm giao diện và các tính năng tương tác.

---

## 🔐 3. Cấu Hình Cấp Quyền Trên Zalo Developer Console

Để tính năng **Tự động điền Họ tên** và **Nút lấy Số điện thoại 1-Click** hoạt động trên thiết bị thực của khách hàng:

1. Đăng nhập vào [Zalo Developer Console](https://developers.zalo.me/).
2. Chọn ứng dụng Mini App **Văn Phòng Thừa Phát Lại Phan Rang**.
3. Đi tới mục **Cấu hình (Configuration)** ➔ **Quyền truy cập (App Permissions)**:
   * ✅ Bật quyền: **Thông tin người dùng (User Profile - Họ tên, Avatar)** (`getUserInfo`).
   * ✅ Bật quyền: **Số điện thoại người dùng (User Phone Number)** (`getPhoneNumber`).
4. Tại mục **Cài đặt chung**, lưu lại **App ID** và **App Secret** để đưa vào Backend.

---

## 🖥️ 4. Triển Khai Backend Xử Lý Dữ Liệu & Thông Báo OA

### Cách 1: Sử dụng Backend Node.js (Express)
1. Truy cập thư mục backend:
   ```bash
   cd "d:\Hệ thống điều hành VPTHADS PR\zalo_mini_app\backend"
   npm install
   ```
2. Tạo file `.env` từ `.env.example`:
   ```env
   PORT=5000
   ZALO_APP_SECRET=dien_app_secret_tu_zalo_console
   ZALO_OA_ACCESS_TOKEN=dien_oa_access_token
   ADMIN_ZALO_USER_ID=dien_zalo_user_id_truong_van_phong
   ```
3. Chạy server:
   ```bash
   node server.js
   ```

### Cách 2: Sử dụng Backend PHP
Nếu máy chủ của Văn phòng chạy PHP (Apache/Nginx/cPanel):
* Tải file `api_register.php` lên thư mục web của hosting (ví dụ: `https://tenmiencuaban.vn/api/api_register.php`).
* Cập nhật các hằng số `ZALO_APP_SECRET`, `ZALO_OA_ACCESS_TOKEN`, `ADMIN_ZALO_USER_ID` trong file `api_register.php`.

---

## 🚀 5. Đóng Gói (Build) & Gửi Xét Duyệt Lên Zalo

Khi đã kiểm tra hoàn tất trên môi trường thử nghiệm:
1. Đăng nhập tài khoản Zalo trên CLI:
   ```bash
   zmp login
   ```
2. Đóng gói và tải phiên bản lên hệ thống Zalo:
   ```bash
   zmp deploy
   ```
3. Truy cập [Zalo Mini App Dashboard](https://mini.zalo.me/), chọn phiên bản vừa upload ➔ Bấm **Gửi xét duyệt (Submit for Review)**.
4. Sau khi đội ngũ Zalo duyệt (thường từ 1 - 3 ngày làm việc), Mini App sẽ chính thức hoạt động và có thể ghim vào Menu của Zalo OA Văn phòng Thừa phát lại Phan Rang.

---

## 📞 6. Hỗ Trợ & Thông Tin Liên Hệ Văn Phòng
* **Cơ quan:** Văn Phòng Thừa Phát Lại Phan Rang
* **Địa chỉ:** 61/9 Nguyễn Văn Trỗi, P. Phan Rang, Tỉnh Khánh Hòa
* **Hotline:** 0913 709 898
* **Email:** thuaphatlaipr@gmail.com
