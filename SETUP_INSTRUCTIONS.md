# Backend Setup Script

This script will automatically create your entire backend structure for the Proof of Life app.

## What It Creates

### API Routes
- `/app/api/auth/login` - User login
- `/app/api/auth/signup` - User registration
- `/app/api/auth/logout` - User logout
- `/app/api/checkins` - Check-in management
- `/app/api/memories` - Memory CRUD operations
- `/app/api/memories/[id]` - Individual memory operations
- `/app/api/recipients` - Recipient management
- `/app/api/recipients/[id]` - Individual recipient operations
- `/app/api/settings` - User settings

### Lib Files
- `/lib/supabase/server.ts` - Server-side Supabase client
- `/lib/supabase/client.ts` - Client-side Supabase client
- `/lib/supabase/proxy.ts` - Session management
- `/lib/types/database.types.ts` - TypeScript database types

### Root Files
- `middleware.ts` - Next.js middleware for auth
- `.env.local.example` - Environment variable template

## Installation

1. **Copy the script to your project root:**
   ```bash
   # Make sure you're in your project directory (LIFEAFTERLIFE folder)
   # Copy setup-backend.js to the root
   ```

2. **Run the script:**
   ```bash
   node setup-backend.js
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   
   # Edit .env.local and add your Supabase credentials
   ```

5. **Set up your database:**
   - Go to your Supabase project
   - Run the SQL migrations from `001_initial_schema.sql`
   - (Optional) Run `002_seed_data.sql` for test data

6. **Start your dev server:**
   ```bash
   npm run dev
   ```

## What You'll Need

### Supabase Setup
1. Create a project at https://supabase.com
2. Get your project credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key (for admin operations)

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## File Structure After Running

```
📦LIFEAFTERLIFE
 ┣ 📂app
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂signup
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┗ 📂logout
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂checkins
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂memories
 ┃ ┃ ┃ ┣ 📜route.ts
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂recipients
 ┃ ┃ ┃ ┣ 📜route.ts
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┗ 📂settings
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┗ ... (your existing app structure)
 ┣ 📂lib
 ┃ ┣ 📂supabase
 ┃ ┃ ┣ 📜server.ts
 ┃ ┃ ┣ 📜client.ts
 ┃ ┃ ┗ 📜middleware.ts
 ┃ ┗ 📂types
 ┃ ┃ ┗ 📜database.types.ts
 ┣ 📜middleware.ts
 ┗ 📜.env.local.example
```

## Testing Your API

After setup, you can test your endpoints:

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Check-in
```bash
curl -X POST http://localhost:3000/api/checkins \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"method":"manual"}'
```

### Get Memories
```bash
curl http://localhost:3000/api/memories \
  -H "Cookie: your-session-cookie"
```

## Updating Your Frontend

After the backend is set up, update your existing frontend API calls to use these new endpoints. Example:

```typescript
// In your features/auth/api files
import { createClient } from '@/lib/supabase/client';

export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
```

## Troubleshooting

**"Cannot find module '@supabase/ssr'"**
- Run `npm install` to install dependencies

**API returns 401 Unauthorized**
- Check your Supabase environment variables
- Make sure you're logged in (have a valid session)

**Database errors**
- Make sure you ran the SQL migrations
- Check your Supabase project is active
- Verify RLS policies are set up correctly

## Next Steps

1. Update your existing feature API files to use the new endpoints
2. Add error handling and loading states
3. Implement protected routes for authenticated pages
4. Set up cron jobs for checking missed check-ins
5. Add email notifications for memory releases
