import React, { createContext, useContext, useState } from 'react';

export const initialState = {
  gameOfLife: {},
  particleAnimations: {},
  mazePath: {},
  selfDrivingCar: {},
  fractalTrees: {},
  canvasTransforms: {},
};

const State = createContext({});

export const StateProviderWrapper = (components: JSX.Element[]) => {
  const [state, setState] = useState(initialState);
  return (
    <State.Provider value={[state, setState]}>
      {components.map((c, i) => ({ ...c, key: i }))}
    </State.Provider>
  );
};

export const UtilizeState = (): any => useContext(State);
