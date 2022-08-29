import { useEffect } from 'react';
import { setSquareCanvas } from '../../../shared/functions';
import './home.scss';

export function Home() {
  useEffect(() => {
    setSquareCanvas;
  }, []);
  return (
    <div className="home">
      <p>
        Hello! I'm Jonatan and this is sort of a playground of mine, dabbling
        with data visualisation and algorithms which I've found fascinating and
        fun recently.
        <br />
        <br />
        <a href="https://jonatanpetersson.com/" target="_blank">
          My portfolio
        </a>
      </p>
    </div>
  );
}
