import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {createContext} from 'react';
import IEffectsTableContext from './IEffectsTableContext';

export const EffectsTableContext = createContext<IEffectsTableContext>(
  {} as IEffectsTableContext
);

export function EffectsTableContextProviderComponent({
  displayMode,
  children
}: {
  displayMode: TDisplayMode;
  children: any;
}) {
  return (
    <EffectsTableContext.Provider value={{displayMode}}>
      {children}
    </EffectsTableContext.Provider>
  );
}
