import ICriterion from '@shared/interface/ICriterion';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {calculateObservedRanges} from 'app/ts/McdaApp/Workspace/CurrentTab/Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {SubproblemsContext} from '../SubproblemsContext/SubproblemsContext';
import {WorkspaceContext} from '../WorkspaceContext/WorkspaceContext';
import {hasScaleValues} from '../WorkspaceContext/WorkspaceContextUtil';
import ICurrentSubproblemContext from './ICurrentSubproblemContext';
import {
  applySubproblem,
  getConfiguredRanges,
  getStepSizeForCriterion
} from './SubproblemUtil';

export const CurrentSubproblemContext =
  createContext<ICurrentSubproblemContext>({} as ICurrentSubproblemContext);

export function CurrentSubproblemContextProviderComponent({
  children
}: {
  children: any;
}) {
  const history = useHistory();
  const {subproblemId} = useParams<{subproblemId: string}>();

  const {setError} = useContext(ErrorContext);

  const {getSubproblem, updateSubproblem} = useContext(SubproblemsContext);
  const [currentSubproblem, setCurrentSubproblem] = useState<IOldSubproblem>(
    getSubproblem(subproblemId)
  );

  const {workspace, scales} = useContext(WorkspaceContext);
  const [filteredWorkspace, setFilteredWorkspace] = useState(
    applySubproblem(workspace, currentSubproblem)
  );
  const [observedRanges, setObservedRanges] = useState<
    Record<string, [number, number]>
  >({});
  const [configuredRanges, setConfiguredRanges] = useState<
    Record<string, [number, number]>
  >({});
  const [stepSizeByCriterion, setStepSizeByCriterion] = useState<
    Record<string, number>
  >({});

  const {alternatives, criteria, effects, distributions, relativePerformances} =
    filteredWorkspace;

  useEffect(() => {
    const newFilteredWorkspace = applySubproblem(workspace, currentSubproblem);
    setFilteredWorkspace(newFilteredWorkspace);
    if (hasScaleValues(scales)) {
      const newObservedRanges = calculateObservedRanges(
        scales,
        newFilteredWorkspace
      );
      setObservedRanges(newObservedRanges);
      setConfiguredRanges(
        getConfiguredRanges(
          newFilteredWorkspace.criteria,
          newObservedRanges,
          currentSubproblem.definition.ranges
        )
      );
      const stepSizes = _(newFilteredWorkspace.criteria)
        .keyBy('id')
        .mapValues((criterion: ICriterion): number =>
          getStepSizeForCriterion(
            criterion,
            newObservedRanges,
            currentSubproblem.definition.ranges,
            currentSubproblem.definition.stepSizes
          )
        )
        .value();
      setStepSizeByCriterion(stepSizes);
    }
  }, [workspace, currentSubproblem, scales]);

  useEffect(() => {
    setCurrentSubproblem(getSubproblem(subproblemId));
  }, [getSubproblem, subproblemId]);

  function getCriterion(id: string): ICriterion {
    return _.find(criteria, ['id', id]);
  }

  function getConfiguredRange(criterion: ICriterion): [number, number] {
    return configuredRanges[criterion.dataSources[0].id];
  }

  function editSubproblem(subproblem: IOldSubproblem) {
    setCurrentSubproblem(subproblem);
    updateSubproblem(subproblem);
  }

  function goToSubproblem(subproblem: IOldSubproblem): void {
    axios
      .get(
        `/api/v2/workspaces/${workspace.properties.id}/problems/${subproblem.id}/scenarios`
      )
      .then((result: AxiosResponse<IMcdaScenario[]>) => {
        history.push(
          `/workspaces/${workspace.properties.id}/problems/${subproblem.id}/scenarios/${result.data[0].id}/problem`
        );
      })
      .catch(setError);
  }

  return (
    <CurrentSubproblemContext.Provider
      value={{
        configuredRanges,
        currentSubproblem,
        filteredAlternatives: alternatives,
        filteredCriteria: criteria,
        filteredEffects: effects,
        filteredDistributions: distributions,
        filteredRelativePerformances: relativePerformances,
        filteredWorkspace,
        observedRanges,
        stepSizeByCriterion,
        editSubproblem,
        getCriterion,
        getConfiguredRange,
        goToSubproblem
      }}
    >
      {children}
    </CurrentSubproblemContext.Provider>
  );
}
