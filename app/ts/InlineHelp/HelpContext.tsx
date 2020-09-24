import {createContext, useContext} from 'react';
import IHelpContext from './IHelpContext';
import IHelpInfo from './IHelpInfo';
import React from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import {lexicon} from './lexicon';

export const HelpContext = createContext<IHelpContext>({} as IHelpContext);

export function HelpContextProviderComponent({children}: {children: any}) {
  const {setErrorMessage} = useContext(ErrorContext);

  function getHelpInfo(id: string): IHelpInfo {
    if (lexicon[id]) {
      return lexicon[id];
    } else {
      setErrorMessage(`Unrecognized help ID: ${id}`);
    }
  }

  return (
    <HelpContext.Provider value={{getHelpInfo}}>
      {children}
    </HelpContext.Provider>
  );
}
