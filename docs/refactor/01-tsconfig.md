# TypeScript Configuration - Strict Mode Setup

## Ngày thực hiện
29 October 2025

## Mục tiêu
Thiết lập cấu hình TypeScript nghiêm ngặt cho frontend để phát hiện lỗi tiềm ẩn sớm hơn và cải thiện code quality.

## Các TypeScript Options đã bật

### 1. `strict: true`
**Đã có sẵn** - Bật tất cả các strict type-checking options.

**Lý do**: Đây là foundation cho type safety, bao gồm:
- `noImplicitAny`
- `strictNullChecks` 
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

### 2. `noImplicitAny: true`
**Mới thêm** - Bắt buộc khai báo type rõ ràng, không cho phép type `any` ngầm định.

**Lý do**: Ngăn chặn việc TypeScript tự động gán type `any` khi không xác định được type, buộc developer phải explicit về types.

**Impact**: 
- ✅ Phát hiện các tham số function không có type
- ✅ Phát hiện các biến không được khai báo type
- ⚠️ Yêu cầu type cho callbacks và event handlers

### 3. `noUncheckedIndexedAccess: true`
**Mới thêm** - Thêm `undefined` vào type khi truy cập array/object bằng index.

**Lý do**: Bảo vệ khỏi runtime errors khi truy cập phần tử không tồn tại:
```typescript
const arr = [1, 2, 3];
const value = arr[10]; // Type: number | undefined (thay vì chỉ number)
```

**Impact**:
- ✅ Buộc check `undefined` trước khi sử dụng
- ✅ Phát hiện bugs tiềm ẩn với array/object access
- ⚠️ Cần thêm null checks trong code

### 4. `exactOptionalPropertyTypes: true`
**Mới thêm** - Phân biệt giữa property không có (`undefined`) và property có value `undefined`.

**Lý do**: Tăng độ chính xác của optional properties:
```typescript
interface User {
  name: string;
  age?: number; // Có thể undefined hoặc không tồn tại
}

// Trước: { age: undefined } ✅
// Sau: { age: undefined } ❌ - phải bỏ property hoặc gán value
```

**Impact**:
- ✅ Type safety chính xác hơn cho optional fields
- ✅ Phát hiện lỗi khi pass `undefined` explicitly
- ⚠️ Cần review tất cả optional properties trong interfaces

### 5. `baseUrl` và `paths`
**Đã có sẵn** - Cấu hình path aliases cho imports.

**Cấu hình hiện tại**:
```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"],
    "@admin/*": ["./src/admin/*"],
    "@client/*": ["./src/client/*"],
    "@shared/*": ["./src/shared/*"]
  }
}
```

**Lý do**: 
- ✅ Clean imports, tránh relative paths dài (`../../../`)
- ✅ Dễ refactor và di chuyển files
- ✅ Cải thiện readability

## Script đã thêm

### `typecheck`
**Command**: `tsc --noEmit`

**Mục đích**: Chạy type checking mà không emit JavaScript files.

**Cách sử dụng**:
```bash
npm run typecheck
# hoặc
pnpm typecheck
```

## Kết quả ban đầu

### Số lượng lỗi TypeScript hiện tại: **224 lỗi**

### Phân loại lỗi chính:

1. **Unused imports (TS6133)**: ~60 lỗi
   - Chủ yếu là `React` imports không cần thiết với React 17+ JSX transform
   - Các icon imports không được sử dụng

2. **Implicit `any` types (TS7031, TS7006)**: ~80 lỗi
   - Callback parameters không có type
   - Destructured props không có type
   - Event handlers không có type

3. **Possibly `undefined` (TS18048, TS2532)**: ~30 lỗi
   - Truy cập properties của object có thể undefined
   - Array element access cần check undefined

4. **exactOptionalPropertyTypes violations (TS2375)**: ~25 lỗi
   - FormField components với `error?: string` nhận `string | undefined`
   - Cần update interface definitions

5. **Type mismatches (TS2322, TS2345)**: ~20 lỗi
   - mockDataStore với optional properties không đúng
   - State setter với incompatible types

6. **Other**: ~9 lỗi
   - References config issue (đã fix)
   - Các lỗi type-specific khác

## Files bị ảnh hưởng nhiều nhất

1. **UI Components** (`src/components/ui/*`): 15 lỗi
2. **Booking Components** (`src/client/components/booking/*`): 45 lỗi
3. **Admin Pages** (`src/admin/pages/*`): 30 lỗi
4. **Client Pages** (`src/client/pages/*`): 35 lỗi
5. **Mock Data Store** (`src/store/mockDataStore.ts`): 18 lỗi

## Files đã thay đổi

1. ✅ `apps/frontend/tsconfig.json` - Thêm strict options
2. ✅ `apps/frontend/package.json` - Thêm typecheck script
3. ✅ `docs/refactor/01-tsconfig.md` - File này

**Tổng**: 3 files (trong giới hạn ≤10 files)

## Next Steps

Các lỗi này sẽ được fix dần trong các phase tiếp theo:
1. **Phase 2**: Fix unused imports (dễ, automated)
2. **Phase 3**: Add types cho function parameters và props
3. **Phase 4**: Handle undefined checks
4. **Phase 5**: Fix exactOptionalPropertyTypes issues
5. **Phase 6**: Clean up mockDataStore và remaining issues

## Tiêu chí hoàn thành ✅

- [x] `npm run typecheck` chạy được (có lỗi nhưng chạy thành công)
- [x] Các strict options đã được bật
- [x] Path aliases đã được cấu hình
- [x] Documentation đầy đủ
- [x] Ghi nhận số lượng lỗi baseline: **224 lỗi**

## Notes

- TypeScript version: 5.5.4
- Không có thay đổi nào về logic hoặc UI
- Chỉ thay đổi configuration files
- Baseline errors sẽ là reference point cho các refactor tiếp theo
