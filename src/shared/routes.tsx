import { CanvasTransforms } from '../features/main/canvas-transforms/canvas-transforms';
import { CanvasTransformsSettings } from '../features/main/canvas-transforms/canvas-transforms-settings';
import { FractalTrees } from '../features/main/fractal-trees/fractal-trees';
import { FractalTreesSettings } from '../features/main/fractal-trees/fractal-trees-settings';
import { GameOfLife } from '../features/main/game-of-life/game-of-life';
import { GameOfLifeSettings } from '../features/main/game-of-life/game-of-life-settings';
import { Home } from '../features/main/home/home';
import { HomeSettings } from '../features/main/home/home-settings';
import { MazePath } from '../features/main/maze-path/maze-path';
import { MazePathSettings } from '../features/main/maze-path/maze-path-settings';
import { ParticleEffects } from '../features/main/particle-effects/particle-effects';
import { ParticleEffectsSettings } from '../features/main/particle-effects/particle-effects-settings';
import { SelfDrivingCar } from '../features/main/self-driving-car/self-driving-car';
import { SelfDrivingCarSettings } from '../features/main/self-driving-car/self-driving-car-settings';

export const routes = [
  {
    path: '/',
    element: <Home />,
    title: 'Home',
    settings: <HomeSettings />,
  },
  {
    path: '/game-of-life',
    element: <GameOfLife />,
    title: 'Game of Life',
    settings: <GameOfLifeSettings />,
  },
  {
    path: '/particle-effects',
    element: <ParticleEffects />,
    title: 'Particle Effects',
    settings: <ParticleEffectsSettings />,
  },
  {
    path: '/maze-path',
    element: <MazePath />,
    title: 'Maze generation & Pathfinding',
    settings: <MazePathSettings />,
  },
  {
    path: '/self-driving-car',
    element: <SelfDrivingCar />,
    title: 'Self driving car',
    settings: <SelfDrivingCarSettings />,
  },
  {
    path: '/fractal-trees',
    element: <FractalTrees />,
    title: 'Fractal trees',
    settings: <FractalTreesSettings />,
  },
  {
    path: '/canvas-transforms',
    element: <CanvasTransforms />,
    title: 'Canvas transforms visualizer',
    settings: <CanvasTransformsSettings />,
  },
];
