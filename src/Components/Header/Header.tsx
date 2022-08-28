import { Link } from 'react-router-dom';
import { Navigation } from './navigation/navigation';
import './header.scss';

export function Header() {
  return (
    <header className="header">
      <h1 className="title">
        <Link to="/">ALGO SANDBOX</Link>
      </h1>
      <Navigation />
    </header>
  );
}
