import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconClose } from '../../../assets/icons/icon-close';
import { IconMenu } from '../../../assets/icons/icon-menu';
import { routes } from '../../../shared/routes';
import './navigation.scss';

export function Navigation() {
  let nav: HTMLElement;
  const openNav = () => nav.classList.add('open');
  const closeNav = () => nav.classList.remove('open');

  useEffect(() => {
    nav = document.querySelector('.nav')!;
  });
  return (
    <>
      <button className="open-nav" onClick={openNav}>
        <IconMenu />
      </button>
      <nav className="nav">
        <ul>
          <li>
            <button className="close-nav" onClick={closeNav}>
              <IconClose />
            </button>
          </li>
          {routes
            .filter((r) => r.title !== 'Home')
            .map((r) => (
              <li key={r.title}>
                <Link key={r.title} to={r.path} onClick={closeNav}>
                  {r.title}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
