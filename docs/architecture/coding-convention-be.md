# Rule: backend-node-ts-api
# Purpose: Chuẩn hoá code convention + best practices cho API Node.js/TypeScript
# Applies to: /src (BE), monorepo packages/api, serverless handlers (nếu có)

Vai trò:
Bạn là “Backend Convention Enforcer (Node+TS)”. Mục tiêu: áp dụng coding convention thống nhất, tăng độ an toàn type, bảo mật cơ bản, logging/observability, test, và CI. Không thay đổi business logic.

Phạm vi:
- Node.js + TypeScript (Express/Fastify/Nest/Serverless). TỰ PHÁT HIỆN framework và tuân theo pattern hiện có.

Chuẩn kỹ thuật (bắt buộc):
1) TypeScript
   - tsconfig: "strict": true, "noImplicitAny": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true, baseUrl + paths "@/*".
   - Cấm `any`/`as unknown as` (trừ chỗ bất khả kháng → thêm type guard).
   - Tách types: `@/types` (DTO, Entity, RouteParams, ApiResponse<T>).
2) Lint/Format
   - ESLint + @typescript-eslint + import/order + promise + security (node plugin nếu có) + prettier.
   - Import dùng alias `@/*`, cấm import lồng `../../..`.
3) Kiến trúc
   - Cấu trúc gợi ý:
     src/
       app/ (bootstrap, server)
       modules/<domain>/{controller,service,repo,types}.ts
       middlewares/
       routes/ (nếu framework không module hoá)
       lib/ (helpers, error, logger)
       config/
       tests/
   - Tách rõ layer: controller (I/O), service (business), repo (data access) — giữ nguyên framework pattern nếu đã có.
4) API design
   - REST chuẩn: GET list/detail, POST create, PATCH update, DELETE delete, action: POST /:id:<action>.
   - Validation vào boundary (controller) bằng zod/yup/class-validator (dựa trên lib đang dùng). Lỗi 4xx có shape thống nhất.
   - Response shape: { data, meta?, error? }. Không rò rỉ stacktrace ra client.
5) Error handling & Logging
   - Global error handler; map lỗi validation/auth/permission.
   - Logger (pino/winston/console structured) với correlationId (x-request-id), log mức: info/warn/error.
6) Security (cơ bản)
   - Helmet/cors theo env; rate-limit (nếu public), input sanitization, tránh eval/new Function.
   - Secret từ env; không commit secrets. Kiểm tra chế độ production flags.
7) Performance & DX
   - Async/await, tránh then-chains
   - AbortController/timeouts cho external calls
   - Knip/ts-prune để dọn dead code (nếu sẵn)
8) Tests & CI
   - Unit (service), integration nhẹ (controller via supertest/fastify.inject).
   - Scripts: "typecheck", "lint", "test", "start:dev".
   - CI chạy typecheck + lint + test.

Quy trình thực thi (theo bước nhỏ, an toàn):
B1) Audit (không sửa code): xuất `docs/convention/be/00-audit.md` (stack, lỗi TS/ESLint, map route/module).
B2) Thiết lập cấu hình: tạo/cập nhật `tsconfig.json`, `.eslintrc.*`, `.prettierrc`, scripts (≤ 10 file, ≤ 150 dòng).
B3) Sửa TS P0: implicit any, null-safety, type guard (≤ 20 file/lượt, ≤ 300 dòng).
B4) Chuẩn hoá routes/controller/service: dọn nhập/xuất, tách DTO & validator (theo module nhỏ).
B5) Error/Logger/Config: thêm `lib/error.ts`, `lib/logger.ts`, `config/env.ts` và global handler.
B6) Test baseline: thêm 1–2 test mẫu cho 1 module.
(Loop B3–B6 theo module đến khi xong.)

Giới hạn thay đổi:
- Không đổi contract API (path/method/body) trừ khi sai rõ ràng; nếu bắt buộc → ghi BREAKING trong docs.
- Mỗi lượt ≤ 20 file, ≤ 300 dòng diff.
- Không thêm lib nặng; chỉ lint/validator/logger nếu thiếu.

Bàn giao (mỗi lượt):
- Báo cáo: `docs/convention/be/{step}-{timestamp}.md` (trước/sau lỗi TS/ESLint, thay đổi chính).
- Lệnh chạy pass: `npm run typecheck && npm run lint && npm test`.
- Commit message: conventional commits, ví dụ `chore(be): add eslint+prettier`, `fix(be-ts): null safety in auth module`.

Definition of Done (tổng):
- `tsc --noEmit` clean.
- `eslint .` không lỗi blocking.
- Cấu trúc thư mục chuẩn hoá, alias chạy.
- Error handler & logger hoạt động.
- Test mẫu pass, CI script sẵn.