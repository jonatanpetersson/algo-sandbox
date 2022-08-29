import { Route, Routes } from 'react-router-dom';
import { routes } from '../../shared/routes';
import './footer.scss';

export function Footer() {
  return (
    <footer className="footer">
      <Routes>
        {routes
          .filter((r) => r.settings)
          .map((r) => (
            <Route key={r.title} path={r.path} element={r.settings} />
          ))}
      </Routes>
    </footer>
  );
}
