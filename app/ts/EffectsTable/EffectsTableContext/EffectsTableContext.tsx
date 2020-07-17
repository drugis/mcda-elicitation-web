import IEffectsTableContext from '@shared/interface/IEffectsTableContext';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import { buildWorkspace } from '@shared/workspaceService';
import React, { createContext } from 'react';

export const EffectsTableContext = createContext<IEffectsTableContext>(
  {} as IEffectsTableContext
);

export function EffectsTableContextProviderComponent({
  children,
  oldWorkspace,
  scales
}: {
  children: any;
  oldWorkspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
}) {
  const workspace: IWorkspace = buildWorkspace(oldWorkspace);
  return (
    <EffectsTableContext.Provider
      value={{
        workspace: workspace,
        alternatives: workspace.alternatives,
        scales: scales
      }}
    >
      {children}
    </EffectsTableContext.Provider>
  );
}
