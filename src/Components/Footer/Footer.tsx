import { Route, Routes } from 'react-router-dom';
import { CanvasTransformsSettings } from '../Main/canvas-transforms/canvas-transforms-settings';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="main-footer">
      <h2 className="main-footer-title">Settings</h2>
      <div className="main-footer-inner-wrapper">
        {/* <HomeSettings />
        <GameOfLifeSettings />
        <ParticleAnimationsSettings />
        <MazePathSettings /> */}
        <Routes>
          <Route
            path="/canvas-transforms"
            element={<CanvasTransformsSettings />}
          />
        </Routes>
      </div>
    </footer>
  );
}
