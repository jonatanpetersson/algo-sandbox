import { BrowserRouter as Router } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import './App.scss';
import { Main } from './Components/Main/main';
import { createContext, useContext, useState } from 'react';
import { initialState } from './shared/constants';
import { InitialStateModel } from './shared/types';
import { State } from './shared/state';

export default function App() {
  const [state, setState] = useState(initialState);
  const updateState = (params: InitialStateModel) => setState(params);

  return (
    <Router>
      <State.Provider value={[state, updateState]}>
        <Header />
        <Main />
        <Footer />
      </State.Provider>
    </Router>
  );
}
