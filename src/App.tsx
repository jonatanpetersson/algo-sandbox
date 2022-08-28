import { BrowserRouter as Router } from 'react-router-dom';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import './app.scss';
import { Main } from './components/main/main';
import { initialState, StateProviderWrapper } from './shared/state';

export default function App() {
  return (
    <Router>{StateProviderWrapper([<Header />, <Main />, <Footer />])}</Router>
  );
}
