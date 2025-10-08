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

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase
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
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
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

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.