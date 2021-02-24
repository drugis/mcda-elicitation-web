import ICriterion from '@shared/interface/ICriterion';
import {calculateObservedRanges} from 'app/ts/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {WorkspaceContext} from '../WorkspaceContext';
import {hasScaleValues} from '../WorkspaceContextUtil';
import ISubproblemContext from './ISubproblemContext';
import {
  applySubproblem,
  getConfiguredRanges,
  getStepSize,
  hasNoRange
} from './SubproblemUtil';

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
  const [configuredRanges, setConfiguredRanges] = useState<
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

  useEffect(() => {
    setConfiguredRanges(
      getConfiguredRanges(
        criteria,
        observedRanges,
        currentSubproblem.definition.ranges
      )
    );
  }, [observedRanges, currentSubproblem]);

  function getStepSizeForCriterion(criterion: ICriterion) {
    const dataSourceId = criterion.dataSources[0].id;
    if (hasNoRange(currentSubproblem.definition.ranges, dataSourceId)) {
      return getStepSize(
        observedRanges[dataSourceId],
        currentSubproblem.definition.stepSizes[dataSourceId]
      );
    } else {
      return getStepSize(
        currentSubproblem.definition.ranges[dataSourceId],
        currentSubproblem.definition.stepSizes[dataSourceId]
      );
    }
  }

  return (
    <SubproblemContext.Provider
      value={{
        configuredRanges,
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
