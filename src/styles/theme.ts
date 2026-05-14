import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-1: #f6f3ff;
    --bg-2: #ecdcff;
    --board: #fbf8ff;
    --surface: #ffffff;
    --ink: #1d1530;
    --ink-soft: #6a6080;
    --accent: #7c3aed;
    --accent-2: #ec4899;
    --accent-soft: #f3e8ff;
    --accent-ring: #c4b5fd;
    --good: #16a34a;
    --bad: #dc2626;
    --shadow: 0 12px 40px -16px rgba(50, 30, 80, 0.25),
              0 2px 6px -2px rgba(50, 30, 80, 0.1);
  }

  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root { height: 100%; }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: var(--ink);
    background: radial-gradient(1200px 600px at 20% -10%, var(--bg-2), transparent),
                radial-gradient(800px 500px at 90% 110%, #fce7f3, transparent),
                var(--bg-1);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  button { font-family: inherit; }
`;
