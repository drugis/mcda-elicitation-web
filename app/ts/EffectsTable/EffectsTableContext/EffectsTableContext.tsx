import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import React, {createContext} from 'react';

export const EffectsTableContext = createContext<any>({});

export function EffectsTableContextProviderComponent({
  children,
  oldWorkspace
}: {
  children: any;
  oldWorkspace: IOldWorkspace;
}) {
  const workspace: IWorkspace = buildWorkspace(oldWorkspace);
  return (
    <EffectsTableContext.Provider
      value={{
        workspace: workspace
      }}
    >
      {children}
    </EffectsTableContext.Provider>
  );
}
