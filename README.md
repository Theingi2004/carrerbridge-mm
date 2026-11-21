:::writing{variant="document" id="85201"}
# CareerBridge MM

**Connecting Myanmar's IT Talent with Career Opportunities**

CareerBridge MM is a web-based IT job recruitment platform designed to connect job seekers with recruiters in Myanmar.

The platform helps job seekers discover IT opportunities, apply for jobs, save interesting positions, and receive personalized job alerts. Recruiters can publish job vacancies and manage applicants through a centralized system.

---

## Problem Statement

Finding IT-related job opportunities in Myanmar can be challenging because job information is often scattered across social media platforms and different websites.

Job seekers may miss relevant opportunities, while recruiters may struggle to reach suitable candidates and manage applications efficiently.

## Proposed Solution

CareerBridge MM provides a centralized platform where job seekers and recruiters can interact through an organized recruitment process.

---

## Features

### Job Seeker

- Browse and search IT job opportunities.
- Filter jobs by category, location, employment type, and experience level.
- View detailed job descriptions.
- Apply for jobs.
- Save and manage saved jobs.
- Manage personal profiles.
- Create and manage personalized job alerts.
- Receive notifications about matching jobs.
- Track application-related updates.

### Recruiter

- Create and publish job vacancies.
- Edit and manage job posts.
- View applicants.
- Manage application statuses.
- Receive notifications when candidates apply.

### Job Alerts and Notifications

- Create personalized job alerts.
- Match new active jobs with active alerts.
- Filter matching jobs by category, location, employment type, and experience level.
- Support standardized Myanmar region and state locations.
- Receive notifications about matching opportunities.
- Manage read and unread notifications.

### Additional Technical Features

- Demo Mode using localStorage.
- Supabase integration.
- Local caching and offline synchronization support.
- Role-based user experiences.
- Responsive user interface.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Supabase | Database and authentication |
| PostgreSQL | Relational database |
| Lucide React | Icons |

---

## Location Support

The platform uses standardized location options to reduce inconsistent location entries.

Examples:

- Yangon Region
- Mandalay Region
- Naypyidaw
- Shan State
- Mon State
- Ayeyarwady Region
- Remote

---

## Project Structure

```text
careerbridge-mm/
├── docs/
│   └── HACKATHON_PROJECT.md
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Supabase account (for Supabase Mode)

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd careerbridge-mm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

Use the actual environment variable names configured in your project.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Job Seeker | demo@careerbridge.mm | demo123 |
| Recruiter | recruiter@careerbridge.mm | recruiter123 |

These accounts are for local demonstration purposes.

---

## Future Improvements

- City and township-level location filtering.
- Email and push notifications.
- Real-time notification updates.
- Improved offline synchronization.
- Resume upload and management.
- Advanced recruiter analytics.
- AI-powered job recommendations.
- Additional security and performance improvements.

---

## Project Status

CareerBridge MM is an ongoing project. Core job discovery, recruitment, job alert, and notification workflows have been implemented. Further development and testing are planned.

---

## Documentation

For detailed information about the project's problem statement, proposed solution, architecture, development challenges, and future roadmap, see:

[Project Documentation](docs/PROJECT_OVERVIEW.md)

---

## License

To be determined.