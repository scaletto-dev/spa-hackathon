# Contact Form API Documentation

API endpoints for handling contact form submissions from customers.

## Base URL
```
/api/v1/contact
```

## Endpoints

### 1. Submit Contact Form

Submit a customer inquiry or feedback through the contact form.

**Endpoint:** `POST /api/v1/contact`

**Rate Limiting:** 3 submissions per hour per IP address

**Authentication:** Not required (public endpoint)

**Request Body:**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| name | string | Yes | Customer's full name | Max 100 characters |
| email | string | Yes | Customer's email address | Valid email format, max 255 characters |
| phone | string | No | Customer's phone number | Max 20 characters |
| messageType | string | Yes | Type of inquiry | Must be one of: `general_inquiry`, `service_question`, `booking_assistance`, `feedback`, `other` |
| message | string | Yes | Message content | Max 2000 characters |

**Request Example:**

```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyen.van.a@example.com",
  "phone": "+84901234567",
  "messageType": "service_question",
  "message": "Tôi muốn biết thêm thông tin về dịch vụ chăm sóc da mặt. Bạn có thể tư vấn giúp tôi không?"
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Thank you for contacting us. We'll respond within 24 hours.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Nguyễn Văn A",
    "email": "nguyen.van.a@example.com",
    "phone": "+84901234567",
    "messageType": "SERVICE_QUESTION",
    "message": "Tôi muốn biết thêm thông tin về dịch vụ chăm sóc da mặt. Bạn có thể tư vấn giúp tôi không?",
    "status": "PENDING",
    "createdAt": "2025-10-29T06:15:30.000Z"
  }
}
```

**Error Responses:**

#### 400 Bad Request - Missing Required Fields
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Missing required fields: name, email, messageType, and message are required",
  "statusCode": 400
}
```

#### 400 Bad Request - Invalid Email Format
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid email format",
  "statusCode": 400
}
```

#### 400 Bad Request - Invalid Message Type
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid messageType. Must be one of: general_inquiry, service_question, booking_assistance, feedback, other",
  "statusCode": 400
}
```

#### 400 Bad Request - Field Length Exceeded
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Name must not exceed 100 characters",
  "statusCode": 400
}
```

#### 429 Too Many Requests - Rate Limit Exceeded
```json
{
  "success": false,
  "error": "TooManyRequestsError",
  "message": "Too many contact form submissions. Please try again in an hour.",
  "statusCode": 429,
  "timestamp": "2025-10-29T06:15:30.000Z"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "InternalServerError",
  "message": "An error occurred while processing your request",
  "statusCode": 500
}
```

## Data Models

### ContactSubmission

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique submission identifier |
| name | string | Customer's name (sanitized) |
| email | string | Customer's email (lowercase, trimmed) |
| phone | string \| null | Customer's phone number (sanitized) |
| messageType | MessageType | Type of inquiry (enum) |
| message | string | Message content (sanitized) |
| status | ContactStatus | Submission status (default: PENDING) |
| createdAt | DateTime | Submission timestamp |

### MessageType Enum

- `GENERAL_INQUIRY` - General questions about the clinic
- `SERVICE_QUESTION` - Questions about specific services
- `BOOKING_ASSISTANCE` - Help with booking appointments
- `FEEDBACK` - Customer feedback or suggestions
- `OTHER` - Other types of inquiries

### ContactStatus Enum

- `PENDING` - Submission received, awaiting admin review
- `IN_PROGRESS` - Admin is reviewing/responding
- `RESOLVED` - Inquiry has been resolved

## Security Features

### Input Sanitization

All text inputs are sanitized to prevent XSS attacks:
- HTML tags are stripped from all fields
- Special characters are escaped (`<`, `>`, `&`, `"`, `'`, `/`)
- Leading and trailing whitespace is trimmed

### Rate Limiting

- **Limit:** 3 submissions per hour per IP address
- **Purpose:** Prevent spam and abuse
- **Headers:** Response includes `RateLimit-*` headers showing limit status

### Validation

- Email format validated using regex
- Maximum field lengths enforced
- Required fields checked
- Message type validated against allowed values

## cURL Examples

### Submit Contact Form

```bash
curl -X POST http://localhost:3000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyen.van.a@example.com",
    "phone": "+84901234567",
    "messageType": "service_question",
    "message": "Tôi muốn biết thêm thông tin về dịch vụ chăm sóc da mặt."
  }'
```

### Submit Without Phone (Optional Field)

```bash
curl -X POST http://localhost:3000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trần Thị B",
    "email": "tran.thi.b@example.com",
    "messageType": "general_inquiry",
    "message": "Địa chỉ chi nhánh gần tôi nhất ở đâu?"
  }'
```

### Test Rate Limiting

```bash
# Submit 4 requests in quick succession to trigger rate limit
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/v1/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "messageType": "other",
      "message": "Test message '$i'"
    }'
  echo ""
done
```

## Admin Usage

Contact form submissions are stored in the database with status `PENDING` for admin review. Admins can:

1. View all submissions through the admin panel (future feature)
2. Update submission status (`IN_PROGRESS`, `RESOLVED`)
3. Add internal notes via `adminNotes` field (future feature)
4. Respond to customers via email (future feature)

## Future Enhancements

- Email notification to admin when form is submitted
- Auto-responder email to customer confirming receipt
- Admin dashboard for managing submissions
- Search and filter submissions by status, type, date
- Bulk actions for marking submissions as resolved
- Integration with CRM or helpdesk system
