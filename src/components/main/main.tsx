import { Route, Routes } from 'react-router-dom';
import { LandingPage } from '../../pages/landing-page/landing-page';
import { Layout as LayoutGameOfLife } from './../../pages/game-of-life/layout/layout';
import { Layout as LayoutMazePath } from './../../pages/maze-path/layout/layout';

export function Main() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="game-of-life" element={<LayoutGameOfLife />} />
      <Route path="maze-path" element={<LayoutMazePath />} />
    </Routes>
  );
}
