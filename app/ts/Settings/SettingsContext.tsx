import React, {createContext, useState} from 'react';
import ISettingsContext from './ISettingsContext';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({children}: {children: any}) {
  const [deterministicOrSmaa] = useState<'deterministic' | 'smaa'>(
    'deterministic'
  );
  return (
    <SettingsContext.Provider
      value={{
        deterministicOrSmaa: deterministicOrSmaa
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
