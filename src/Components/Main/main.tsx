import { Route, Routes } from 'react-router-dom';
import { CanvasTransforms } from './canvas-transforms/canvas-transforms';
import { FractalTrees } from './fractal-trees/fractal-trees';
import { GameOfLife } from './GameOfLife/GameOfLife';
import { Home } from './Home/Home';
import { MazePath } from './MazePath/MazePath';
import { ParticleAnimations } from './ParticleAnimations/ParticleAnimations';
import { SelfDrivingCar } from './self-driving-car/self-driving-car';
import './main.scss';

export function Main() {
  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-of-life" element={<GameOfLife />} />
        <Route path="/particle-animations" element={<ParticleAnimations />} />
        <Route path="/maze-path" element={<MazePath />} />
        <Route path="/self-driving-car" element={<SelfDrivingCar />} />
        <Route path="/fractal-trees" element={<FractalTrees />} />
        <Route path="/canvas-transforms" element={<CanvasTransforms />} />
      </Routes>
    </main>
  );
}
