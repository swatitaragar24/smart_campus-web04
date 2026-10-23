# Smart Campus Operations - WEB 04

One campus portal for booking rooms and equipment, reporting facility problems and checking availability.

## Live Link
https://smart-campus-WEB04.vercel.app

## Demo Login for Judge
Student: student@test.com (Select Student role)
Admin: admin@test.com (Select Admin role)

## Compulsory Features Done
1. Student and staff roles with role-based access - Login page with role select
2. Search availability and create or cancel bookings - Date filter + Book/Cancel button
3. Prevent conflicting bookings and show clear booking status - Checks localStorage before booking, status pending/approved/cancelled
4. Report facility issues with category, priority and status tracking - Form with category, priority dropdown
5. Admin dashboard for approvals and usage analytics - Approval buttons + Bar chart analytics
6. Audit history, input validation, notifications and responsive UI - Audit log, validation, toast, mobile responsive

## How to test (Judge Flow)
1. Login as Student -> Select date -> Book free slot
2. Try same slot again -> Blocked (Double booking prevented)
3. Login as Admin -> Approve booking -> See analytics bar increase
4. Student reports issue -> Admin changes status open to resolved

Tech: HTML, CSS, JavaScript, localStorage
