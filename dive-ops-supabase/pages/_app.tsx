import type { AppProps } from 'next/app';
import { useEffect } from 'react';

const globalStyles = `
  :root {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --background: #f8fafc;
    --text: #1e293b;
    --card: #ffffff;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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

  .card {
    background-color: var(--card);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin: 20px 0;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <Component {...pageProps} />;
}
