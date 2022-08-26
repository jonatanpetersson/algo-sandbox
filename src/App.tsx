import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { About } from './Components/Main/About/About';
import { GameOfLife } from './Components/Main/GameOfLife/GameOfLife';
import { Home } from './Components/Main/Home/Home';
import { MazePath } from './Components/Main/MazePath/MazePath';
import { ParticleAnimations } from './Components/Main/ParticleAnimations/ParticleAnimations';
import { SelfDrivingCar } from './Components/Main/self-driving-car/self-driving-car';
import './App.scss';
import { FractalTrees } from './Components/Main/fractal-trees/fractal-trees';

export default function App() {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game-of-life" element={<GameOfLife />} />
          <Route path="/particle-animations" element={<ParticleAnimations />} />
          <Route path="/maze-path" element={<MazePath />} />
          <Route path="/self-driving-car" element={<SelfDrivingCar />} />
          <Route path="/fractal-trees" element={<FractalTrees />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
