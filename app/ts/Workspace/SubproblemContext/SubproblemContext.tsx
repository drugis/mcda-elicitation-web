import React, {createContext, useContext} from 'react';
import {WorkspaceContext} from '../WorkspaceContext';
import ISubproblemContext from './ISubproblemContext';
import {applySubproblem} from './SubproblemUtil';

export const SubproblemContext = createContext<ISubproblemContext>(
  {} as ISubproblemContext
);

export function SubproblemContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {workspace, currentSubproblem} = useContext(WorkspaceContext);
  const filteredWorkspace = applySubproblem(workspace, currentSubproblem);
  const {alternatives, criteria, performanceTable} = filteredWorkspace.problem;

  return (
    <SubproblemContext.Provider
      value={{
        filteredAlternatives: alternatives,
        filteredCriteria: criteria,
        filteredPerformanceTable: performanceTable,
        filteredWorkspace: filteredWorkspace
      }}
    >
      {children}
    </SubproblemContext.Provider>
  );
}
