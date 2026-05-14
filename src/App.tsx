import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Game } from './components/Game';
import { Landing } from './components/Landing';
import { GlobalStyle } from './styles/theme';
import { DIFFICULTY } from './config';
import { Difficulty } from './types';

const Shell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 24px 16px 48px;
  gap: 16px;
`;

const Footer = styled.footer`
  color: var(--ink-soft);
  font-size: 13px;
  margin-top: auto;
  padding-top: 8px;
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

type View = { kind: 'landing' } | { kind: 'game'; difficulty: Difficulty };

export function App() {
  const [view, setView] = useState<View>({ kind: 'landing' });

  const start = useCallback((difficulty: Difficulty) => {
    setView({ kind: 'game', difficulty });
  }, []);

  const exit = useCallback(() => setView({ kind: 'landing' }), []);

  return (
    <>
      <GlobalStyle />
      <Shell>
        {view.kind === 'landing' ? (
          <Landing onStart={start} />
        ) : (
          <Game config={DIFFICULTY[view.difficulty]} onExit={exit} />
        )}
        <Footer>
          Built with React & Vite ·{' '}
          <a
            href="https://github.com/pal/mousegame"
            target="_blank"
            rel="noreferrer"
          >
            source on GitHub
          </a>
        </Footer>
      </Shell>
    </>
  );
}
