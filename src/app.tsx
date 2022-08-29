import { BrowserRouter as Router } from 'react-router-dom';
import { Footer } from './features/footer/footer';
import { Header } from './features/header/header';
import './app.scss';
import { Main } from './features/main/main';
import { StateProviderWrapper } from './shared/state';

export default function App() {
  return (
    <Router>{StateProviderWrapper([<Header />, <Main />, <Footer />])}</Router>
  );
}
