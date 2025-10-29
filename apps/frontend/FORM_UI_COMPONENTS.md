# Form UI Components - Design System

## 📋 Tổng Quan

Thư viện form components được thiết kế theo chuẩn **Design System** với focus vào:

-   ✅ **UX/UI đẹp mắt**, nhất quán, chuyên nghiệp
-   ✅ **Accessibility (A11y)** compliant - WCAG AA
-   ✅ **Mobile-first** responsive design
-   ✅ **Keyboard navigation** đầy đủ
-   ✅ **Screen reader** friendly
-   ✅ **Realtime validation** với animation mượt mà

## 🎨 Design Tokens

### Kích Thước

-   **Input height**: `h-11` (mobile), `h-12` (desktop)
-   **Padding horizontal**: `px-3.5`
-   **Border radius**: `rounded-xl`
-   **Spacing**: `mb-5` (mobile), `md:mb-6` (desktop)

### Màu Sắc (Brand Colors)

```tsx
// Border
border-gray-300/80          // Default
border-gray-400             // Hover
border-pink-500             // Focus
ring-2 ring-pink-500/30     // Focus ring

// States
border-red-500 ring-red-200       // Error
border-emerald-500 ring-emerald-200  // Success
opacity-60 cursor-not-allowed    // Disabled

// Text
text-gray-900      // Value
text-gray-400      // Placeholder
text-gray-700      // Label
text-gray-500      // Help text
```

## 📦 Components

### 1. FormField (Wrapper)

Container component cho label, control, help text, và error messages.

```tsx
import { FormField } from '@/components/ui';

<FormField label='Họ và tên' name='fullName' error={errors.fullName} helpText='Nhập họ tên đầy đủ của bạn' required>
    {/* Your control here */}
</FormField>;
```

**Props:**

-   `label?`: string - Nhãn field
-   `name`: string - Tên field (required)
-   `error?`: string - Thông báo lỗi
-   `helpText?`: string - Văn bản hướng dẫn
-   `success?`: string - Thông báo thành công
-   `info?`: string - Thông tin thêm
-   `required?`: boolean - Hiển thị dấu \*
-   `children`: ReactNode - Control component

### 2. Input

Text input với tính năng format tự động (phone, number).

```tsx
import { Input } from '@/components/ui';
import { MailIcon, PhoneIcon } from 'lucide-react';

// Text Input
<Input
  name="email"
  type="email"
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  leftIcon={MailIcon}
/>

// Phone với auto-format
<Input
  name="phone"
  type="tel"
  placeholder="0912 345 678"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  leftIcon={PhoneIcon}
  mask="phone"
/>

// Number với format nghìn
<Input
  name="budget"
  type="text"
  placeholder="5,000,000"
  value={budget}
  onChange={(e) => setBudget(e.target.value)}
  mask="number"
/>
```

**Props:**

-   `name`: string
-   `type?`: string - input type
-   `placeholder?`: string
-   `value?`: string | number
-   `onChange?`: (e) => void
-   `error?`: string
-   `disabled?`: boolean
-   `leftIcon?`: LucideIcon
-   `rightIcon?`: LucideIcon
-   `onRightIconClick?`: () => void
-   `mask?`: 'phone' | 'number' - Auto-format khi blur
-   `data-testid?`: string

**Format Rules:**

-   **Phone**: `0912 345 678` hoặc `(+84) 912 345 678`
-   **Number**: `5,000,000` (nhóm nghìn theo locale VN)

### 3. Textarea

Auto-resize textarea với character counter.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
    name='notes'
    placeholder='Nhập ghi chú...'
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    showCounter
    maxLength={500}
    autoResize
/>;
```

**Props:**

-   `name`: string
-   `placeholder?`: string
-   `value?`: string
-   `onChange?`: (e) => void
-   `error?`: string
-   `disabled?`: boolean
-   `showCounter?`: boolean - Hiển thị X/Y
-   `autoResize?`: boolean - Tự động điều chỉnh chiều cao
-   `maxLength?`: number
-   `data-testid?`: string

**Features:**

-   Min height: `120px`
-   Max height: `40vh` (khi auto-resize)
-   Counter position: bottom-right

### 4. Select (Single)

Dropdown select với tìm kiếm, nhóm options, keyboard navigation.

```tsx
import { Select, SelectOption, SelectGroup } from '@/components/ui';

// Simple options
const options: SelectOption[] = [
    { value: 'facial', label: 'Chăm sóc da mặt' },
    { value: 'laser', label: 'Laser Hair Removal', disabled: true },
];

<Select
    name='service'
    value={service}
    onChange={setService}
    options={options}
    placeholder='Chọn dịch vụ...'
    searchable
    emptyText='Không tìm thấy dịch vụ'
/>;

// Grouped options
const groups: SelectGroup[] = [
    {
        label: 'Dịch vụ da mặt',
        options: [
            { value: 'facial-1', label: 'Chăm sóc cơ bản' },
            { value: 'facial-2', label: 'Chăm sóc nâng cao' },
        ],
    },
    {
        label: 'Công nghệ Laser',
        options: [{ value: 'laser-1', label: 'Laser Hair Removal' }],
    },
];

<Select name='service' value={service} onChange={setService} groups={groups} searchable />;
```

**Props:**

-   `name`: string
-   `value?`: string
-   `onChange`: (value: string) => void
-   `options?`: SelectOption[]
-   `groups?`: SelectGroup[]
-   `placeholder?`: string
-   `error?`: string
-   `disabled?`: boolean
-   `searchable?`: boolean
-   `loading?`: boolean
-   `emptyText?`: string
-   `data-testid?`: string

**Keyboard Navigation:**

-   `↓` / `↑`: Di chuyển trong danh sách
-   `Enter`: Chọn option
-   `Esc`: Đóng dropdown
-   `Tab`: Đóng và chuyển field

### 5. MultiSelect

Multiple selection với tags, search, clear all.

```tsx
import { MultiSelect, SelectOption } from '@/components/ui';

const options: SelectOption[] = [
    { value: 'oily', label: 'Da dầu' },
    { value: 'dry', label: 'Da khô' },
    { value: 'combo', label: 'Da hỗn hợp' },
];

<MultiSelect
    name='skinType'
    value={skinTypes}
    onChange={setSkinTypes}
    options={options}
    placeholder='Chọn loại da...'
    maxSelections={3}
    searchable
/>;
```

**Props:**

-   Tương tự `Select` nhưng:
-   `value?`: string[]
-   `onChange`: (value: string[]) => void
-   `maxSelections?`: number - Giới hạn số lựa chọn

**Features:**

-   Tag chips với nút X để xoá
-   Clear All button
-   Visual feedback khi đạt max selections
-   Checkbox trong dropdown

### 6. DatePicker

Calendar picker với quick picks, disable past dates.

```tsx
import { DatePicker } from '@/components/ui';

<DatePicker
    name='appointmentDate'
    value={date}
    onChange={setDate}
    placeholder='dd/mm/yyyy'
    disablePastDates
    quickPicks
    minDate={new Date()}
    maxDate={new Date(2025, 11, 31)}
/>;
```

**Props:**

-   `name`: string
-   `value?`: Date | null
-   `onChange`: (date: Date | null) => void
-   `placeholder?`: string
-   `error?`: string
-   `disabled?`: boolean
-   `minDate?`: Date
-   `maxDate?`: Date
-   `disablePastDates?`: boolean
-   `quickPicks?`: boolean
-   `data-testid?`: string

**Features:**

-   Quick picks: "Hôm nay", "Ngày mai", "Cuối tuần"
-   Month navigation với ← →
-   Highlight ngày hôm nay với border
-   Disable dates không hợp lệ

### 7. TimePicker

Time slot picker với interval tuỳ chỉnh.

```tsx
import { TimePicker } from '@/components/ui';

<TimePicker
    name='appointmentTime'
    value={time}
    onChange={setTime}
    placeholder='Chọn giờ...'
    startTime='09:00'
    endTime='20:00'
    interval={30}
    disabledSlots={['12:00', '12:30', '18:00']}
/>;
```

**Props:**

-   `name`: string
-   `value?`: string (format "HH:MM")
-   `onChange`: (time: string) => void
-   `placeholder?`: string
-   `error?`: string
-   `disabled?`: boolean
-   `startTime?`: string - Default "09:00"
-   `endTime?`: string - Default "20:00"
-   `interval?`: number - Minutes, default 30
-   `disabledSlots?`: string[] - Disabled times
-   `data-testid?`: string

**Features:**

-   Auto-scroll to selected time khi mở
-   Disabled slots hiển thị với "(Đã đầy)"
-   Line-through cho slots không available

### 8. Radio & Checkbox

Standard radio và checkbox với hit area lớn.

```tsx
import { Radio, Checkbox } from '@/components/ui';

// Radio Group
<div className="space-y-3">
  <Radio
    name="gender"
    value="male"
    label="Nam"
    checked={gender === 'male'}
    onChange={(e) => setGender(e.target.value)}
  />
  <Radio
    name="gender"
    value="female"
    label="Nữ"
    checked={gender === 'female'}
    onChange={(e) => setGender(e.target.value)}
  />
</div>

// Checkbox
<Checkbox
  name="subscribe"
  label="Nhận tin tức qua email"
  checked={subscribe}
  onChange={(e) => setSubscribe(e.target.checked)}
/>
```

**Props:**

-   `name`: string
-   `value?`: string (for radio)
-   `label`: string
-   `checked?`: boolean
-   `onChange?`: (e) => void
-   `error?`: string
-   `disabled?`: boolean
-   `data-testid?`: string

### 9. Toggle

Modern toggle switch cho boolean values.

```tsx
import { Toggle } from '@/components/ui';

<Toggle name='notifications' label='Nhận nhắc hẹn qua SMS' checked={notifications} onChange={setNotifications} />;
```

**Props:**

-   `name`: string
-   `checked`: boolean
-   `onChange`: (checked: boolean) => void
-   `label?`: string
-   `disabled?`: boolean
-   `data-testid?`: string

**Features:**

-   Smooth animation với Framer Motion
-   Gradient background khi ON
-   Width: 44px (w-11), Height: 24px (h-6)

## 🎯 Usage Examples

### Complete Form Example

```tsx
import { useState } from 'react';
import { FormField, Input, Select, DatePicker, TimePicker, Checkbox } from '@/components/ui';

function BookingForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        date: null,
        time: '',
        acceptTerms: false,
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation logic
        // API call
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <FormField label='Họ và tên' name='name' error={errors.name} required>
                <Input
                    name='name'
                    placeholder='Nhập họ tên'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                />
            </FormField>

            <FormField label='Chọn dịch vụ' name='service' error={errors.service} required>
                <Select
                    name='service'
                    value={formData.service}
                    onChange={(value) => setFormData({ ...formData, service: value })}
                    options={serviceOptions}
                    error={errors.service}
                />
            </FormField>

            <div className='grid md:grid-cols-2 gap-6'>
                <FormField label='Chọn ngày' name='date' required>
                    <DatePicker
                        name='date'
                        value={formData.date}
                        onChange={(date) => setFormData({ ...formData, date })}
                        disablePastDates
                    />
                </FormField>

                <FormField label='Chọn giờ' name='time' required>
                    <TimePicker
                        name='time'
                        value={formData.time}
                        onChange={(time) => setFormData({ ...formData, time })}
                    />
                </FormField>
            </div>

            <Checkbox
                name='acceptTerms'
                label='Tôi đồng ý với điều khoản sử dụng'
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            />

            <button
                type='submit'
                className='w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold'
            >
                Đặt lịch ngay
            </button>
        </form>
    );
}
```

## ♿ Accessibility (A11y)

### Labels & ARIA

-   Mọi control đều có `label` liên kết bằng `htmlFor`
-   Error messages có `aria-invalid` và `aria-describedby`
-   Select/MultiSelect có `role="combobox"`, `role="listbox"`
-   Các state được announce với `aria-live="polite"`

### Keyboard Support

| Component  | Keys            | Action          |
| ---------- | --------------- | --------------- |
| All Inputs | Tab / Shift+Tab | Navigate        |
| Select     | ↓↑              | Move in list    |
| Select     | Enter           | Select option   |
| Select     | Esc             | Close dropdown  |
| DatePicker | ← →             | Navigate months |
| Toggle     | Space           | Toggle on/off   |

### Focus Management

-   Focus ring rõ ràng: `focus:ring-2 focus:ring-pink-500/30`
-   Không giật layout (dùng ring thay box-shadow)
-   Focus visible cho keyboard users

### Contrast

-   Text: `text-gray-900` trên `bg-white` - ✅ WCAG AA
-   Placeholder: `text-gray-400` - ✅ WCAG AA
-   Error: `text-red-600` - ✅ WCAG AA

## 📱 Responsive Design

### Breakpoints

```tsx
// Mobile-first
h-11 px-3.5 mb-5          // < 768px

// Desktop
md:h-12 md:mb-6           // ≥ 768px
```

### Grid Layout

```tsx
// 2 columns trên desktop
<div className='grid md:grid-cols-2 gap-6'>
    <FormField>...</FormField>
    <FormField>...</FormField>
</div>
```

### Mobile Keyboard

-   `type="email"` → Email keyboard
-   `type="tel"` → Phone keypad
-   `type="number"` → Number keyboard
-   `inputMode="numeric"` → Numeric only

## 🧪 Testing

Mọi component đều có `data-testid`:

```tsx
// Test với @testing-library/react
import { render, screen, fireEvent } from '@testing-library/react';

test('input accepts text', () => {
    render(<Input name='test' data-testid='test-input' />);
    const input = screen.getByTestId('test-input');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
});

test('select opens dropdown on click', () => {
    render(<Select name='test' options={options} />);
    const select = screen.getByTestId('test');
    fireEvent.click(select);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
});
```

## 🚀 Demo & Showcase

Xem toàn bộ components hoạt động tại:

```
/form-showcase
```

Route này hiển thị:

-   ✅ Tất cả form controls
-   ✅ Validation examples
-   ✅ State management
-   ✅ Error handling
-   ✅ Success states
-   ✅ Disabled states
-   ✅ Grid layouts

## 📝 Microcopy Guidelines

### Labels

-   Rõ ràng, ngắn gọn: "Họ và tên", "Email", "Số điện thoại"
-   Không dùng placeholder làm label

### Placeholders

-   Ví dụ cụ thể: "Nguyễn Văn A", "example@email.com"
-   Format mong muốn: "0912 345 678", "dd/mm/yyyy"

### Help Text

-   Hướng dẫn ngắn: "Chúng tôi sẽ liên hệ để xác nhận"
-   Giải thích format: "Định dạng tự động khi nhập"

### Error Messages

-   Giọng điệu thân thiện: "Vui lòng nhập email hợp lệ"
-   Không viết hoa: "VUI LÒNG..." ❌
-   Cụ thể: "Email không hợp lệ" thay vì "Lỗi"

### Empty States

-   Có ý nghĩa: "Không tìm thấy dịch vụ"
-   Hướng dẫn: "Vui lòng chọn cơ sở trước"

## 🎉 Acceptance Criteria

-   ✅ Tất cả inputs có label + help/error text
-   ✅ Focus ring rõ ràng, nhất quán
-   ✅ Hover/focus/disabled/error states đầy đủ
-   ✅ Select có search, keyboard nav, empty state
-   ✅ Date/time picker chặn giá trị invalid
-   ✅ Validation realtime không giật layout
-   ✅ Mobile touch-friendly (min 44x44px)
-   ✅ Screen reader friendly
-   ✅ WCAG AA contrast
-   ✅ Không console errors
-   ✅ Không phá vỡ layout hiện có

## 📂 File Structure

```
src/components/ui/
├── FormField.tsx       # Wrapper component
├── Input.tsx           # Text input với mask
├── Textarea.tsx        # Auto-resize textarea
├── Select.tsx          # Single select dropdown
├── MultiSelect.tsx     # Multiple selection
├── DatePicker.tsx      # Calendar picker
├── TimePicker.tsx      # Time slot picker
├── RadioCheckbox.tsx   # Radio & Checkbox
├── Toggle.tsx          # Toggle switch
└── index.ts            # Exports
```

## 🔗 Dependencies

```json
{
    "framer-motion": "^11.x",
    "lucide-react": "^0.x",
    "react": "^18.x",
    "react-dom": "^18.x"
}
```

---

**Designed & Built by AI FE Dev** 🎨✨
