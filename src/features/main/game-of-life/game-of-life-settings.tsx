import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SettingsButton } from '../../../shared/components/settings-button/settings-button';
import { UtilizeState } from '../../../shared/state';
import { GameMode } from './types';

export function GameOfLifeSettings() {
  const { state, updateState } = UtilizeState();

  const [gridSize, setGridSize] = useState('');
  const handleGridSize = (event: ChangeEvent<HTMLInputElement>) =>
    setGridSize(event.target.value);

  const [tickSpeed, setTickSpeed] = useState('');
  const handleTickSpeed = (event: ChangeEvent<HTMLInputElement>) =>
    setTickSpeed(event.target.value);

  const [populationRatio, setPopulationRatio] = useState('');
  const handlePopulationRatio = (event: ChangeEvent<HTMLInputElement>) =>
    setPopulationRatio(event.target.value);

  const [config, setConfig] = useState('');
  const handleConfig = (event: ChangeEvent<HTMLSelectElement>) => {
    setConfig(event.target.value);
    delete state.gameMode;
    updateState({ ...state, config: event.target.value });
  };

  const play = () => {
    updateState({
      ...state,
      gameMode:
        state.gameMode !== GameMode.Play ? GameMode.Play : GameMode.Stop,
    });
  };
  const reset = () => {
    updateState({ ...state, gameMode: GameMode.Reset });
  };
  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    updateState({
      ...state,
      gridSize,
      populationRatio,
      tickSpeed,
      gameMode: GameMode.Reset,
    });
  };

  useEffect(() => {
    if (state.gridSize) setGridSize(state.gridSize);
    if (state.tickSpeed) setTickSpeed(state.tickSpeed);
    if (state.populationRatio) setPopulationRatio(state.populationRatio);
  }, [state]);

  return (
    <>
      <h2 className="settings-title">Conway's Game of Life</h2>
      <form action="submit" className="gol-form" onSubmit={submit}>
        <div className="gol-buttons">
          <SettingsButton onClick={play}>
            {state.play ? 'Play' : 'Paus'}
          </SettingsButton>
          <SettingsButton onClick={reset}>Reset</SettingsButton>
        </div>
        <div className="gol-group">
          <label className="config-select-label" htmlFor="config-select">
            Select configuration
          </label>
          <select
            value={config}
            onChange={handleConfig}
            className="config-select"
            name="config-select"
            id="config-select"
          >
            <option disabled={true} value="">
              Select a config
            </option>
            <option value="glider">Glider</option>
            <option value="achims-p16">Archims P16</option>
            <option value="achims-p144">Archims P144</option>
            <option value="weekender">Weekender</option>
            <option value="max-spacefiller-189">Max Spacefiller 189</option>
          </select>
        </div>
        <div className="gol-group">
          <label htmlFor="grid-size">Grid size</label>
          <input
            value={gridSize}
            onChange={handleGridSize}
            type="number"
            name="grid-size"
            id="grid-size"
            step="5"
          />
        </div>
        <div className="gol-group">
          <label htmlFor="tick-speed">Tick speed</label>
          <input
            value={tickSpeed}
            onChange={handleTickSpeed}
            type="number"
            name="tick-speed"
            id="tick-speed"
            step="10"
          />
        </div>
        <div className="gol-group">
          <label htmlFor="population-ratio">Population ratio</label>
          <input
            value={populationRatio}
            onChange={handlePopulationRatio}
            type="number"
            max="1"
            min="0"
            step=".05"
            name="population-ratio"
            id="population-ratio"
          />
        </div>
        <div className="gol-group">
          <input
            className="submit-button"
            type="submit"
            value="Save settings"
          />
        </div>
      </form>
    </>
  );
}

{
  /* <p>
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
</p> */
}
