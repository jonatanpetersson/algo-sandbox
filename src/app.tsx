import './app.scss';
import { Navigation } from './components/navigation/navigation';
import { Main } from './components/main/main';

export default function App() {
  return (
    <>
      <header className="header-header">
        <h1>Algo Sandbox</h1>
        <Navigation />
      </header>
      <Main />
      <footer></footer>
    </>
  );
}
