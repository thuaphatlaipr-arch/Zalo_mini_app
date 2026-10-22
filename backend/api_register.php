<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cấu hình thông số từ Zalo Developer Console & Zalo OA
define('ZALO_APP_SECRET', getenv('ZALO_APP_SECRET') ?: 'YOUR_APP_SECRET');
define('ZALO_OA_ACCESS_TOKEN', getenv('ZALO_OA_ACCESS_TOKEN') ?: 'YOUR_OA_ACCESS_TOKEN');
define('ADMIN_ZALO_USER_ID', getenv('ADMIN_ZALO_USER_ID') ?: 'YOUR_ADMIN_USER_ID');

// Nhận dữ liệu JSON từ Mini App
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$fullName = $data['fullName'] ?? '';
$phone = $data['phone'] ?? '';
$phoneToken = $data['phoneToken'] ?? '';
$userAccessToken = $data['userAccessToken'] ?? '';
$service = $data['service'] ?? 'vibang_coc';
$note = $data['note'] ?? '';

// 1. Hàm giải mã Số điện thoại Zalo từ Token
function decodeZaloPhone($token, $userToken) {
    $url = "https://graph.zalo.me/v2.0/me/info";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "access_token: {$userToken}",
        "code: {$token}",
        "secret_key: " . ZALO_APP_SECRET
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    $resData = json_decode($response, true);
    return $resData['data']['number'] ?? null;
}

// Nếu có Token, giải mã SĐT thực tế từ Zalo
if (!empty($phoneToken) && !empty($userAccessToken)) {
    $decoded = decodeZaloPhone($phoneToken, $userAccessToken);
    if ($decoded) {
        $phone = $decoded;
    }
}

if (empty($fullName) || empty($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu Họ tên hoặc Số điện thoại"]);
    exit;
}

// Map tên dịch vụ
$serviceNames = [
    'vibang_coc' => 'Vi bằng Giao nhận tiền / Đặt cọc mua đất',
    'vibang_hien_trang' => 'Vi bằng Ghi nhận Hiện trạng nhà đất',
    'thi_hanh_an' => 'Xác minh Điều kiện Thi hành án dân sự',
    'tong_dat' => 'Tống đạt Văn bản & Giấy tờ tố tụng',
    'vibang_internet' => 'Vi bằng Chứng cứ MXH / Internet',
    'khac' => 'Tư vấn Pháp lý khác'
];
$serviceText = $serviceNames[$service] ?? $service;

// 2. Nội dung tin nhắn thông báo gửi về Zalo OA
$messageText = "🔔 THÔNG BÁO KHÁCH HÀNG MỚI ĐĂNG KÝ TƯ VẤN\n\n"
    . "👤 Họ tên: {$fullName}\n"
    . "📞 Số điện thoại: {$phone}\n"
    . "⚖️ Dịch vụ quan tâm: {$serviceText}\n"
    . "📝 Ghi chú: " . ($note ? $note : "Không có") . "\n"
    . "⏰ Thời gian: " . date("H:i:s d/m/Y") . "\n\n"
    . "🏛️ VĂN PHÒNG THỪA PHÁT LẠI PHAN RANG (Nay là Văn phòng Thi hành án dân sự DNTN Phan Rang)";

// 3. Gửi tin nhắn qua Zalo Open API
$oaUrl = "https://openapi.zalo.me/v3.0/oa/message/cs";
$payload = [
    "recipient" => ["user_id" => ADMIN_ZALO_USER_ID],
    "message" => ["text" => $messageText]
];

$ch = curl_init($oaUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "access_token: " . ZALO_OA_ACCESS_TOKEN,
    "Content-Type: application/json"
]);

$result = curl_exec($ch);
curl_close($ch);

// Lưu vào file JSON log tại server
$logEntry = [
    "fullName" => $fullName,
    "phone" => $phone,
    "service" => $serviceText,
    "note" => $note,
    "time" => date("c")
];
@file_put_contents(__DIR__ . '/leads_php.json', json_encode($logEntry, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND);

echo json_encode([
    "success" => true,
    "message" => "Đăng ký thành công!",
    "data" => [
        "fullName" => $fullName,
        "phone" => $phone,
        "service" => $serviceText
    ]
]);
?>
