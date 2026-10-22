import React from "react";
import { Page, Header, Box, Text, Button, Icon, useNavigate } from "zmp-ui";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Page className="bg-white" style={{ paddingBottom: "70px" }}>
      <Header title="Về Chúng Tôi" showBackOnly={false} />

      <Box p={4}>
        <Box className="text-center mb-4">
          <Text.Title size="medium" className="font-bold text-blue-900 mb-0.5">
            VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG
          </Text.Title>
          <Text size="xSmall" className="font-bold text-amber-600 block mb-1">
            (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang)
          </Text>
          <Text size="small" className="text-gray-500 italic">
            Tận tâm - Chuyên nghiệp - Bảo đảm Pháp lý
          </Text>
        </Box>

        <Box className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
          <Text.Title size="small" className="font-bold text-slate-800 mb-2">
            🏛️ Thông Tin Pháp Nhân
          </Text.Title>
          <Text size="small" className="text-gray-700 block mb-1">
            • <b>Tên gọi:</b> VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang)
          </Text>
          <Text size="small" className="text-gray-700 block mb-1">
            • <b>Địa chỉ:</b> 61/9 Nguyễn Văn Trỗi, P. Phan Rang, Tỉnh Khánh Hòa
          </Text>
          <Text size="small" className="text-gray-700 block mb-1">
            • <b>Hotline:</b> 0913 709 898 (Hỗ trợ 24/7)
          </Text>
          <Text size="small" className="text-gray-700 block mb-1">
            • <b>Email:</b> thuaphatlaipr@gmail.com
          </Text>
          <Text size="small" className="text-gray-700 block">
            • <b>Cơ quan quản lý:</b> Sở Tư Pháp Tỉnh Khánh Hòa
          </Text>
        </Box>

        <Box className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
          <Text.Title size="small" className="font-bold text-blue-900 mb-2">
            ⚖️ Sứ Mệnh & Tầm Nhìn
          </Text.Title>
          <Text size="small" className="text-blue-950 leading-relaxed block mb-2">
            Văn phòng Thừa phát lại Phan Rang (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang) là tổ chức hành nghề pháp lý uy tín, được thành lập và hoạt động theo quy định của pháp luật Việt Nam. Chúng tôi cam kết mang lại các giải pháp lập vi bằng, xác minh tài sản và bảo vệ quyền lợi hợp pháp của người dân và doanh nghiệp với tiêu chuẩn cao nhất.
          </Text>
          <Text size="small" className="text-blue-950 leading-relaxed block">
            Mọi vi bằng do Thừa phát lại Phan Rang lập đều được số hóa, lưu trữ an toàn và đăng ký hợp pháp tại Sở Tư Pháp Khánh Hòa.
          </Text>
        </Box>

        <Button
          fullWidth
          icon={<Icon icon="zi-edit-text" />}
          style={{ backgroundColor: "#0068FF" }}
          onClick={() => navigate("/contact")}
        >
          Liên Hệ Tư Vấn Trực Tiếp
        </Button>
      </Box>

      {/* Floating Call */}
      <Box className="floating-bottom-bar">
        <Button
          fullWidth
          icon={<Icon icon="zi-call" />}
          style={{ backgroundColor: "#28a745" }}
          onClick={() => window.open("tel:0913709898")}
        >
          Gọi Hotline: 0913 709 898
        </Button>
      </Box>
    </Page>
  );
};

export default AboutPage;
