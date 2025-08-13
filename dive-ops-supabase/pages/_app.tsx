import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
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
