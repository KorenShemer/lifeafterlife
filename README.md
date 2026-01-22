# Digital Legacy App

A secure platform to preserve and share your digital memories with loved ones.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── memories/          # Memory management
│   ├── recipients/        # Recipient management
│   ├── settings/          # User settings
│   └── api/              # API routes
│
├── features/              # Feature modules
│   ├── memories/         # Memory feature
│   ├── recipients/       # Recipients feature
│   ├── checkin/         # Check-in feature
│   └── auth/            # Authentication feature
│
├── shared/               # Shared code
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
│
└── lib/                 # External integrations
    └── api-client.ts   # Axios configuration
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **File Upload**: React Dropzone
- **HTTP Client**: Axios
- **Optimization**: React Compiler (automatic memoization)

## Features

- ✅ Secure memory storage (images, videos, notes, diaries)
- ✅ Periodic check-in system
- ✅ Recipient management
- ✅ Automated delivery on inactivity
- 🔒 End-to-end encryption
- 📱 Responsive design

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Environment Variables

See `.env.local.example` for required environment variables.

## Next Steps

1. Set up backend API (Node.js/Python)
2. Configure S3/R2 storage
3. Implement authentication
4. Build UI components
5. Set up database (PostgreSQL)
6. Implement check-in scheduler

## License

MIT
