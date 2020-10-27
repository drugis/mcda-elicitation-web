import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {getTitleError} from 'app/ts/util/getTitleError';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getBaselineMap,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
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
    currentSubproblem
  } = useContext(WorkspaceContext);
  const [title, setTitle] = useState<string>('');
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

  return (
    <AddSubproblemContext.Provider
      value={{
        title,
        errors,
        isCriterionDeselectionDisabled:
          _.filter(criterionInclusions).length < 3,
        scaleRangesWarnings,
        missingValueWarnings,
        getIncludedDataSourceForCriterion,
        isCriterionExcluded,
        isDataSourceExcluded,
        isAlternativeExcluded,
        setTitle,
        updateAlternativeInclusion,
        updateCriterionInclusion,
        updateDataSourceInclusion,
        isAlternativeDisabled: isAlternativeDisabledWrapper,
        isDataSourceDeselectionDisabled: isDataSourceDeselectionDisabledWrapper
      }}
    >
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
