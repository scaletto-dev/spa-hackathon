# Phase 4: Fix Type Mismatches - Partial Progress

## Ngày thực hiện
29 October 2025

## Mục tiêu
Address structural type incompatibilities, especially date format and therapist type issues.

## Work Completed

### 1. Core Type Definitions Updated

#### booking/types.ts
**Added/Updated interfaces**:
```typescript
export interface Branch {
    id: number;
    name: string;
    image: string;
    address: string;
    phone: string;
    hours: string;
}

export interface Service {
    id: number;
    title: string;
    category: string;
    price: string;
    duration: string;
    image: string;
    description?: string;
}

export interface Therapist {
    id: number;
    name: string;
    specialty: string;
    rating: number | null;
    recommended: boolean;
}

export interface BookingData {
    service?: Service | null;
    branch?: Branch | null;
    therapist?: Therapist | string | null;  // Union type for flexibility
    date?: string | null;  // Changed from Date to string
    time?: string | null;
    duration?: string;
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    useAI?: boolean;  // Added missing property
    paymentMethod?: string | null;
    promoCode?: string | null;
}
```

**Key Changes**:
- ✅ Exported Branch, Service interfaces for reuse
- ✅ Created Therapist interface
- ✅ Changed date from Date to string for consistency
- ✅ Added null union types to match actual usage
- ✅ Added missing useAI property

### 2. Components Fixed

#### TherapistSelector.tsx
**Changes**:
- ✅ Import Therapist type from types
- ✅ Update props to accept `Therapist | string | null`
- ✅ Type therapists array as `Therapist[]`
- ✅ Add type guards for checking if therapist is object vs string
- ✅ Fixed comparison: `typeof selectedTherapist !== 'string' && selectedTherapist?.id === therapist.id`

**Files**: 1  
**Errors fixed**: 4

#### BookingPage.tsx
**Changes**:
- ✅ Import BookingData type
- ✅ Type bookingData state: `useState<BookingData>(...)`
- ✅ Update updateBookingData signature: `(data: Partial<BookingData>)`
- ✅ Fixes all prop passing errors to child components

**Files**: 1  
**Errors fixed**: 12

#### QuickBooking.tsx
**Changes**:
- ✅ Fix date handling: Use string format throughout
- ✅ Change `type='date'` input to use string value
- ✅ Update date display: `new Date(formData.date).toLocaleDateString()`
- ✅ Add type guard for therapist: `typeof formData.therapist === 'string'`
- ✅ Remove explicit type annotation from onSelect callback

**Files**: 1  
**Errors fixed**: 5

#### QuickBookingConfirmationModal.tsx
**Changes**:
- ✅ Add type guard for therapist display
- ✅ Convert string date to Date for formatting: `new Date(bookingData.date)`

**Files**: 1  
**Errors fixed**: 2

#### BookingConfirmation.tsx
**Changes**:
- ✅ Convert string date to Date: `new Date(bookingData.date).toLocaleDateString()`

**Files**: 1  
**Errors fixed**: 1

#### OrderSummary.tsx
**Changes**:
- ✅ Convert string date to Date for display

**Files**: 1  
**Errors fixed**: 1

#### BookingDateTimeSelect.tsx
**Changes**:
- ✅ Change selectedDate type to `string | null`
- ✅ Convert Date to string when setting: `date.toISOString().split('T')[0]`
- ✅ Convert string to Date for comparison: `new Date(selectedDate).getDate()`
- ✅ Use nullish coalescing for safety: `?? ''` and `?? timeSlots[0]`

**Files**: 1  
**Errors fixed**: 7

#### BookingPayment.tsx
**Changes**:
- ✅ Type appliedPromo state: `useState<string | null>(null)`
- ✅ Remove total property from updateBookingData (not in BookingData interface)

**Files**: 1  
**Errors fixed**: 2

### 3. BranchMap.tsx
**Changes**:
- ✅ Already fixed in Phase 3 Batch 3
- ✅ Uses exported Branch interface

## Results

### Error Count
- **Before Phase 4**: 94 errors
- **After Phase 4 (partial)**: 59 errors
- **Errors Fixed**: 35 errors (37% reduction)

### Type Mismatch Categories Fixed
1. ✅ **Date Format Issues** (14 errors): String vs Date type resolved
2. ✅ **Therapist Type Issues** (5 errors): Union type with type guards
3. ✅ **BookingData Structure** (12 errors): Added missing properties, null unions
4. ✅ **Payment Props** (2 errors): Proper typing for promo state
5. ✅ **Component Props** (2 errors): Updated signatures

### Total Progress from Baseline
- **Baseline (Phase 1)**: 224 errors
- **Current**: 59 errors
- **Total Fixed**: 165 errors (74% reduction)

## Remaining Issues (59 errors)

### By Category:
1. **exactOptionalPropertyTypes** (~20 errors): FormFieldProps needs `error: string | undefined`
2. **Possibly Undefined** (~20 errors): Optional property access needs null checks
3. **Admin Components** (~10 errors): Modal props, Customer interface issues
4. **Mock Data Store** (~9 errors): Type definitions need exactOptionalPropertyTypes fixes

## Key Patterns Applied

### 1. Date Handling
```typescript
// Store as string
const [date, setDate] = useState<string | null>(null);

// Convert Date to string when setting
const dateString = date.toISOString().split('T')[0] ?? '';

// Convert string to Date when displaying
{date && new Date(date).toLocaleDateString()}

// Convert string to Date for comparison
new Date(selectedDate).getDate()
```

### 2. Union Types with Type Guards
```typescript
// Define union type
therapist?: Therapist | string | null;

// Use type guard for display
{typeof therapist === 'string' ? therapist : therapist.name}

// Use type guard for comparison
typeof selectedTherapist !== 'string' && selectedTherapist?.id === therapist.id
```

### 3. Null vs Undefined
```typescript
// Use null for optional values that can be explicitly unset
service?: Service | null;

// Use undefined for truly optional properties
duration?: string;

// Allow both with union
date?: string | null;
```

### 4. Exported Types for Reuse
```typescript
// Export from types.ts
export interface Branch { ... }
export interface Service { ... }
export interface Therapist { ... }

// Import in components
import { Branch, Service, Therapist } from './types';
```

## Files Modified

### Type Definitions
- `src/client/components/booking/types.ts`

### Booking Components
- `src/client/components/booking/TherapistSelector.tsx`
- `src/client/components/booking/QuickBooking.tsx`
- `src/client/components/booking/QuickBookingConfirmationModal.tsx`
- `src/client/components/booking/BookingConfirmation.tsx`
- `src/client/components/booking/BookingDateTimeSelect.tsx`
- `src/client/components/booking/BookingPayment.tsx`

### Payment Components
- `src/client/components/payment/OrderSummary.tsx`

### Pages
- `src/client/pages/BookingPage.tsx`

**Total Files Modified**: 9

## Testing
```bash
# Check error count
npm run typecheck 2>&1 | grep "error TS" | wc -l
# Result: 59 (down from 94)

# Check specific booking errors
npm run typecheck 2>&1 | grep "booking" | head -20
# Result: Remaining errors are exactOptionalPropertyTypes violations
```

## Next Steps

### Phase 5: Fix exactOptionalPropertyTypes Violations
Focus on FormFieldProps and UI component interfaces that need `| undefined` added to optional properties.

### Phase 6: Fix Possibly Undefined Errors
Add null checks and optional chaining for properties that may be undefined.

### Phase 7: Fix Admin Components
Address remaining admin modal and customer interface issues.

## Notes

- Date format standardized to ISO string format (YYYY-MM-DD)
- Therapist can be either object or string for backward compatibility
- All booking flow components now use consistent BookingData interface
- Type guards used extensively for union types
- Null coalescing operator (??) used for safe defaults
