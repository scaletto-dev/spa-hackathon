# ��� In-Chat Booking Flow Implementation

## ✅ Tính năng đã hoàn thành

Triển khai **multi-step booking flow** trong chat widget với các bước:
1. User click vào khung giờ trống
2. Bot hỏi **tên**
3. Bot hỏi **số điện thoại**
4. Bot hỏi **email**
5. Bot hiển thị xác nhận thông tin + nút "Xác nhận đặt lịch"
6. Click nút → Redirect sang `/booking` với data pre-filled

---

## ��� Files đã thay đổi

### 1. **types.ts** - Add new types
```typescript
// Added BookingFormData interface
export interface BookingFormData {
    serviceName: string;
    serviceId?: string | undefined;
    date: string;
    time: string;
    branchName: string;
    branchId?: string | undefined;
    price: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
}

// Added new action type
export interface MessageAction {
    type: 'button' | 'booking' | 'link' | 'confirm_booking';
    ...
}
```

### 2. **BookingTab.tsx** - Main booking logic
**Changes:**
- ✅ Multi-step state machine: `slot_selection` → `ask_name` → `ask_phone` → `ask_email` → `confirmation`
- ✅ Form validation: Name (min 2 chars), Phone (8-15 digits), Email (regex)
- ✅ User input handling với `ChatInput` component
- ✅ Confirmation message với formatted data
- ✅ Navigate to `/booking` với URL params

**Key functions:**
- `handleBookSlot()` - Start flow when user clicks slot
- `handleNameInput()` - Validate & save name
- `handlePhoneInput()` - Validate & save phone
- `handleEmailInput()` - Validate & save email
- `handleConfirmBooking()` - Navigate với params

### 3. **ChatInput.tsx** - Add hideOptions prop
```typescript
interface ChatInputProps {
    hideOptions?: boolean;  // NEW: Hide clear button
}
```

### 4. **MessageList.tsx** - Style confirm button
```typescript
// Green gradient for confirm_booking action
className={
    action.type === 'confirm_booking'
        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
        : 'bg-white border-2 border-pink-200 text-pink-600'
}
```

### 5. **BookingPage.tsx** - Parse URL params
```typescript
// NEW: Parse params from chat widget
useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    
    if (source === 'chat-booking') {
        // Pre-fill: name, phone, email, date, time, service, branch
        setBookingData({ ...prev, name, phone, email, ... });
        
        // Skip to step 4 if all data available
        setCurrentStep(4);
        
        // Show toast
        toast.success('✅ Thông tin đã được điền sẵn từ chat!');
    }
}, [location.search]);
```

---

## ��� User Flow

### **Flow Diagram:**
```
1. User opens Chat Widget → BookingTab
   ↓
2. Sees available slots (mock data)
   ↓
3. Clicks slot "2:00 PM, Downtown Spa"
   ↓
4. Bot: "Vui lòng cho tôi biết TÊN của bạn:"
   User: "Nguyen Van A"
   ↓
5. Bot: "Cảm ơn Nguyen Van A! Bây giờ, vui lòng cho tôi biết SỐ ĐIỆN THOẠI:"
   User: "0912345678"
   ↓
6. Bot: "Tuyệt vời! Cuối cùng, vui lòng cho tôi biết EMAIL:"
   User: "example@email.com"
   ↓
7. Bot shows confirmation:
   "✅ Xác nhận thông tin đặt lịch:
    ��� Tên: Nguyen Van A
    ��� SĐT: 0912345678
    ��� Email: example@email.com
    ��� Dịch vụ: HydraFacial
    ��� Thời gian: Thursday, October 31, 2025 at 2:00 PM
    ��� Chi nhánh: Downtown Spa
    ��� Giá: $150"
   
   [✅ Xác nhận đặt lịch]  [✏️ Sửa thông tin]
   ↓
8. User clicks "Xác nhận đặt lịch"
   ↓
9. Bot: "✅ Đang chuyển đến trang đặt lịch..."
   ↓
10. Redirect to: /booking?service=hydrafacial-001&branch=branch-downtown&date=2025-10-31&time=14:00&name=Nguyen+Van+A&phone=0912345678&email=example@email.com&source=chat-booking
   ↓
11. BookingPage receives params → Pre-fill form → Skip to step 4
```

---

## ��� Features Implemented

### ✅ **Multi-Step Form**
- State machine tracking: `bookingStep`
- Step indicator trong header: "Bước 1/3: Nhập tên"
- Input validation cho từng bước

### ✅ **Smart Validation**
```typescript
// Name validation
if (name.trim().length < 2) {
    bot: "Tên quá ngắn. Vui lòng nhập lại..."
}

// Phone validation
const phoneRegex = /^[0-9+\s()-]{8,15}$/;
if (!phoneRegex.test(phone)) {
    bot: "Số điện thoại không hợp lệ..."
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    bot: "Email không hợp lệ..."
}
```

### ✅ **URL Parameters Mapping**
```typescript
const params = new URLSearchParams({
    service: formData.serviceId || formData.serviceName,
    branch: formData.branchId || formData.branchName,
    date: formData.date,                    // "2025-10-31"
    time: formData.time,                    // "14:00"
    name: formData.customerName,
    phone: formData.customerPhone,
    email: formData.customerEmail,
    source: 'chat-booking',
    ai_suggested: 'false',
});
```

### ✅ **Responsive Chat Input**
- Hide "Clear" button khi trong booking flow
- Custom placeholder cho từng step
- Enter để submit

### ✅ **Confirmation UI**
- Formatted message với emojis
- Green gradient button
- Edit option để quay lại step 1

---

## ��� Testing

### **Manual Test Steps:**
1. Start dev server: `yarn dev`
2. Mở chat widget → Click tab "Booking" (Calendar icon)
3. Click vào một slot bất kỳ
4. Nhập tên: "Test User"
5. Nhập SĐT: "0901234567"
6. Nhập email: "test@example.com"
7. Kiểm tra confirmation message
8. Click "✅ Xác nhận đặt lịch"
9. Verify redirect sang `/booking` với params đúng
10. Verify form đã pre-filled

### **Edge Cases:**
- ✅ Empty input → Validation error
- ✅ Invalid phone format → Ask to re-enter
- ✅ Invalid email format → Ask to re-enter
- ✅ Click "Sửa thông tin" → Restart from step 1

---

## ��� URL Params Specification

### **From Chat Widget:**
```
/booking?
  service=<serviceId>
  &branch=<branchId>
  &date=YYYY-MM-DD
  &time=HH:mm
  &name=<customerName>
  &phone=<customerPhone>
  &email=<customerEmail>
  &source=chat-booking
  &ai_suggested=false
```

### **Example:**
```
/booking?service=hydrafacial-001&branch=branch-downtown&date=2025-10-31&time=14:00&name=Nguyen+Van+A&phone=0912345678&email=test@example.com&source=chat-booking&ai_suggested=false
```

---

## ��� Next Steps (Optional Enhancements)

### **Phase 2 Features:**
1. **Real API Integration**
   - Replace mock slots với real availability API
   - Map serviceId/branchId correctly

2. **AI Time Selection**
   - Add "Let AI choose best time" checkbox
   - Call `POST /api/v1/ai/suggest-booking-time`

3. **Persistent Chat History**
   - Save booking flow state trong localStorage
   - Resume nếu user refresh

4. **Rich Media**
   - Show service image trong confirmation
   - Map thumbnail
   - Price breakdown

5. **Multi-language**
   - Support English flow
   - Detect user language preference

---

## ��� Tips for Developers

### **Adding New Steps:**
```typescript
type BookingStep = 
    | 'slot_selection' 
    | 'ask_name' 
    | 'ask_phone' 
    | 'ask_email'
    | 'ask_notes'      // NEW STEP
    | 'confirmation';

// In handleEmailInput():
setBookingStep('ask_notes');  // Instead of 'confirmation'

// Add new handler:
const handleNotesInput = (notes: string) => {
    setBookingFormData(prev => ({ ...prev, notes }));
    setBookingStep('confirmation');
};
```

### **Customizing Validation:**
```typescript
// Custom phone format for different countries
const phoneRegex = {
    vi: /^(0[3|5|7|8|9])+([0-9]{8})$/,
    en: /^\+?[1-9]\d{1,14}$/
};
```

---

## ✅ Done!

Implementation hoàn thành! User giờ có thể:
1. ✅ Click slot trong chat
2. ✅ Nhập thông tin step-by-step
3. ✅ Xác nhận và redirect sang booking page
4. ✅ Form đã được pre-filled sẵn

**Ready for testing!** ���
