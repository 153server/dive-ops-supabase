import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

// Create minimal global styles directly in the file
const globalStyles = `
  :root {
    --primary-color: #3b82f6;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    --background-color: #f8fafc;
    --text-color: #1e293b;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.5;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Inject global styles
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    // Fetch initial session
    const fetchSession = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        setSession(data.session);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        
        // Redirect to login if not authenticated
        if (!newSession && router.pathname !== '/login') {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
      // Clean up styles
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [supabaseClient, router]);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} session={session} />
    </SessionContextProvider>
  );
}

export default MyApp;
