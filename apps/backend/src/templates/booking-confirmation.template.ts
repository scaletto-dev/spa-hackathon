/**
 * Booking Confirmation Email Template
 * Sends booking confirmation to guest after successful booking
 */
export function createBookingConfirmationTemplate(
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  referenceNumber: string,
  appointmentDate: string,
  appointmentTime: string,
  branchName: string,
  branchAddress: string,
  branchPhone: string,
  serviceNames: string[],
  totalPrice: number,
  notes?: string
): string {
  const formattedDate = new Date(appointmentDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalPrice);

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #ec4899; border-radius: 4px; }
        .section-title { font-weight: bold; color: #ec4899; margin-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .services { margin: 10px 0; }
        .service-item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
        .highlight { color: #ec4899; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Xác Nhận Đặt Lịch Thành Công</h1>
        </div>

        <p>Xin chào <span class="highlight">${escapeHtml(guestName)}</span>,</p>
        <p>Cảm ơn bạn đã đặt lịch với chúng tôi! Dưới đây là thông tin chi tiết về lịch hẹn của bạn.</p>

        <div class="section">
            <div class="section-title">📋 Thông Tin Tham Chiếu</div>
            <div class="info-row">
                <span class="label">Mã Tham Chiếu:</span>
                <span class="value highlight">#${referenceNumber}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📅 Ngày Giờ Hẹn</div>
            <div class="info-row">
                <span class="label">Ngày:</span>
                <span class="value">${formattedDate}</span>
            </div>
            <div class="info-row">
                <span class="label">Giờ:</span>
                <span class="value">${appointmentTime}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💅 Dịch Vụ Đặt</div>
            <div class="services">
                ${serviceNames.map((name) => `<div class="service-item">• ${escapeHtml(name)}</div>`).join('')}
            </div>
        </div>

        <div class="section">
            <div class="section-title">💰 Giá Tiền</div>
            <div class="info-row">
                <span class="label">Tổng Cộng:</span>
                <span class="value highlight">${formattedPrice}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📍 Địa Điểm</div>
            <div class="info-row">
                <span class="label">Chi Nhánh:</span>
                <span class="value">${escapeHtml(branchName)}</span>
            </div>
            <div class="info-row">
                <span class="label">Địa Chỉ:</span>
                <span class="value">${escapeHtml(branchAddress)}</span>
            </div>
            <div class="info-row">
                <span class="label">Điện Thoại:</span>
                <span class="value">${escapeHtml(branchPhone)}</span>
            </div>
        </div>

        ${
          notes
            ? `
        <div class="section">
            <div class="section-title">📝 Ghi Chú</div>
            <div class="value">${escapeHtml(notes)}</div>
        </div>
        `
            : ''
        }

        <div class="section">
            <div class="section-title">👤 Thông Tin Liên Hệ</div>
            <div class="info-row">
                <span class="label">Tên:</span>
                <span class="value">${escapeHtml(guestName)}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${escapeHtml(guestEmail)}</span>
            </div>
            <div class="info-row">
                <span class="label">Điện Thoại:</span>
                <span class="value">${escapeHtml(guestPhone)}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>Lưu Ý Quan Trọng:</strong></p>
            <ul>
                <li>Vui lòng đến trước 5-10 phút để làm thủ tục</li>
                <li>Nếu muốn hủy hoặc thay đổi lịch, vui lòng liên hệ chi nhánh sớm nhất có thể</li>
                <li>Bảo mật email này với mã tham chiếu của bạn</li>
            </ul>
            <p>Nếu có bất kỳ câu hỏi, vui lòng liên hệ với chúng tôi.</p>
            <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Escape HTML to prevent XSS in email content
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
