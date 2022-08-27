import { Link } from 'react-router-dom';
import { Navigation } from './Navigation/Navigation';
import './Header.scss';

export function Header() {
  return (
    <header className="main-header">
      <h1 className="main-header-title">
        <Link className="home-link" to="/">
          ALGO SANDBOX
        </Link>
      </h1>
      <Navigation />
    </header>
  );
}
