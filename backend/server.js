const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình thông tin từ Zalo Developer Console & Zalo OA
const ZALO_APP_SECRET = process.env.ZALO_APP_SECRET || "YOUR_APP_SECRET";
const ZALO_OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || "YOUR_OA_ACCESS_TOKEN";
const ADMIN_ZALO_USER_ID = process.env.ADMIN_ZALO_USER_ID || "YOUR_ADMIN_USER_ID"; // User ID Zalo của Trưởng VP/Admin

// 1. Hàm giải mã Số điện thoại từ Zalo Phone Token qua Zalo Graph API v2.0
async function decodeZaloPhoneNumber(phoneToken, userAccessToken) {
  try {
    const response = await axios.get("https://graph.zalo.me/v2.0/me/info", {
      headers: {
        access_token: userAccessToken,
        code: phoneToken,
        secret_key: ZALO_APP_SECRET,
      },
    });

    const phoneNumber = response.data?.data?.number;
    if (phoneNumber) {
      console.log("✅ Giải mã SĐT Zalo thành công:", phoneNumber);
      return phoneNumber;
    }
    return null;
  } catch (error) {
    console.error("❌ Lỗi giải mã SĐT Zalo:", error.response?.data || error.message);
    return null;
  }
}

// 2. Hàm gửi tin nhắn thông báo đến Zalo OA / Admin Trưởng Văn Phòng
async function sendOANotification(customerData) {
  const serviceLabels = {
    vibang_coc: "Vi bằng Giao nhận tiền / Đặt cọc mua đất",
    vibang_hien_trang: "Vi bằng Ghi nhận Hiện trạng nhà đất",
    thi_hanh_an: "Xác minh Điều kiện Thi hành án dân sự",
    tong_dat: "Tống đạt Văn bản & Giấy tờ tố tụng",
    vibang_internet: "Vi bằng Chứng cứ MXH / Internet",
    khac: "Tư vấn Pháp lý khác",
  };

  const serviceName = serviceLabels[customerData.service] || customerData.service;
  const timeStr = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  const messageText =
    `🔔 THÔNG BÁO KHÁCH HÀNG MỚI ĐĂNG KÝ TƯ VẤN\n\n` +
    `👤 Họ tên: ${customerData.fullName}\n` +
    `📞 Số điện thoại: ${customerData.phone}\n` +
    `⚖️ Dịch vụ quan tâm: ${serviceName}\n` +
    `📝 Ghi chú: ${customerData.note || "Không có"}\n` +
    `⏰ Thời gian: ${timeStr}\n\n` +
    `🏛️ VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang)`;

  try {
    if (!ZALO_OA_ACCESS_TOKEN || ZALO_OA_ACCESS_TOKEN === "YOUR_OA_ACCESS_TOKEN") {
      console.log("⚠️ ZALO_OA_ACCESS_TOKEN chưa được cấu hình. Nội dung tin nhắn mẫu:\n", messageText);
      return { status: "simulated", message: "Chưa cấu hình Token OA" };
    }

    const response = await axios.post(
      "https://openapi.zalo.me/v3.0/oa/message/cs",
      {
        recipient: {
          user_id: ADMIN_ZALO_USER_ID,
        },
        message: {
          text: messageText,
        },
      },
      {
        headers: {
          access_token: ZALO_OA_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Gửi tin nhắn Zalo OA thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi gửi tin nhắn Zalo OA:", error.response?.data || error.message);
    return null;
  }
}

// Hàm lưu dữ liệu đăng ký vào file JSON log để không bị mất khách hàng
function saveLeadToStorage(data) {
  try {
    const filePath = path.join(__dirname, "leads_registered.json");
    let leads = [];
    if (fs.existsSync(filePath)) {
      leads = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
    }
    leads.push({ ...data, registeredAt: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.error("Lỗi lưu file lead:", e);
  }
}

// 3. API Endpoint tiếp nhận đăng ký từ Mini App
app.post("/api/register-consultation", async (req, res) => {
  const { fullName, phone, phoneToken, userAccessToken, service, note } = req.body;

  let finalPhone = phone;

  // Nếu Mini App gửi phoneToken, tiến hành giải mã để lấy SĐT thực
  if (phoneToken && userAccessToken) {
    const decodedPhone = await decodeZaloPhoneNumber(phoneToken, userAccessToken);
    if (decodedPhone) {
      finalPhone = decodedPhone;
    }
  }

  if (!fullName || !finalPhone) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin Họ tên hoặc Số điện thoại!",
    });
  }

  const customerData = {
    fullName,
    phone: finalPhone,
    service: service || "vibang_coc",
    note: note || "",
  };

  // Lưu vào danh sách Lead
  saveLeadToStorage(customerData);

  // Gửi thông báo về Zalo OA của Văn phòng
  await sendOANotification(customerData);

  return res.json({
    success: true,
    message: "Đăng ký tư vấn thành công! Chuyên viên sẽ liên hệ lại ngay.",
    data: customerData,
  });
});

// Endpoint kiểm tra trạng thái Server
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "VP Thừa Phát Lại Phan Rang - Zalo Backend API",
    time: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server Zalo Mini App đang chạy tại: http://localhost:${PORT}`);
});
