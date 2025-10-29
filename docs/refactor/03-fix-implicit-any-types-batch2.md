# Phase 3 - Batch 2: Fix Remaining Implicit Any Types

## Ngày thực hiện
29 October 2025

## Mục tiêu
Tiếp tục fix các lỗi implicit any types trong booking flow components còn lại.

## Work Completed

### 1. InlinePaymentMethod.tsx
**Created interface**:
```typescript
interface InlinePaymentMethodProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  promoCode: string;
  onPromoChange: (code: string) => void;
}
```

**Changes**:
- ✅ Type all component props
- ✅ Type appliedPromo state: `useState<string | null>(null)`

**Files**: 1  
**Errors fixed**: 4

### 2. QuickBooking.tsx
**Created interface**:
```typescript
interface QuickBookingProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  onSwitchToFull: () => void;
}
```

**Changes**:
- ✅ Import `BookingData` from types
- ✅ Type component props  
- ✅ Type `handleChange`: `(field: string, value: any) => void`
- ✅ Type inline callbacks: `(therapist: string) => ...`, `(method: string) => ...`, `(code: string) => ...`

**Known Issues**:
- Using `any` for value parameter (complex form state)
- Date format issues (string vs Date object)
- Therapist type mismatch (string vs object)

**Files**: 1  
**Errors fixed**: 5

### 3. QuickBookingConfirmationModal.tsx
**Created interface**:
```typescript
interface QuickBookingConfirmationModalProps {
  bookingData: BookingData;
  onClose: () => void;
}
```

**Changes**:
- ✅ Import `BookingData` from types
- ✅ Type component props
- ✅ Type event handler: `onClick={(e: React.MouseEvent) => e.stopPropagation()}`

**Known Issues**:
- Date format (string vs Date)
- Therapist object structure

**Files**: 1  
**Errors fixed**: 2

### 4. TherapistSelector.tsx  
**Created interface**:
```typescript
interface TherapistSelectorProps {
  selectedTherapist: string | null;
  onSelect: (therapist: string) => void;
}
```

**Changes**:
- ✅ Remove unused React import
- ✅ Type component props

**Known Issues**:
- Type mismatch: therapist should be object, not string
- Needs proper Therapist interface

**Files**: 1  
**Errors fixed**: 2

## Results

### Errors Progress
**Before Batch 2**: 136 errors  
**After Batch 2**: 131 errors  
**Batch 2 Reduction**: 5 errors (3.7%)

**Total Progress (Phase 3)**:  
**Original**: 149 errors  
**After Batch 1**: 136 errors (-13)  
**After Batch 2**: 131 errors (-5)  
**Total Reduction**: 18 errors (12%)

**Overall Progress (All Phases)**:  
**Phase 1 Baseline**: 224 errors  
**Current**: 131 errors  
**Total Reduction**: 93 errors (41.5%) ���

### Files Changed (Batch 2)
- InlinePaymentMethod.tsx
- QuickBooking.tsx
- QuickBookingConfirmationModal.tsx
- TherapistSelector.tsx

**Total**: 4 files

## Known Issues to Fix

### High Priority (Type Mismatches)

1. **Date Format Inconsistency**
   - `bookingData.date` is `string` but code calls `.toLocaleDateString()`
   - Need to decide: Store as string or Date?
   - Affects: BookingConfirmation, QuickBooking, QuickBookingConfirmationModal

2. **Therapist Type**
   - Currently typed as `string` but used as object with `.name`, `.id` properties
   - Need Therapist interface
   - Affects: QuickBooking, TherapistSelector, QuickBookingConfirmationModal

3. **Price Format**
   - Service price is `string` ("$150") but used as number
   - Need consistent format

4. **PromoCode Null vs String**
   - `appliedPromo` can be null but assigned to string field

### Medium Priority

5. **Form Value Type**
   - `handleChange(field: string, value: any)` uses any
   - Could use union type or generic

6. **Branch Object**
   - Similar to therapist, verify all usages

## Remaining Implicit Any Errors

**Total: ~40 errors**

### By Category:
- **Payment components** (~10 errors): OrderSummary, PaymentMethodSelector, etc.
- **BranchMap** (~10 errors): Multiple callback parameters
- **Client pages** (~15 errors): BookingPage, FormShowcasePage, QuizPage, etc.
- **Other** (~5 errors): Misc handlers

### By File:
1. BranchMap.tsx (10 errors)
2. OrderSummary.tsx (5 errors)
3. PaymentMethodSelector.tsx (4 errors)
4. BookingPage.tsx (3 errors)
5. FormShowcasePage.tsx (2 errors)
6. QuizPage.tsx (5 errors)
7. Others (6 errors)

## Patterns Applied

### Pattern 1: Props Interface
```typescript
interface ComponentProps {
  field: Type;
  handler: (param: Type) => void;
}

export function Component({ field, handler }: ComponentProps) { ... }
```

### Pattern 2: Inline Callback Types
```typescript
// Instead of: onChange={value => ...}
onChange={(value: string) => ...}

// For events:
onClick={(e: React.MouseEvent) => ...}
```

### Pattern 3: Nullable State
```typescript
// Instead of: useState(null)
useState<Type | null>(null)
```

### Pattern 4: Any for Complex Forms (Temporary)
```typescript
// When form has many field types:
const handleChange = (field: string, value: any) => { ... }
// Better: Use union type or separate handlers
```

## Next Steps

### Immediate (Batch 3):
1. Fix remaining booking/payment components
2. Handle BranchMap component (complex)
3. Fix client pages

### After Implicit Any:
Move to other TypeScript error types:
- `possibly undefined` (TS18048, TS2532) - ~30 errors
- `exactOptionalPropertyTypes` violations (TS2375) - ~25 errors  
- Type mismatches (TS2322, TS2345) - ~20 errors

## Lessons Learned

1. **Start with shared types** - Saves time, ensures consistency
2. **Interfaces at file top** - Easy to find and modify
3. **`any` is OK temporarily** - For complex cases, better than blocking progress
4. **Document known issues** - Track for future fixes
5. **Check for string vs object** - Common source of bugs

## Notes

- Some `any` uses are intentional for complex forms
- Date/Therapist type issues need architectural decision
- Good progress overall: 41.5% error reduction
- Focus on clearing implicit any first, then tackle type mismatches
