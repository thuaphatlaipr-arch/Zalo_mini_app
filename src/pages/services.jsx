import React from "react";
import { Page, Header, Box, Text, Button, Icon, useNavigate } from "zmp-ui";

const ServicesPage = () => {
  const navigate = useNavigate();

  const serviceDetails = [
    {
      id: "vibang_coc",
      title: "1. Vi bằng Giao nhận tiền / Đặt cọc nhà đất",
      desc: "Lập chứng cứ ghi nhận trực tiếp việc giao tiền, chuyển khoản đặt cọc mua bán bất động sản, góp vốn đầu tư, vay mượn tài sản.",
      price: "Theo thỏa thuận & quy định pháp luật",
      benefits: [
        "Chứng cứ thép có giá trị pháp lý tuyệt đối trước Tòa án",
        "Ngăn chặn hoàn toàn việc bên bán lật kèo, chối bỏ nhận tiền",
        "Được đăng ký tại Sở Tư Pháp Khánh Hòa trong vòng 03 ngày làm việc",
      ],
    },
    {
      id: "vibang_hien_trang",
      title: "2. Vi bằng Ghi nhận Hiện trạng Nhà đất / Xây dựng",
      desc: "Ghi nhận hiện trạng nứt lún, ranh giới mốc giới thửa đất, hiện trạng công trình trước khi khởi công xây dựng nhà liền kề, hiện trạng bàn giao nhà/mặt bằng cho thuê.",
      price: "Theo thỏa thuận & quy định pháp luật",
      benefits: [
        "Bảo vệ công trình xây dựng khỏi các khiếu nại bồi thường vô căn cứ",
        "Có kèm hình ảnh, video và sơ đồ hiện trạng chi tiết",
        "Có mặt tại hiện trường nhanh chóng trong 30-60 phút",
      ],
    },
    {
      id: "thi_hanh_an",
      title: "3. Xác minh Điều kiện Thi hành án dân sự",
      desc: "Trực tiếp xác minh tài sản, quyền sử dụng đất, tài khoản ngân hàng, thu nhập của người phải thi hành án để yêu cầu cơ quan THADS cưỡng chế thu hồi nợ.",
      price: "Theo thỏa thuận & quy định pháp luật",
      benefits: [
        "Thẩm quyền xác minh trực tiếp tại Ngân hàng, Văn phòng Đăng ký Đất đai",
        "Lập hồ sơ xác minh chuẩn quy định để thụ lý thi hành án",
        "Rút ngắn tối đa thời gian thu hồi nợ hợp pháp",
      ],
    },
    {
      id: "tong_dat",
      title: "4. Tống đạt Văn bản & Giấy tờ tố tụng",
      desc: "Thực hiện việc chuyển giao trực tiếp các văn bản của Tòa án, Viện kiểm sát nhân dân, Cơ quan Thi hành án dân sự hoặc văn bản giữa các tổ chức, cá nhân.",
      price: "Từ 150.000 VNĐ / Văn bản",
      benefits: [
        "Đúng trình tự thủ tục Bộ luật Tố tụng Dân sự & Luật THADS",
        "Bàn giao biên bản giao nhận có ký nhận rõ ràng",
        "Tống đạt toàn tỉnh Khánh Hòa và khu vực lân cận",
      ],
    },
  ];

  return (
    <Page className="bg-white" style={{ paddingBottom: "70px" }}>
      <Header title="Dịch Vụ & Biểu Phí" showBackOnly={false} />

      <Box p={4}>
        <Text.Title size="medium" className="font-bold mb-1 text-blue-800">
          Danh Mục Dịch Vụ Thừa Phát Lại
        </Text.Title>
        <Text size="small" className="text-gray-500 mb-4">
          Biểu phí minh bạch, niêm yết công khai và thực hiện theo quy định của Bộ Tư Pháp.
        </Text>

        <Box className="space-y-4">
          {serviceDetails.map((s) => (
            <Box
              key={s.id}
              className="p-4 rounded-xl border border-blue-100 bg-slate-50 shadow-sm mb-4"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <Text.Title size="small" className="font-bold text-blue-900 mb-1">
                {s.title}
              </Text.Title>
              <Text size="small" className="text-gray-600 mb-2">
                {s.desc}
              </Text>

              <Box className="my-2 p-2 bg-blue-100 rounded-lg">
                <Text size="xSmall" className="font-bold text-blue-800">
                  💰 Mức phí tham khảo: {s.price}
                </Text>
              </Box>

              <Box className="mt-2 mb-3">
                {s.benefits.map((b, i) => (
                  <Text key={i} size="xSmall" className="text-emerald-700 block mb-1">
                    ✓ {b}
                  </Text>
                ))}
              </Box>

              <Button
                size="small"
                fullWidth
                style={{ backgroundColor: "#0068FF" }}
                onClick={() => navigate(`/contact?service=${s.id}`)}
              >
                Đặt Lịch Làm Dịch Vụ Này
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Floating Call */}
      <Box className="floating-bottom-bar">
        <Button
          fullWidth
          icon={<Icon icon="zi-call" />}
          style={{ backgroundColor: "#28a745" }}
          onClick={() => window.open("tel:0913709898")}
        >
          Hotline Khẩn Cấp: 0913 709 898
        </Button>
      </Box>
    </Page>
  );
};

export default ServicesPage;
