#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

/**
 * Backend Structure Generator for Proof of Life App
 * Run this script from your project root: node setup-backend.js
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Define the backend structure
const structure = {
  'app/api/auth/login': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/auth/signup': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/auth/logout': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/checkins': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/checkins - Get user's check-ins
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ checkins: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/checkins - Create a new check-in
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { method = 'manual', notes } = await request.json();

    const { data, error } = await supabase
      .from('checkins')
      .insert({
        user_id: user.id,
        method,
        status: 'completed',
        notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ checkin: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/memories': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/memories - Get user's memories
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('memories')
      .select(\`
        *,
        memory_recipients (
          recipient_id,
          recipients (
            id,
            name,
            email
          )
        )
      \`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ memories: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, media_url, media_type, scheduled_release_date, recipient_ids } = await request.json();

    // Create memory
    const { data: memory, error: memoryError } = await supabase
      .from('memories')
      .insert({
        user_id: user.id,
        title,
        content,
        media_url,
        media_type,
        scheduled_release_date,
      })
      .select()
      .single();

    if (memoryError) {
      return NextResponse.json({ error: memoryError.message }, { status: 400 });
    }

    // Link recipients if provided
    if (recipient_ids && recipient_ids.length > 0) {
      const memoryRecipients = recipient_ids.map((recipient_id: string) => ({
        memory_id: memory.id,
        recipient_id,
      }));

      const { error: linkError } = await supabase
        .from('memory_recipients')
        .insert(memoryRecipients);

      if (linkError) {
        console.error('Error linking recipients:', linkError);
      }
    }

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/memories/[id]': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/memories/[id] - Get a specific memory
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('memories')
      .select(\`
        *,
        memory_recipients (
          recipient_id,
          recipients (
            id,
            name,
            email
          )
        )
      \`)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ memory: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/memories/[id] - Update a memory
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, media_url, media_type, scheduled_release_date, recipient_ids } = await request.json();

    // Update memory
    const { data: memory, error: updateError } = await supabase
      .from('memories')
      .update({
        title,
        content,
        media_url,
        media_type,
        scheduled_release_date,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Update recipients if provided
    if (recipient_ids) {
      // Delete existing links
      await supabase
        .from('memory_recipients')
        .delete()
        .eq('memory_id', params.id);

      // Create new links
      if (recipient_ids.length > 0) {
        const memoryRecipients = recipient_ids.map((recipient_id: string) => ({
          memory_id: params.id,
          recipient_id,
        }));

        await supabase.from('memory_recipients').insert(memoryRecipients);
      }
    }

    return NextResponse.json({ memory });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/memories/[id] - Delete a memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/recipients': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/recipients - Get user's recipients
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('recipients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ recipients: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/recipients - Create a new recipient
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone } = await request.json();

    const { data, error } = await supabase
      .from('recipients')
      .insert({
        user_id: user.id,
        name,
        email,
        phone,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ recipient: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/recipients/[id]': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/recipients/[id] - Update a recipient
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone } = await request.json();

    const { data, error } = await supabase
      .from('recipients')
      .update({ name, email, phone })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ recipient: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/recipients/[id] - Delete a recipient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('recipients')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Recipient deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'app/api/settings': {
    'route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If no settings exist, create default ones
    if (!data) {
      const { data: newSettings, error: createError } = await supabase
        .from('user_settings')
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

      return NextResponse.json({ settings: newSettings });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { check_in_frequency, grace_period, notification_preferences, timezone } = await request.json();

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        check_in_frequency,
        grace_period,
        notification_preferences,
        timezone,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`
  },
  'lib/supabase': {
    'server.ts': `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The \`set\` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The \`delete\` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
`
  },
  'lib/supabase': {
    'client.ts': `import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`
  },
  'lib/supabase': {
    'middleware.ts': `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}
`
  },
  'lib/types': {
    'database.types.ts': `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      checkins: {
        Row: {
          id: string
          user_id: string
          checked_in_at: string
          method: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checked_in_at?: string
          method: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          checked_in_at?: string
          method?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          media_url: string | null
          media_type: string | null
          scheduled_release_date: string | null
          is_released: boolean
          released_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          media_url?: string | null
          media_type?: string | null
          scheduled_release_date?: string | null
          is_released?: boolean
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          media_url?: string | null
          media_type?: string | null
          scheduled_release_date?: string | null
          is_released?: boolean
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      memory_recipients: {
        Row: {
          memory_id: string
          recipient_id: string
          sent_at: string | null
        }
        Insert: {
          memory_id: string
          recipient_id: string
          sent_at?: string | null
        }
        Update: {
          memory_id?: string
          recipient_id?: string
          sent_at?: string | null
        }
      }
      user_settings: {
        Row: {
          user_id: string
          check_in_frequency: string
          grace_period: string
          notification_preferences: Json
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          check_in_frequency?: string
          grace_period?: string
          notification_preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          check_in_frequency?: string
          grace_period?: string
          notification_preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
`
  },
  '.': {
    'middleware.ts': `import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
`
  },
};

// Helper to create directory structure
function createStructure(baseDir, structure) {
  for (const [dirPath, files] of Object.entries(structure)) {
    const fullDirPath = path.join(baseDir, dirPath);
    
    // Create directory
    if (!fs.existsSync(fullDirPath)) {
      fs.mkdirSync(fullDirPath, { recursive: true });
      log(`✓ Created directory: ${dirPath}`, 'blue');
    }

    // Create files
    for (const [fileName, content] of Object.entries(files)) {
      const fullFilePath = path.join(fullDirPath, fileName);
      fs.writeFileSync(fullFilePath, content);
      log(`  ✓ Created file: ${path.join(dirPath, fileName)}`, 'green');
    }
  }
}

// Update package.json dependencies
function updatePackageJson(baseDir) {
  const packageJsonPath = path.join(baseDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const newDependencies = {
      '@supabase/ssr': '^0.5.2',
      '@supabase/supabase-js': '^2.45.4',
    };

    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...newDependencies,
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    log('✓ Updated package.json with Supabase dependencies', 'green');
  }
}

// Create .env.local.example
function createEnvExample(baseDir) {
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
`;

  const envPath = path.join(baseDir, '.env.local.example');
  fs.writeFileSync(envPath, envContent);
  log('✓ Created .env.local.example', 'green');
}

// Main execution
function main() {
  log('\n🚀 Setting up backend structure for Proof of Life App\n', 'blue');

  const projectRoot = process.cwd();
  
  try {
    createStructure(projectRoot, structure);
    updatePackageJson(projectRoot);
    createEnvExample(projectRoot);
    
    log('\n✅ Backend structure created successfully!\n', 'green');
    log('Next steps:', 'yellow');
    log('1. Run: npm install', 'yellow');
    log('2. Copy .env.local.example to .env.local and fill in your Supabase credentials', 'yellow');
    log('3. Run the database migrations from the SQL files', 'yellow');
    log('4. Start your dev server: npm run dev\n', 'yellow');
  } catch (error) {
    log(`\n❌ Error: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

main();
