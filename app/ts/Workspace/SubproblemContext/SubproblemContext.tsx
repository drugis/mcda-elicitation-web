import ICriterion from '@shared/interface/ICriterion';
import {calculateObservedRanges} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {WorkspaceContext} from '../WorkspaceContext';
import {hasScaleValues} from '../WorkspaceContextUtil';
import ISubproblemContext from './ISubproblemContext';
import {applySubproblem, getStepSize} from './SubproblemUtil';

export const SubproblemContext = createContext<ISubproblemContext>(
  {} as ISubproblemContext
);

export function SubproblemContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {workspace, currentSubproblem, scales} = useContext(WorkspaceContext);
  const [filteredWorkspace, setFilteredWorkspace] = useState(
    applySubproblem(workspace, currentSubproblem)
  );
  const {
    alternatives,
    criteria,
    effects,
    distributions,
    relativePerformances
  } = filteredWorkspace;
  const [observedRanges, setObservedRanges] = useState<
    Record<string, [number, number]>
  >({});

  useEffect(() => {
    if (hasScaleValues(scales) && filteredWorkspace) {
      setObservedRanges(calculateObservedRanges(scales, filteredWorkspace));
    }
  }, [scales, filteredWorkspace]);

  useEffect(() => {
    setFilteredWorkspace(applySubproblem(workspace, currentSubproblem));
  }, [workspace, currentSubproblem]);

  function getStepSizeForCriterion(criterion: ICriterion) {
    return getStepSize(
      currentSubproblem.definition.ranges[criterion.dataSources[0].id],
      currentSubproblem.definition.stepSizes[criterion.dataSources[0].id]
    );
  }

  return (
    <SubproblemContext.Provider
      value={{
        filteredAlternatives: alternatives,
        filteredCriteria: criteria,
        filteredEffects: effects,
        filteredDistributions: distributions,
        filteredRelativePerformances: relativePerformances,
        filteredWorkspace,
        observedRanges,
        getStepSizeForCriterion
      }}
    >
      {children}
    </SubproblemContext.Provider>
  );
}
