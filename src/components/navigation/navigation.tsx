import * as React from 'react';
import { Link } from 'react-router-dom';

export interface NavigationProps {}

export function Navigation(props: NavigationProps) {
  return (
    <nav>
      <Link to="/">Landing page</Link> |{' '}
      <Link to="/game-of-life">Game of Life</Link> |{' '}
      <Link to="/maze-path">Maze generator & Path finder</Link>
    </nav>
  );
}
