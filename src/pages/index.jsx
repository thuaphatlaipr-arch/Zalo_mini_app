import React from "react";
import { Page, Header, Box, Text, Button, Icon, List, useNavigate } from "zmp-ui";
import HeaderBanner from "../components/HeaderBanner";

const HomePage = () => {
  const navigate = useNavigate();

  // Danh sách dịch vụ cốt lõi của Văn phòng
  const services = [
    {
      id: "vibang_coc",
      title: "Lập Vi bằng giao nhận tiền",
      desc: "Tạo lập chứng cứ giao dịch cọc mua bán nhà đất, vay mượn tiền mặt",
      icon: "zi-file",
      badge: "Phổ biến nhất",
    },
    {
      id: "vibang_hien_trang",
      title: "Vi bằng hiện trạng nhà đất",
      desc: "Ghi nhận hiện trạng nứt nhà, ranh giới đất, mặt bằng trước khi thi công",
      icon: "zi-home",
      badge: "Bảo vệ tài sản",
    },
    {
      id: "thi_hanh_an",
      title: "Tư vấn & Xác minh THADS",
      desc: "Hỗ trợ thủ tục thi hành án dân sự, xác minh tài sản bên phải thi hành án",
      icon: "zi-user-check",
      badge: "Đúng luật",
    },
    {
      id: "tong_dat",
      title: "Tống đạt văn bản tố tụng",
      desc: "Thực hiện tống đạt giấy tờ theo yêu cầu của Tòa án, VKS và đương sự",
      icon: "zi-send",
      badge: "Nhanh chóng",
    },
    {
      id: "vibang_internet",
      title: "Vi bằng chứng cứ Internet / MXH",
      desc: "Lập vi bằng tin nhắn Zalo, Facebook, email, bài đăng xúc phạm/vu khống",
      icon: "zi-globe",
      badge: "Bảo đảm",
    },
  ];

  // Tin tức / Cảnh báo pháp lý
  const legalNews = [
    {
      id: 1,
      title: "⚠️ Rủi ro mua bán nhà đất bằng giấy tay",
      content: "Mua bán nhà đất chỉ làm giấy tay tiềm ẩn nguy cơ mất trắng khi giá đất tăng hoặc có tranh chấp. Cần lập Vi bằng ghi nhận việc giao nhận tiền và hiện trạng đất để bảo vệ quyền lợi.",
    },
    {
      id: 2,
      title: "⚖️ Vì sao nên lập Vi bằng trước khi xây nhà sát vách?",
      content: "Ghi nhận hiện trạng nhà liền kề trước khi khởi công giúp ngăn ngừa và giải quyết nhanh chóng các khiếu nại nứt lún, sụt lún không có căn cứ.",
    },
    {
      id: 3,
      title: "📜 Trình tự xác minh tài sản Thi hành án dân sự",
      content: "Thừa phát lại có thẩm quyền trực tiếp xác minh tài sản, tài khoản ngân hàng và điều kiện thi hành án của người phải thi hành án theo quy định.",
    },
  ];

  return (
    <Page className="bg-white" style={{ paddingBottom: "80px" }}>
      {/* Header cố định */}
      <Header title="VP Thừa Phát Lại Phan Rang (Nay là VP THADS DNTN Phan Rang)" showBackOnly={false} />

      <Box p={4}>
        {/* Banner Giới thiệu */}
        <HeaderBanner onConsultClick={() => navigate("/contact")} />

        {/* Quick Menu Grid */}
        <Box
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            textAlign: "center",
          }}
        >
          <Box
            className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100"
            onClick={() => navigate("/contact")}
          >
            <Icon icon="zi-edit-text" className="text-blue-600 mb-1" style={{ fontSize: "24px" }} />
            <Text size="xSmall" className="font-semibold block">Đăng ký tư vấn</Text>
          </Box>
          <Box
            className="p-3 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100"
            onClick={() => navigate("/services")}
          >
            <Icon icon="zi-list-1" className="text-green-600 mb-1" style={{ fontSize: "24px" }} />
            <Text size="xSmall" className="font-semibold block">Bảng giá dịch vụ</Text>
          </Box>
          <Box
            className="p-3 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100"
            onClick={() => navigate("/about")}
          >
            <Icon icon="zi-location" className="text-amber-600 mb-1" style={{ fontSize: "24px" }} />
            <Text size="xSmall" className="font-semibold block">Về Văn phòng</Text>
          </Box>
        </Box>

        {/* Danh mục Dịch vụ */}
        <Box className="mb-4">
          <Box flex justifyContent="space-between" alignItems="center" className="mb-2">
            <Text.Title size="medium" className="font-bold">
              ⚖️ Dịch vụ Pháp lý Cốt lõi
            </Text.Title>
            <Text
              size="xSmall"
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/services")}
            >
              Xem tất cả &gt;
            </Text>
          </Box>

          <List>
            {services.map((item) => (
              <List.Item
                key={item.id}
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        backgroundColor: "#e0f2fe",
                        color: "#0284c7",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                }
                subTitle={item.desc}
                prefix={<Icon icon={item.icon} style={{ color: "#0068FF", fontSize: "22px" }} />}
                onClick={() => navigate(`/contact?service=${item.id}`)}
              />
            ))}
          </List>
        </Box>

        {/* Tin tức / Cảnh báo pháp lý */}
        <Box className="mb-4">
          <Text.Title size="medium" className="font-bold mb-2">
            📢 Cảnh báo & Tin tức Pháp lý
          </Text.Title>
          {legalNews.map((news) => (
            <Box
              key={news.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 card-shadow"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <Text.Title size="small" className="font-semibold text-red-600 mb-1">
                {news.title}
              </Text.Title>
              <Text size="xSmall" className="text-gray-600 leading-relaxed">
                {news.content}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Cam kết của Thừa phát lại */}
        <Box className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-4">
          <Text.Title size="small" className="font-bold text-emerald-800 mb-2">
            🛡️ Cam Kết Chất Lượng & Pháp Lý
          </Text.Title>
          <Text size="xSmall" className="text-emerald-900 block mb-1">
            ✓ Vi bằng được đăng ký tại Sở Tư Pháp Khánh Hòa theo đúng quy định Nghị định 08/2020/NĐ-CP.
          </Text>
          <Text size="xSmall" className="text-emerald-900 block mb-1">
            ✓ Có giá trị chứng cứ tuyệt đối trước Tòa án và các cơ quan nhà nước.
          </Text>
          <Text size="xSmall" className="text-emerald-900 block">
            ✓ Phục vụ tận nơi 24/7 - Kịp thời, bảo mật, chính xác, tận tâm.
          </Text>
        </Box>
      </Box>

      {/* Nút Gọi Hotline & Tư vấn nhanh cố định ở đáy màn hình */}
      <Box className="floating-bottom-bar">
        <Box flex flexDirection="row" style={{ gap: "10px" }}>
          <Button
            style={{ flex: 1, backgroundColor: "#28a745" }}
            icon={<Icon icon="zi-call" />}
            onClick={() => window.open("tel:0913709898")}
          >
            Hotline: 0913 709 898
          </Button>
          <Button
            style={{ flex: 1, backgroundColor: "#0068FF" }}
            icon={<Icon icon="zi-edit-text" />}
            onClick={() => navigate("/contact")}
          >
            Đăng Ký Tư Vấn
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default HomePage;
