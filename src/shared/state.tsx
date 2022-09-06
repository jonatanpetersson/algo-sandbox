import React, { createContext, useContext, useState } from 'react';

export const initialState: StateModel = {};

type StateModel = {
  [key: string]: any;
};

interface StateModel2 {
  gameOfLife?: { [key: string]: any };
  particleAnimations?: { [key: string]: any };
  mazePath?: { [key: string]: any };
  selfDrivingCar?: { [key: string]: any };
  fractalTrees?: { [key: string]: any };
  canvasTransforms?: { [key: string]: any };
}

type SetStateModel = React.Dispatch<React.SetStateAction<StateModel>>;

export interface ContextModel {
  state: StateModel;
  updateState: SetStateModel;
}

const State = createContext(initialState);

export const StateProviderWrapper = (components: JSX.Element[]) => {
  const [state, updateState] = useState(initialState);
  return (
    <State.Provider value={{ state, updateState }}>
      {components.map((c, i) => ({ ...c, key: i }))}
    </State.Provider>
  );
};

export const UtilizeState = (): ContextModel => {
  const context = useContext(State);
  return context as ContextModel;
};

export const CreateLocalState = (initialState: {[key: string]: any}) => {
  const [state, setState] = useState(initialState);
  return (data?: {[key: string]: any}) => {
    if (data) {
      setState({...state, data})
    } else {
      return state
    }
  };
}

