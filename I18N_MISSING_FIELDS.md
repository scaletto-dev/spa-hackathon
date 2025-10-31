# I18N Missing Fields Analysis

## Hiện có các section chính:
- dashboard
- bookings
- profile
- auth
- common
- contact
- reviews
- branches
- nav
- home
- services
- footer
- chat
- admin
- payment
- settings
- blog

## Các field nên thêm vào i18n:

### 1. Profile Management Section (Hiện tại thiếu chi tiết)
```json
"profileManagement": {
    "title": "Profile Management",
    "updateSuccess": "Cập nhật thông tin thành công!",
    "updateError": "Lỗi cập nhật thông tin. Vui lòng thử lại.",
    "loadingProfile": "Đang tải thông tin cá nhân...",
    "personalInfo": "Thông tin cá nhân",
    "editProfile": "Chỉnh sửa thông tin",
    "fullName": "Họ và tên",
    "phone": "Số điện thoại",
    "language": "Ngôn ngữ",
    "language_vi": "🇻🇳 Tiếng Việt",
    "language_en": "🇬🇧 English",
    "language_ja": "🇯🇵 日本語",
    "language_zh": "🇨🇳 中文",
    "memberSince": "Thành viên từ",
    "lastUpdated": "Cập nhật lần cuối",
    "validation": {
        "nameRequired": "Vui lòng nhập họ tên",
        "phoneRequired": "Vui lòng nhập số điện thoại",
        "nameMinLength": "Họ tên phải có ít nhất 2 ký tự",
        "invalidPhone": "Số điện thoại không hợp lệ"
    }
}
```

### 2. Admin Header Section
```json
"adminHeader": {
    "welcome": "Chào mừng",
    "profile": "Hồ sơ",
    "settings": "Cài đặt",
    "logout": "Đăng xuất",
    "notifications": "Thông báo",
    "messages": "Tin nhắn"
}
```

### 3. Notifications & Alerts
```json
"notifications": {
    "profileUpdated": "Hồ sơ đã được cập nhật",
    "profileUpdateFailed": "Cập nhật hồ sơ thất bại",
    "changeSaved": "Thay đổi đã được lưu",
    "changeNotSaved": "Không thể lưu thay đổi",
    "confirmationSent": "Xác nhận đã được gửi",
    "tryAgain": "Vui lòng thử lại"
}
```

### 4. Form Labels & Placeholders
```json
"formLabels": {
    "enterFullName": "Nhập họ và tên",
    "enterPhone": "Nhập số điện thoại",
    "selectLanguage": "Chọn ngôn ngữ",
    "optional": "(Tùy chọn)",
    "required": "(Bắt buộc)"
}
```

## Cách thêm:
1. Thêm các field mới vào `apps/frontend/src/i18n/locales/vi/common.json`
2. Thêm song song vào `apps/frontend/src/i18n/locales/en/common.json`
3. Import trong component và dùng: `t('section.key')`

## Component sử dụng i18n:
- ProfileManagement.tsx
- Header.tsx
- LoginPage.tsx
- ContactPage.tsx
- v.v...

## Kiểm tra xem field nào bị thiếu trong code:
Tìm các string hardcoded chưa được i18n hóa
