import { UtilizeState } from '../../../shared/state';

export function GameOfLifeSettings() {
  return (
    <>
      <h1 className="header">Conway's Game of Life</h1>
      <p>
        Visualisation of
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
        >
          Conway's Game of Life
        </a>
        . It is a zero-player game, meaning that its evolution is determined by
        its initial state, which currently is set at random for each cell. There
        are a few settings below to tinker with.
      </p>
      <button className="toggle-button">Play game</button>
      <button className="reset-button">Reset game</button>
      <h3>Settings</h3>
      <form action="submit" className="form">
        <label htmlFor="grid-size">Grid size (for rows and columns)</label>
        <input type="number" name="grid-size" id="grid-size" step="5" />
        <label htmlFor="tick-speed">Tick speed (ms)</label>
        <input type="number" name="tick-speed" id="tick-speed" step="10" />
        <label htmlFor="population-ratio">Initial population ratio (0-1)</label>
        <input
          type="number"
          max="1"
          min="0"
          step=".05"
          name="population-ratio"
          id="population-ratio"
        />
        <input className="submit-button" type="submit" value="Save settings" />
      </form>
      <label className="config-select-label" htmlFor="config-select">
        Select and place a config on the canvas
      </label>
      <select className="config-select" name="config-select" id="config-select">
        <option value="" disabled selected hidden>
          Select configuration
        </option>
        <option value="glider">Glider</option>
        <option value="achims-p16">Archims P16</option>
        <option value="achims-p144">Archims P144</option>
        <option value="weekender">Weekender</option>
        <option value="max-spacefiller-189">Max Spacefiller 189</option>
      </select>
    </>
  );
}