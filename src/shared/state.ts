import { createContext, useContext } from 'react';

export const State = createContext({});
export const UtilizeState = (): any => useContext(State);
