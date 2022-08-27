import { Link } from 'react-router-dom';
import './Navigation.scss';

export function Navigation() {
  return (
    <nav className="main-header-nav">
      <ul>
        <li>
          <Link className="main-header-link" to="/game-of-life">
            Game of Life
          </Link>
        </li>
        <li>
          <Link className="main-header-link" to="/particle-animations">
            Particle Animations
          </Link>
        </li>
        <li>
          <Link className="main-header-link" to="/maze-path">
            Maze generation & Pathfinding
          </Link>
        </li>
        <li>
          <Link className="main-header-link" to="/self-driving-car">
            Self driving car
          </Link>
        </li>
        <li>
          <Link className="main-header-link" to="/fractal-trees">
            Fractal trees
          </Link>
        </li>
        <li>
          <Link className="main-header-link" to="/canvas-transforms">
            Canvas transforms visualizer
          </Link>
        </li>
      </ul>
    </nav>
  );
}
