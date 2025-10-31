# Epic 7: Multilingual Support & API Polish (Backend Focus)

**Expanded Goal:** Implement **backend support** for multilingual content delivery and final API refinement. Enable language-specific content retrieval, implement language-aware email notifications in 4 languages (Vietnamese, Japanese, English, Chinese), optimize API performance, complete comprehensive testing, and finalize API documentation. This epic ensures the backend is production-ready with international capabilities.

**Phase 1 Focus:** Backend API ONLY - Multilingual content APIs, language-aware emails, API optimization, testing, documentation finalization.

**Note:** Frontend i18next integration and UI translations are deferred to Phase 2.

### Story 7.1: Set Up i18next and Translation Infrastructure

As a developer,
I want to configure i18next for internationalization,
so that the application can support multiple languages with proper translation management.

#### Acceptance Criteria
1. i18next and react-i18next libraries installed in frontend app
2. i18next configured with 4 language namespaces: vi (Vietnamese), ja (Japanese), en (English), zh (Chinese)
3. Translation files created in `packages/i18n/locales/` directory structure: `{language}/translation.json`
4. i18next backend plugin configured for loading translations
5. Language detection plugin configured with fallback order: localStorage → browser language → default (Vietnamese)
6. Default language set to Vietnamese (vi)
7. Translation files organized by feature: common, auth, booking, services, profile, admin
8. useTranslation hook available throughout React app
9. Translation keys use dot notation: `booking.selectService`, `common.submit`
10. Environment supports translation hot-reload during development

### Story 7.2: Translate Core UI Components and Navigation

As a developer,
I want to translate all UI components, navigation, and common elements,
so that users can navigate the application in their preferred language.

#### Acceptance Criteria
1. Header navigation translated: Home, Services, Branches, Blog, Contact, Login, Register, Dashboard
2. Footer content translated: About, Privacy Policy, Terms of Service, Contact Info
3. Common buttons translated: Submit, Cancel, Save, Delete, Edit, Back, Next, Confirm
4. Form labels and placeholders translated for all input fields
5. Error messages and validation text translated
6. Loading states and empty states translated
7. Date and time formats localized per language (e.g., DD/MM/YYYY vs MM/DD/YYYY)
8. Currency formatting applied (Vietnamese Dong symbol: ₫)
9. Number formatting localized (comma vs period as thousand separator)
10. All shadcn/ui component text overridden with translations

### Story 7.3: Implement Language Switcher Component

As a user,
I want to easily switch between languages,
so that I can use the application in my preferred language.

#### Acceptance Criteria
1. Language switcher component created with flag icons: 🇻🇳 🇯🇵 🇬🇧 🇨🇳
2. Switcher displays current language with dropdown menu for other options
3. Clicking language option changes application language immediately
4. Selected language stored in localStorage for persistence
5. Language preference applied across all pages
6. Page content re-renders with new language without page reload
7. URL query parameter `?lang=vi` can override language preference
8. Language switcher positioned in header navigation (desktop) and mobile menu
9. Switcher accessible via keyboard navigation (tab, enter)
10. Current language visually highlighted in dropdown

### Story 7.4: Translate Booking Flow

As a customer,
I want the entire booking process available in my language,
so that I can book appointments without language barriers.

#### Acceptance Criteria
1. Booking wizard step titles translated: Service Selection, Branch Selection, Date & Time, Guest Information
2. Progress indicators translated (e.g., "Step 2 of 4")
3. Service names, descriptions, and categories translated (from database)
4. Branch names, addresses, and operating hours labels translated
5. Calendar and date picker translated: month names, day names, Today, Yesterday, Tomorrow
6. Time slot labels translated (AM/PM or 24-hour format based on locale)
7. Guest information form translated: labels, placeholders, validation messages
8. Booking summary translated: Service, Branch, Date, Time, Total Price
9. Confirmation page translated: success message, booking details, next steps
10. All booking-related error messages translated

### Story 7.5: Translate Member Pages and Dashboard

As a member,
I want my dashboard and profile pages in my chosen language,
so that I can manage my account comfortably.

#### Acceptance Criteria
1. Dashboard welcome message translated: "Welcome back, {name}!"
2. Dashboard sections translated: Upcoming Appointments, Booking History, Special Offers
3. Booking history page translated: column headers, status labels, empty states
4. Profile page form fields translated: Full Name, Email, Phone, Save Changes
5. Login and registration pages fully translated including OTP instructions
6. Email OTP instructions translated: "Enter the code sent to {email}"
7. Authentication error messages translated: Invalid code, Expired code, etc.
8. Account-related notifications translated
9. Member-only features and benefits messaging translated
10. Logout confirmation dialog translated

### Story 7.6: Translate Blog and Review Content

As a visitor,
I want to read blog posts and reviews in my language,
so that I can understand the content clearly.

#### Acceptance Criteria
1. Blog listing page translated: category filters, search placeholder, pagination
2. Blog post metadata translated: Published on, By {author}, Reading time
3. Related posts section translated
4. Review submission form translated: rating labels, character counter, submit button
5. Review display translated: customer reviews, admin responses, date formatting
6. Star rating labels translated: "5 out of 5 stars"
7. Review empty state translated: "Be the first to review"
8. Blog and review content in database supports language field for multi-language content
9. Content displays in user's selected language if translation available, falls back to default
10. "No translation available" message shown gracefully if content not translated

### Story 7.7: Implement Multilingual Email Notifications

As a customer,
I want to receive emails in my preferred language,
so that I can understand booking confirmations and notifications.

#### Acceptance Criteria
1. Email templates created for each language (vi, ja, en, zh)
2. Booking confirmation email translated for all 4 languages
3. OTP verification email translated for all 4 languages
4. Contact form acknowledgment email translated
5. Email template includes: subject line, greeting, body content, signature
6. Language determined from user's profile preference or booking language selection
7. Email service accepts language parameter: `sendEmail(to, template, data, language)`
8. Fallback to English if user's language template not available
9. Test emails sent in all 4 languages verified for correct rendering
10. Email content includes clinic contact info translated appropriately

### Story 7.8: Create Translation Management Workflow

As an admin,
I want a system for managing content translations,
so that all content can be made available in multiple languages.

#### Acceptance Criteria
1. Database schema supports translations: Service translations (name, description per language)
2. Admin interface for managing service translations (4 language tabs per service)
3. Blog post editor supports multiple language versions (separate posts or translation fields)
4. Branch information translation fields (operating hours labels, descriptions)
5. Translation status indicators: Fully translated (all 4), Partially translated (1-3), Not translated
6. Translation completeness report showing missing translations by entity type
7. Copy from default language button to assist translation workflow
8. Character encoding properly handles Vietnamese diacritics, Japanese characters, Chinese characters
9. Translation memory or glossary for consistent terminology (optional, can be manual doc)
10. Export/import translations in JSON format for external translation services

### Story 7.9: Perform Final QA and Cross-Browser Testing

As a QA tester,
I want to verify all features work correctly across browsers and languages,
so that the application is production-ready.

#### Acceptance Criteria
1. Complete feature testing checklist executed in all 4 languages
2. All user flows tested: guest booking, member registration, login, booking history, profile update
3. Cross-browser testing completed: Chrome, Firefox, Safari, Edge (latest 2 versions each)
4. Mobile responsive testing on iOS and Android devices (physical or emulator)
5. Performance testing: Lighthouse scores >90 on mobile, page load <2s
6. Accessibility testing: WCAG AA compliance verified with automated tools
7. Translation accuracy spot-checked by native speakers for each language
8. Email deliverability tested for all notification types
9. Error scenarios tested: invalid inputs, network failures, timeout handling
10. Bug log created and all critical/high priority bugs resolved

### Story 7.10: Production Readiness and Deployment Checklist

As a project manager,
I want a comprehensive production readiness checklist,
so that the application can be confidently deployed to users.

#### Acceptance Criteria
1. Security audit completed: No critical vulnerabilities, HTTPS enforced, sensitive data encrypted
2. Environment variables properly configured for production (.env.example documented)
3. Database migrations tested and ready for production deployment
4. Seed data or data migration plan prepared for initial production data
5. Monitoring and error tracking configured: Sentry, analytics, uptime monitoring
6. Backup and disaster recovery plan documented and tested
7. Performance optimization completed: Images compressed, lazy loading, caching enabled
8. SEO optimization: Meta tags, sitemap.xml, robots.txt configured
9. Legal pages created: Privacy Policy, Terms of Service, Cookie Policy (placeholder content if needed)
10. Production deployment runbook created with rollback plan

---
