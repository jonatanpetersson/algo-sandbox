import { CanvasTransforms } from '../components/main/canvas-transforms/canvas-transforms';
import { CanvasTransformsSettings } from '../components/main/canvas-transforms/canvas-transforms-settings';
import { FractalTrees } from '../components/main/fractal-trees/fractal-trees';
import { GameOfLife } from '../components/main/game-of-life/game-of-life';
import { GameOfLifeSettings } from '../components/main/game-of-life/game-of-life-settings';
import { Home } from '../components/main/home/home';
import { MazePath } from '../components/main/maze-path/maze-path';
import { ParticleAnimations } from '../components/main/particle-animations/particle-animations';
import { SelfDrivingCar } from '../components/main/self-driving-car/self-driving-car';

export const routes = [
  {
    path: '/',
    element: <Home />,
    title: 'Home',
  },
  {
    path: '/game-of-life',
    element: <GameOfLife />,
    title: 'Game of Life',
    settings: <GameOfLifeSettings />,
  },
  {
    path: '/particle-animations',
    element: <ParticleAnimations />,
    title: 'Particle Animations',
  },
  {
    path: '/maze-path',
    element: <MazePath />,
    title: 'Maze generation & Pathfinding',
  },
  {
    path: '/self-driving-car',
    element: <SelfDrivingCar />,
    title: 'Self driving car',
  },
  {
    path: '/fractal-trees',
    element: <FractalTrees />,
    title: 'Fractal trees',
  },
  {
    path: '/canvas-transforms',
    element: <CanvasTransforms />,
    title: 'Canvas transforms visualizer',
    settings: <CanvasTransformsSettings />,
  },
];
