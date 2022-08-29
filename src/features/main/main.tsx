import { Route, Routes } from 'react-router-dom';
import './main.scss';
import { routes } from '../../shared/routes';

export function Main() {
  return (
    <main className="main">
      <Routes>
        {routes.map((r) => (
          <Route key={r.title} path={r.path} element={r.element} />
        ))}
      </Routes>
    </main>
  );
}
