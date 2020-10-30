import {calculateObservedRanges} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import React, {createContext, useContext, useEffect, useState} from 'react';
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
  const {workspace, currentSubproblem, scales} = useContext(WorkspaceContext);
  const filteredWorkspace = applySubproblem(workspace, currentSubproblem);
  const {alternatives, criteria, performanceTable} = filteredWorkspace.problem;
  const [observedRanges, setObservedRanges] = useState<
    Record<string, [number, number]>
  >({});

  useEffect(() => {
    if (scales && filteredWorkspace) {
      setObservedRanges(
        calculateObservedRanges(
          scales,
          filteredWorkspace.problem.criteria,
          filteredWorkspace.problem.performanceTable
        )
      );
    }
  }, [scales, filteredWorkspace]);

  return (
    <SubproblemContext.Provider
      value={{
        filteredAlternatives: alternatives,
        filteredCriteria: criteria,
        filteredPerformanceTable: performanceTable,
        filteredWorkspace: filteredWorkspace,
        observedRanges
      }}
    >
      {children}
    </SubproblemContext.Provider>
  );
}
