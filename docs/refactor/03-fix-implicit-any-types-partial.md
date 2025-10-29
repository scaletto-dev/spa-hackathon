# Phase 3: Fix Implicit Any Types (Partial Progress)

## Ngày thực hiện
29 October 2025

## Mục tiêu
Fix các lỗi TypeScript implicit `any` types (TS7031, TS7006) bằng cách thêm proper type annotations.

## Chiến lược

### 1. Tạo Shared Types
Thay vì inline types ở mỗi component, tạo shared type definitions để:
- ✅ Consistency across components
- ✅ Easier maintenance
- ✅ Better IntelliSense
- ✅ Type safety

### 2. Priority Order
1. Admin components (Sidebar, Dashboard, Payments)
2. Booking flow components (high coupling)
3. Payment components
4. Other client components
5. UI components

## Work Completed

### A. Created Shared Types

**File: `src/client/components/booking/types.ts`**

```typescript
// Booking flow types

interface Branch {
  id: number;
  name: string;
  image: string;
  address: string;
  phone: string;
  hours: string;
}

interface Service {
  id: number;
  title: string;
  category: string;
  price: string; // Format: "$150"
  duration: string;
  image: string;
  description?: string;
}

export interface BookingData {
  service?: Service;
  branch?: Branch;
  therapist?: string;
  date?: string;
  time?: string;
  duration?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  paymentMethod?: string;
  promoCode?: string;
}

export interface BookingStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface BookingConfirmationProps {
  bookingData: BookingData;
  onPrev: () => void;
}
```

**Lý do**:
- Interface rõ ràng cho booking flow
- Reusable across all booking components
- Type-safe updateBookingData với Partial<T>

### B. Fixed Admin Components

#### 1. Sidebar.tsx
**Lỗi**: `isActive` parameter trong NavLink callbacks không có type

**Fix**:
```typescript
// Before
className={({ isActive }) => ...}
{({ isActive }) => ...}

// After  
className={({ isActive }: { isActive: boolean }) => ...}
{({ isActive }: { isActive: boolean }) => ...}
```

**Files**: 1
**Errors fixed**: 2

#### 2. Dashboard.tsx
**Lỗi**: Recharts PieChart label callback parameters không có type

**Fix**:
```typescript
// Before
label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

// After
label={({ name, percent }: { name: string; percent: number }) => 
  `${name} ${(percent * 100).toFixed(0)}%`}
```

**Also**: Renamed unused `entry` to `_entry` (eslint convention)

**Files**: 1
**Errors fixed**: 3

#### 3. Payments.tsx
**Lỗi**: Same as Dashboard - Recharts callbacks

**Fix**: Same pattern as Dashboard

**Files**: 1
**Errors fixed**: 3

### C. Fixed Booking Components

#### 1. BookingBranchSelect.tsx
**Changes**:
- ✅ Import `BookingStepProps`
- ✅ Type component props với `BookingStepProps`
- ✅ Type `handleSelectBranch` parameter: `typeof branches[number]`

**Files**: 1
**Errors fixed**: 5

#### 2. BookingConfirmation.tsx
**Changes**:
- ✅ Import `BookingConfirmationProps`
- ✅ Type component props

**Known issue**: `bookingData.date` là string nhưng gọi `.toLocaleDateString()` - cần fix sau

**Files**: 1
**Errors fixed**: 2

#### 3. BookingDateTimeSelect.tsx
**Changes**:
- ✅ Already had `BookingStepProps` import (from sed command)
- ✅ Typed `handleSelectDate`: `(day: number) => void`
- ✅ Typed `handleSelectTime`: `(time: string) => void`  
- ✅ Typed `handleUseAI`: `(value: boolean) => void`

**Files**: 1
**Errors fixed**: 4

#### 4. BookingPayment.tsx
**Changes**:
- ✅ Import `BookingStepProps`
- ✅ Type component props

**Known issues**: 
- Price format incompatibility (string "$150" vs number)
- PromoCode type (null vs string)

**Files**: 1
**Errors fixed**: 4

#### 5. BookingServiceSelect.tsx
**Changes**:
- ✅ Import `BookingStepProps`
- ✅ Type component props với `Omit<BookingStepProps, 'onPrev'>` (no onPrev)
- ✅ Type `handleSelectService`: `typeof services[number]`

**Files**: 1
**Errors fixed**: 4

## Results

### Errors Reduced
**Before Phase 3**: 149 errors  
**After Phase 3 (partial)**: 136 errors  
**Reduction**: 13 errors (8.7%)

### Files Changed
- 1 new file: `types.ts` (booking types)
- 8 modified files:
  - Sidebar.tsx
  - Dashboard.tsx
  - Payments.tsx
  - BookingBranchSelect.tsx
  - BookingConfirmation.tsx
  - BookingDateTimeSelect.tsx
  - BookingPayment.tsx
  - BookingServiceSelect.tsx

**Total**: 9 files (within ≤10 limit for this batch)

## Remaining Work

### Still Need Type Fixes (~55 errors):
1. **InlinePaymentMethod.tsx** (4 errors)
2. **QuickBooking.tsx** (5 errors)
3. **TherapistSelector.tsx** (2 errors)
4. **BranchMap.tsx** (multiple errors)
5. **Payment components** (~10 errors)
6. **Other pages** (~30 errors)

### Categories:
- Implicit any in destructured props
- Implicit any in event handlers
- Implicit any in callbacks

## Patterns Learned

### Pattern 1: NavLink Render Props
```typescript
<NavLink className={({ isActive }: { isActive: boolean }) => ...}>
  {({ isActive }: { isActive: boolean }) => ...}
</NavLink>
```

### Pattern 2: Recharts Callbacks
```typescript
label={({ name, percent }: { name: string; percent: number }) => ...}
```

### Pattern 3: typeof for Array Item Types
```typescript
const items = [{ id: 1, name: 'foo' }, ...]
type Item = typeof items[number] // { id: number; name: string }
```

### Pattern 4: Omit for Partial Props
```typescript
type PropsWithoutOnPrev = Omit<BookingStepProps, 'onPrev'>
```

### Pattern 5: Intentional Unused Vars
```typescript
.map((_unused, index) => ...) // Prefix _ để avoid ESLint warning
```

## Next Batch

Continue với remaining booking & payment components, sau đó pages và UI components.

## Notes

- Đang ưu tiên components có high coupling trước (booking flow)
- Một số known issues (date format, price format) sẽ fix sau
- Type definitions giúp catch bugs sớm hơn (e.g., price string vs number)
