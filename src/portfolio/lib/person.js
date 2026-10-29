import { createContext, useContext } from 'react';

export const PersonContext = createContext(null);
export const usePerson = () => useContext(PersonContext);
