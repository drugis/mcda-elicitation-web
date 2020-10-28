import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import {getTitleError} from 'app/ts/util/getTitleError';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  createSubproblemDefinition,
  getBaselineMap,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  initConfiguredRanges,
  initInclusions,
  isAlternativeDisabled,
  isDataSourceDeselectionDisabled
} from './AddSubproblemUtil';
import IAddSubproblemContext from './IAddSubproblemContext';

export const AddSubproblemContext = createContext<IAddSubproblemContext>(
  {} as IAddSubproblemContext
);

export function AddSubproblemContextProviderComponent(props: {children: any}) {
  const {
    subproblems,
    alternatives,
    workspace,
    criteria,
    currentSubproblem,
    observedRanges,
    addSubproblem
  } = useContext(WorkspaceContext);
  const [title, setTitle] = useState<string>('new problem');
  const [errors, setErrors] = useState<string[]>(getErrors());
  const dataSourcesById: Record<string, IDataSource> = _(criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .value();

  const [alternativeInclusions, setAlternativeInclusions] = useState<
    Record<string, boolean>
  >(
    initInclusions(
      alternatives,
      currentSubproblem.definition.excludedAlternatives
    )
  );
  const [criterionInclusions, setCriterionInclusions] = useState<
    Record<string, boolean>
  >(initInclusions(criteria, currentSubproblem.definition.excludedCriteria));
  const [dataSourceInclusions, setDataSourceInclusions] = useState<
    Record<string, boolean>
  >(
    initInclusions(
      dataSourcesById,
      currentSubproblem.definition.excludedDataSources
    )
  );

  const [scaleRangesWarnings, setScaleRangesWarnings] = useState<string[]>(
    getScaleBlockingWarnings(
      criterionInclusions,
      dataSourceInclusions,
      alternativeInclusions,
      workspace
    )
  );

  const [missingValueWarnings, setMissingValueWarnings] = useState<string[]>(
    getMissingValueWarnings(
      dataSourceInclusions,
      alternativeInclusions,
      workspace
    )
  );

  const [configuredRanges, setConfiguredRanges] = useState<
    Record<string, [number, number]>
  >(
    initConfiguredRanges(
      dataSourcesById,
      observedRanges,
      currentSubproblem.definition.ranges
    )
  );

  const baselineMap: Record<string, boolean> = getBaselineMap(
    alternatives,
    workspace.relativePerformances
  );

  useEffect(() => {
    setErrors(getErrors());
  }, [title]);

  useEffect(() => {
    setScaleRangesWarnings(
      getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      )
    );
    setMissingValueWarnings(
      getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      )
    );
  }, [
    dataSourceInclusions,
    criterionInclusions,
    alternativeInclusions,
    workspace
  ]);

  function getErrors(): string[] {
    const titleError: string = getTitleError(title, subproblems);
    if (titleError) {
      return [titleError];
    } else {
      return [];
    }
  }

  function updateAlternativeInclusion(id: string, newValue: boolean) {
    let newInclusions = {...alternativeInclusions};
    newInclusions[id] = newValue;
    setAlternativeInclusions(newInclusions);
  }

  function updateCriterionInclusion(id: string, newValue: boolean) {
    let newCriterionInclusions = {...criterionInclusions};
    newCriterionInclusions[id] = newValue;
    setCriterionInclusions(newCriterionInclusions);
    _.forEach(criteria[id].dataSources, (dataSource: IDataSource) => {
      updateDataSourceInclusion(dataSource.id, newValue);
    });
  }

  function updateDataSourceInclusion(id: string, newValue: boolean): void {
    let newInclusions = {...dataSourceInclusions};
    newInclusions[id] = newValue;
    setDataSourceInclusions(newInclusions);
  }

  function isCriterionExcluded(criterionId: string): boolean {
    return !criterionInclusions[criterionId];
  }

  function isDataSourceExcluded(dataSourceId: string): boolean {
    return !dataSourceInclusions[dataSourceId];
  }

  function isAlternativeExcluded(alternativeId: string): boolean {
    return !alternativeInclusions[alternativeId];
  }

  function getIncludedDataSourceForCriterion(
    criterion: ICriterion
  ): IDataSource {
    return _.find(criterion.dataSources, (dataSource: IDataSource) => {
      return dataSourceInclusions[dataSource.id];
    });
  }

  function isAlternativeDisabledWrapper(id: string) {
    return isAlternativeDisabled(id, alternativeInclusions, baselineMap);
  }

  function isDataSourceDeselectionDisabledWrapper(criterionId: string) {
    return isDataSourceDeselectionDisabled(
      criteria[criterionId],
      dataSourceInclusions,
      criterionInclusions
    );
  }

  function resetToDefault(): void {
    setCriterionInclusions(initInclusions(criteria));
    setDataSourceInclusions(initInclusions(dataSourcesById));
    setAlternativeInclusions(initInclusions(alternatives));
    setConfiguredRanges(initConfiguredRanges(dataSourcesById, observedRanges));
  }

  function addSubproblemWrapper(): void {
    const subproblemCommand: ISubproblemCommand = {
      title: title,
      definition: createSubproblemDefinition(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        configuredRanges
      )
    };
    addSubproblem(subproblemCommand);
  }

  function setConfiguredRange(
    dataSourceId: string,
    lowestConfiguredValue: number,
    highestConfiguredValue: number
  ): void {
    let newRanges = _.cloneDeep(configuredRanges);
    newRanges[dataSourceId] = [lowestConfiguredValue, highestConfiguredValue];
    setConfiguredRanges(newRanges);
  }

  return (
    <AddSubproblemContext.Provider
      value={{
        title,
        errors,
        isCriterionDeselectionDisabled:
          _.filter(criterionInclusions).length < 3,
        scaleRangesWarnings,
        missingValueWarnings,
        configuredRanges,
        getIncludedDataSourceForCriterion,
        isCriterionExcluded,
        isDataSourceExcluded,
        isAlternativeExcluded,
        setTitle,
        updateAlternativeInclusion,
        updateCriterionInclusion,
        updateDataSourceInclusion,
        isAlternativeDisabled: isAlternativeDisabledWrapper,
        isDataSourceDeselectionDisabled: isDataSourceDeselectionDisabledWrapper,
        resetToDefault,
        setConfiguredRange,
        addSubproblem: addSubproblemWrapper
      }}
    >
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
