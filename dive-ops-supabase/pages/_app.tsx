import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Session } from '@supabase/supabase-js';

// Minimal global styles (inlined to avoid file dependency)
const globalStyles = `
  :root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --secondary: #10b981;
    --danger: #ef4444;
    --background: #f8fafc;
    --text: #1e293b;
    --card: #ffffff;
    --border: #e2e8f0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.5;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn:hover {
    background-color: var(--primary-dark);
  }

  .btn-danger {
    background-color: var(--danger);
  }

  .card {
    background-color: var(--card);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin: 20px 0;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 16px;
  }

  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background);
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [supabaseClient] = useState(() => createBrowserSupabaseClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }));
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth and handle routing
  const checkAuth = async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (error) throw error;
      
      setSession(data.session);
      setIsLoading(false);
      
      // Redirect logic
      if (!data.session && !router.pathname.startsWith('/auth')) {
        router.push('/auth/login');
      } else if (data.session && router.pathname.startsWith('/auth')) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Inject global styles
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    // Initial auth check
    checkAuth();

    // Setup auth state listener
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        // Handle navigation based on auth events
        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Provide session to all pages
  const modifiedPageProps = { ...pageProps, session, supabaseClient };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="card">
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...modifiedPageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
