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

  const dataSourcesById: Record<string, IDataSource> = _(criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .value();
  const baselineMap: Record<string, boolean> = getBaselineMap(
    alternatives,
    workspace.relativePerformances
  );

  // *** states
  const [title, setTitle] = useState<string>('new problem');
  const [errors, setErrors] = useState<string[]>(getErrors());

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
  const [configuredRangesByDS, setConfiguredRanges] = useState<
    Record<string, [number, number]>
  >({});
  const [sliderRangesByDS, setSliderRangesByDS] = useState<
    Record<string, [number, number]>
  >({});

  // *** end states

  // *** useEffects
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
  useEffect(() => {
    if (!_.isEmpty(observedRanges)) {
      const initialConfiguredRanges = initConfiguredRanges(
        dataSourcesById,
        observedRanges,
        currentSubproblem.definition.ranges
      );
      setConfiguredRanges(initialConfiguredRanges);
      setSliderRangesByDS(initialConfiguredRanges);
    }
  }, [observedRanges, currentSubproblem]);
  // *** end useEffects

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
    const initialConfiguredRanges = initConfiguredRanges(
      dataSourcesById,
      observedRanges
    );
    setCriterionInclusions(_.mapValues(criteria, () => true));
    setDataSourceInclusions(_.mapValues(dataSourcesById, () => true));
    setAlternativeInclusions(_.mapValues(alternatives, () => true));
    setConfiguredRanges(initialConfiguredRanges);
    setSliderRangesByDS(initialConfiguredRanges);
  }

  function addSubproblemWrapper(): void {
    const subproblemCommand: ISubproblemCommand = {
      title: title,
      definition: createSubproblemDefinition(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        configuredRangesByDS
      )
    };
    addSubproblem(subproblemCommand);
  }

  function setConfiguredRange(
    dataSourceId: string,
    lowestConfiguredValue: number,
    highestConfiguredValue: number
  ): void {
    let newRanges = _.cloneDeep(configuredRangesByDS);
    newRanges[dataSourceId] = [lowestConfiguredValue, highestConfiguredValue];
    setConfiguredRanges(newRanges);
  }

  function updateSliderRangeforDS(
    dataSourceId: string,
    newRange: [number, number]
  ): void {
    let newEntry: Record<string, [number, number]> = {};
    newEntry[dataSourceId] = newRange;
    const newSliderRanges = {...sliderRangesByDS, ...newEntry};
    setSliderRangesByDS(newSliderRanges);
  }

  function getSliderRangeForDS(criterionId: string) {
    return sliderRangesByDS[criterionId];
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
        configuredRanges: configuredRangesByDS,
        getIncludedDataSourceForCriterion,
        getSliderRangeForDS,
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
        updateSliderRangeforDS,
        addSubproblem: addSubproblemWrapper
      }}
    >
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
