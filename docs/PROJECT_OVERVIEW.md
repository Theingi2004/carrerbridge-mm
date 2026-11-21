careerbridge-mm/
└── docs/
├── HACKATHON_PROJECT.md
└── PROJECT_OVERVIEW.md
:::writing{variant="document" id="63182"}

# CareerBridge MM — Project Overview

## 1. Introduction

CareerBridge MM is a web-based IT job recruitment platform designed for the Myanmar job market.

The platform connects IT job seekers with recruiters through a centralized system where users can discover job opportunities, apply for positions, and manage recruitment activities.

It aims to make the IT recruitment process more organized, accessible, and efficient.

## 2. Project Objectives

The main objectives are:

- Provide a centralized platform for IT job opportunities in Myanmar.
- Help job seekers discover suitable positions.
- Allow recruiters to publish and manage job vacancies.
- Simplify application tracking.
- Provide personalized job alerts and notifications.
- Improve communication between job seekers and recruiters.

## 3. User Roles

### Job Seeker

A Job Seeker can:

- Browse and search for jobs.
- Filter jobs by category, location, employment type, and experience level.
- View job details.
- Apply for jobs.
- Save jobs for later.
- Manage their profile.
- Create and manage job alerts.
- Receive notifications.

### Recruiter

A Recruiter can:

- Create job postings.
- Edit and manage published jobs.
- View applicants.
- Manage application statuses.
- Receive notifications when candidates apply.

## 4. Main Application Modules

| Module             | Description                               |
| ------------------ | ----------------------------------------- |
| Authentication     | User login and role-based access          |
| Job Management     | Create, view, edit, and manage job posts  |
| Job Search         | Search and filter available jobs          |
| Applications       | Submit and manage job applications        |
| Saved Jobs         | Save interesting job opportunities        |
| Job Alerts         | Create personalized job matching criteria |
| Notifications      | Receive job and application updates       |
| Profile Management | Manage user profile information           |

## 5. Main User Workflows

### Job Seeker Workflow

1. Log in as a Job Seeker.
2. Browse available IT jobs.
3. Search or filter relevant positions.
4. Open a job detail page.
5. Apply for a suitable job.
6. Save interesting jobs.
7. Create job alerts.
8. Receive notifications about matching jobs.

### Recruiter Workflow

1. Log in as a Recruiter.
2. Create a job posting.
3. Publish the job.
4. Receive applications from Job Seekers.
5. View applicant information.
6. Update application statuses.
7. Receive notifications about new applications.

## 6. Job Alert Workflow

1. A Job Seeker creates a job alert.
2. The Job Seeker selects preferred job criteria.
3. The alert can be activated or deactivated.
4. A Recruiter publishes a new active job.
5. The system compares the job with active alerts.
6. Matching users receive notifications.

Matching criteria include:

- Category.
- Location.
- Employment type.
- Experience level.

Empty criteria are treated as unrestricted preferences.

## 7. Technology Architecture

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)
- Database triggers

### Application Data Handling

The application supports two data modes:

- **Demo Mode:** Uses localStorage for demonstration and testing.
- **Supabase Mode:** Uses Supabase for authentication and persistent database operations.

Local caching and offline synchronization support are also included in the project.

## 8. Project Structure

The project follows a feature-based folder structure.

```text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── job/
│   ├── application/
│   ├── profile/
│   ├── job-alert/
│   └── notification/
└── lib/

docs/
├── HACKATHON_PROJECT.md
└── PROJECT_OVERVIEW.md

README.md
```

Each feature contains its own related components, services, hooks, types, and data where applicable.

## 9. Current Development Status

The project has implemented core recruitment workflows, including job posting, job searching, applications, saved jobs, job alerts, and notifications.

Some areas still require improvement and further testing, especially advanced location matching, real-time communication, offline synchronization, and production readiness.

## 10. Future Enhancements

- Township-level location filtering.
- Email and push notifications.
- Real-time notification updates.
- Resume upload and management.
- Advanced recruiter analytics.
- AI-powered job recommendations.
- Improved offline synchronization.
- Additional security and performance testing.

## 11. Project Vision

CareerBridge MM aims to become a useful platform for connecting Myanmar's IT talent with employment opportunities.

By bringing job discovery and recruitment management together, the project seeks to create a better experience for both job seekers and recruiters.
:::
