import React from "react";
import { Box, Text, Button, Icon } from "zmp-ui";

const HeaderBanner = ({ onConsultClick }) => {
  return (
    <Box
      className="p-4 rounded-2xl text-white shadow-lg mb-4 banner-gradient"
      style={{
        background: "linear-gradient(135deg, #0068FF 0%, #0c4a6e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative emblem badge */}
      <Box
        style={{
          position: "absolute",
          right: -15,
          top: -15,
          opacity: 0.15,
          fontSize: "120px",
          pointerEvents: "none",
        }}
      >
        ⚖️
      </Box>

      <Text.Title size="large" className="font-bold mb-0.5 text-white" style={{ fontSize: "16px" }}>
        🏛️ VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG
      </Text.Title>
      <Text size="xSmall" className="font-bold mb-2 text-amber-300 block">
        (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang)
      </Text>

      <Text size="small" className="opacity-90 block mb-1">
        📍 61/9 Nguyễn Văn Trỗi, P. Phan Rang, Khánh Hòa
      </Text>

      <Text size="xSmall" className="italic block mb-3 text-blue-100">
        "Giải pháp bảo vệ tài sản & Tạo lập chứng cứ pháp lý vững chắc"
      </Text>

      <Box flex flexDirection="row" style={{ gap: "8px" }}>
        <Button
          size="small"
          type="highlight"
          icon={<Icon icon="zi-edit-text" />}
          onClick={onConsultClick}
          style={{ backgroundColor: "#fbbf24", color: "#1e293b", fontWeight: "bold" }}
        >
          Đăng ký tư vấn miễn phí
        </Button>
        <Button
          size="small"
          type="neutral"
          icon={<Icon icon="zi-call" />}
          onClick={() => window.open("tel:0913709898")}
          style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
        >
          0913 709 898
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderBanner;
