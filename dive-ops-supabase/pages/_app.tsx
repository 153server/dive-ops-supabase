import type { AppProps } from 'next/app';
import { useEffect } from 'react'; // Added useEffect import

// Minimal global styles
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

  .card {
    background-color: var(--card);
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin: 20px 0;
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
  useEffect(() => {
    // Inject global styles
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
