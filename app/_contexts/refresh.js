'use client';

import { createContext } from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
   return (
      <RefreshContext.Provider value={{}}>{children}</RefreshContext.Provider>
   );
};
