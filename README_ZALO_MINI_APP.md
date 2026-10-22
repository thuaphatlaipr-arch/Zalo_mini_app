# 📱 HƯỚNG DẪN VẬN HÀNH & TRIỂN KHAI ZALO MINI APP
## VĂN PHÒNG THI HÀNH ÁN DÂN SỰ & THỪA PHÁT LẠI PHAN RANG

---

### 🌟 1. Tổng quan Kiến trúc
Ứng dụng Zalo Mini App được xây dựng theo chuẩn **ZMP Framework** của Zalo và tích hợp trực tiếp vào **Hệ điều hành THADS Phan Rang** (`server.py` + `vpthads.db`).

* **Mã nguồn Mini App**: Nằm tại thư mục `d:\Hệ thống điều hành VPTHADS PR\zalo_mini_app`
* **API Máy chủ Backend**: Đã tích hợp sẵn vào `server.py` qua các cổng REST API:
  - `GET /api/zalo/services`: Danh mục dịch vụ & biểu phí công khai.
  - `POST /api/zalo/appointments`: Tiếp nhận đặt lịch tư vấn.
  - `POST /api/zalo/vibang-requests`: Tiếp nhận hồ sơ lập vi bằng kèm ảnh hiện trường & toạ độ GPS.
  - `GET /api/zalo/lookup?query=...`: Cổng tra cứu tiến độ hồ sơ thời gian thực (5 bước chuẩn).

---

### 🚀 2. Cách xem thử (Preview) ngay trên Máy tính & Điện thoại

#### Cách 1: Chạy trực tiếp qua Trình duyệt Web / Mobile
1. Khởi động máy chủ backend:
   ```powershell
   python server.py
   ```
2. Mở trình duyệt truy cập:
   - Trên máy tính: `http://localhost:5000/zalo_mini_app/index.html`
   - Trên điện thoại (cùng mạng Wi-Fi với máy tính hoặc qua IP VPS): `http://<IP_MÁY_CHỦ>:5000/zalo_mini_app/index.html`

---

#### Cách 2: Chạy thử nghiệm trên ứng dụng Zalo (Không cần Zalo OA)
1. **Tải phần mềm Zalo Mini App Studio** miễn phí từ Zalo: [https://mini.zalo.me/docs/download/](https://mini.zalo.me/docs/download/)
2. Mở **Zalo Mini App Studio**, đăng nhập bằng tài khoản Zalo cá nhân của bạn.
3. Chọn **Open Project (Mở dự án)** ➔ Trỏ đến thư mục:
   `d:\Hệ thống điều hành VPTHADS PR\zalo_mini_app`
4. Bấm **Run Simulator** để xem giao diện giả lập iPhone/Android ngay trên máy tính.
5. Bấm nút **Scan QR Code (Quét mã)** ➔ Mở Zalo trên điện thoại quét mã QR để trải nghiệm app thật ngay trong Zalo cá nhân.

---

### 🏛️ 3. Quy trình Đăng ký Zalo OA và Phát hành chính thức (Khi Văn phòng sẵn sàng)

1. **Bước 1**: Đăng ký Zalo Official Account (OA) Doanh nghiệp tại [https://oa.zalo.me/](https://oa.zalo.me/) bằng giấy phép hoạt động của Văn phòng Thừa phát lại Phan Rang.
2. **Bước 2**: Truy cập [https://mini.zalo.me/](https://mini.zalo.me/), tạo Mini App mới và liên kết với Zalo OA vừa tạo.
3. **Bước 3**: Bấm **Deploy / Upload Version** từ Zalo Mini App Studio lên nền tảng Zalo.
4. **Bước 4**: Gắn nút mở Mini App vào Menu của Zalo OA và in mã QR đặt tại bàn tiếp dân của Văn phòng để người dân quét sử dụng.
