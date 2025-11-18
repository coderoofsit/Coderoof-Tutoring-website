# Tutor Dashboard

A comprehensive tutoring platform built with modern web technologies.

## Features

- **Student Dashboard**: Book tutoring sessions, track progress, and explore subjects
- **Admin Panel**: Manage teachers, approve requests, and oversee the platform
- **Real-time Updates**: Live notifications and status updates
- **Professional Design**: Modern, responsive interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <YOUR_REPO_URL>
cd tutor-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. In a separate terminal, run the backend API:

```bash
npm run server:dev
```

The frontend runs at `http://localhost:5173` while the API listens on `http://localhost:4000` by default.

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AdminView.tsx   # Admin dashboard
│   ├── StudentView.tsx # Student dashboard
│   └── RoleToggle.tsx  # Role switching component
├── pages/              # Page components
│   ├── Auth.tsx        # Authentication page
│   ├── Index.tsx       # Main dashboard
│   └── NotFound.tsx    # 404 page
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

## Environment Variables

### Frontend (`.env`)

| Variable                        | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Your Supabase project URL                               |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key                                  |
| `VITE_API_BASE_URL`             | Optional: API origin (e.g., `http://localhost:4000`) |

### Backend (`server/.env`)

| Variable                  | Description                                                                       |
| ------------------------- | --------------------------------------------------------------------------------- |
| `PORT`                    | Port for the Express server (defaults to `4000`)                                  |
| `MONGODB_URI`             | MongoDB connection string                                                         |
| `MONGODB_DB_NAME`        | Database name used to store appointment submissions                               |
| `BREVO_API_KEY`           | Brevo transactional API key                                                       |
| `BREVO_TEMPLATE_ID`       | Numeric Brevo template ID used for appointment notifications                      |
| `BREVO_RECIPIENT_EMAIL`   | Primary recipient email for incoming appointment requests                         |
| `BREVO_SENDER_EMAIL`      | Optional: custom sender email registered with Brevo (defaults to recipient)       |
| `BREVO_SENDER_NAME`       | Optional: sender display name (defaults to "Nexus EduHub")                        |
| `ALLOWED_ORIGINS`         | Optional: comma-separated list of origins allowed to call the API (CORS control) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
