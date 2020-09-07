import React, {createContext, useState} from 'react';
import {buildElicitationCriteria} from './ElicitationUtil';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';
import IPreferencesContext from './IPreferencesContext';

export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  inputCriteria,
  children
}: {
  inputCriteria: IInputCriterion[];
  children: any;
}) {
  const [criteria] = useState<Record<string, IElicitationCriterion>>(
    buildElicitationCriteria(inputCriteria)
  );

  return (
    <PreferencesContext.Provider
      value={{
        criteria: criteria
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
