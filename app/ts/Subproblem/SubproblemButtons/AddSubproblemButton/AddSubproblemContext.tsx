import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  createSubproblemDefinition,
  getBaselineMap,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  getSubproblemTitleError,
  initConfiguredRanges,
  initializeStepSizeOptions,
  initInclusions,
  intializeStepSizes,
  isAlternativeDeselectionDisabled,
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
    addSubproblem
  } = useContext(WorkspaceContext);
  const {observedRanges} = useContext(SubproblemContext);

  const [dataSourcesById] = useState<Record<string, IDataSource>>(
    _(criteria).flatMap('dataSources').keyBy('id').value()
  );
  const [dataSourcesWithValues] = useState<Record<string, IDataSource>>(
    _(dataSourcesById)
      .filter((dataSource: IDataSource): boolean => {
        return Boolean(observedRanges[dataSource.id]);
      })
      .keyBy('id')
      .value()
  );
  const [baselineMap] = useState<Record<string, boolean>>(
    getBaselineMap(alternatives, workspace.relativePerformances)
  );
  const defaultTitle = 'new problem';

  // *** states
  const [title, setTitle] = useState<string>(defaultTitle);
  const [errors, setErrors] = useState<string[]>(
    getSubproblemTitleError(title, subproblems)
  );

  // const [alternativeInclusions, setAlternativeInclusions] = useState<
  //   Record<string, boolean>
  // >(
  //   initInclusions(
  //     alternatives,
  //     currentSubproblem.definition.excludedAlternatives
  //   )
  // );

  // const [criterionInclusions, setCriterionInclusions] = useState<
  //   Record<string, boolean>
  // >(initInclusions(criteria, currentSubproblem.definition.excludedCriteria));

  // const [dataSourceInclusions, setDataSourceInclusions] = useState<
  //   Record<string, boolean>
  // >(
  //   initInclusions(
  //     dataSourcesById,
  //     currentSubproblem.definition.excludedDataSources
  //   )
  // );

  const [testInclusions, setTestInclusions] = useState({
    alternatives: initInclusions(
      alternatives,
      currentSubproblem.definition.excludedAlternatives
    ),
    criteria: initInclusions(
      criteria,
      currentSubproblem.definition.excludedCriteria
    ),
    dataSources: initInclusions(
      dataSourcesById,
      currentSubproblem.definition.excludedDataSources
    )
  });

  const [scaleRangesWarnings, setScaleRangesWarnings] = useState<string[]>([
    'Loading'
  ]);
  const [missingValueWarnings, setMissingValueWarnings] = useState<string[]>(
    []
  );
  const [configuredRangesByDS, setConfiguredRanges] = useState<
    Record<string, [number, number]>
  >({});
  const [sliderRangesByDS, setSliderRangesByDS] = useState<
    Record<string, [number, number]>
  >({});
  const [stepSizeOptionsByDS, setStepSizeOptionsByDS] = useState<
    Record<string, [number, number, number]>
  >({});
  const [stepSizesByDS, setStepSizesByDS] = useState<Record<string, number>>(
    {}
  );

  // *** end states

  // *** useEffects
  useEffect(() => {
    setErrors(getSubproblemTitleError(title, subproblems));
  }, [title, subproblems]);

  useEffect(() => {
    if (!_.isEmpty(observedRanges)) {
      setScaleRangesWarnings(
        getScaleBlockingWarnings(
          testInclusions.criteria,
          testInclusions.dataSources,
          testInclusions.alternatives,
          workspace,
          observedRanges
        )
      );
    }
    setMissingValueWarnings(
      getMissingValueWarnings(
        testInclusions.dataSources,
        testInclusions.alternatives,
        workspace
      )
    );
  }, [testInclusions, workspace, observedRanges]);

  useEffect(() => {
    if (!_.isEmpty(observedRanges)) {
      const initialConfiguredRanges = initConfiguredRanges(
        dataSourcesWithValues,
        observedRanges,
        currentSubproblem.definition.ranges
      );
      const stepSizeOptions = initializeStepSizeOptions(
        dataSourcesWithValues,
        observedRanges
      );
      const stepSizes = intializeStepSizes(
        stepSizeOptions,
        currentSubproblem.definition.stepSizes
      );
      setConfiguredRanges(initialConfiguredRanges);
      setSliderRangesByDS(initialConfiguredRanges);
      setStepSizesByDS(currentSubproblem.definition.stepSizes);
      setStepSizeOptionsByDS(stepSizeOptions);
      setStepSizesByDS(stepSizes);
    }
  }, [observedRanges, currentSubproblem, dataSourcesWithValues]);
  // *** end useEffects

  function updateAlternativeInclusion(id: string, newValue: boolean) {
    const newInclusions = {
      ...testInclusions,
      alternatives: {...testInclusions.alternatives, [id]: newValue}
    };
    setTestInclusions(newInclusions);
  }

  function updateCriterionInclusion(id: string, newValue: boolean) {
    const newDataSourceInclusions = _(criteria[id].dataSources)
      .keyBy('id')
      .mapValues(() => newValue)
      .value();
    const newInclusions = {
      ...testInclusions,
      criteria: {...testInclusions.criteria, [id]: newValue},
      dataSources: {...testInclusions.dataSources, ...newDataSourceInclusions}
    };

    setTestInclusions(newInclusions);
  }

  function updateDataSourceInclusion(id: string, newValue: boolean): void {
    const newInclusions = {
      ...testInclusions,
      dataSources: {...testInclusions.dataSources, [id]: newValue}
    };
    setTestInclusions(newInclusions);
  }

  function isCriterionExcluded(criterionId: string): boolean {
    return !testInclusions.criteria[criterionId];
  }

  function isDataSourceExcluded(dataSourceId: string): boolean {
    return !testInclusions.dataSources[dataSourceId];
  }

  function isAlternativeExcluded(alternativeId: string): boolean {
    return !testInclusions.alternatives[alternativeId];
  }

  function getIncludedDataSourceForCriterion(
    criterion: ICriterion
  ): IDataSource {
    return _.find(criterion.dataSources, (dataSource: IDataSource) => {
      return testInclusions.dataSources[dataSource.id];
    });
  }

  function isAlternativeDeselectionDisabledWrapper(id: string) {
    return isAlternativeDeselectionDisabled(
      id,
      testInclusions.alternatives,
      baselineMap
    );
  }

  function isDataSourceDeselectionDisabledWrapper(
    criterionId: string,
    dataSourceId: string
  ) {
    return isDataSourceDeselectionDisabled(
      criteria[criterionId],
      testInclusions.dataSources,
      testInclusions.criteria,
      dataSourceId
    );
  }

  function resetToDefault(): void {
    const initialConfiguredRanges = initConfiguredRanges(
      dataSourcesWithValues,
      observedRanges
    );
    setTestInclusions({
      alternatives: _.mapValues(alternatives, () => true),
      criteria: _.mapValues(criteria, () => true),
      dataSources: _.mapValues(dataSourcesById, () => true)
    });
    setConfiguredRanges(initialConfiguredRanges);
    setSliderRangesByDS(initialConfiguredRanges);
    setTitle(defaultTitle);
    setScaleRangesWarnings(['Updating']);
  }

  function addSubproblemWrapper(): void {
    const subproblemCommand: ISubproblemCommand = {
      title: title,
      definition: createSubproblemDefinition(
        testInclusions.criteria,
        testInclusions.dataSources,
        testInclusions.alternatives,
        configuredRangesByDS,
        stepSizesByDS
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

  function getSliderRangeForDS(dataSourceId: string) {
    return sliderRangesByDS[dataSourceId];
  }

  function updateStepSizeForDS(
    dataSourceId: string,
    newStepSize: number
  ): void {
    let newEntry: Record<string, number> = {};
    newEntry[dataSourceId] = newStepSize;
    const newStepSizes = {...stepSizesByDS, ...newEntry};
    setStepSizesByDS(newStepSizes);
  }

  function getStepSizeForDS(dataSourceId: string): number {
    return stepSizesByDS[dataSourceId];
  }

  function getStepSizeOptionsForDS(
    dataSourceId: string
  ): [number, number, number] {
    return stepSizeOptionsByDS[dataSourceId];
  }

  return (
    <AddSubproblemContext.Provider
      value={{
        errors,
        configuredRanges: configuredRangesByDS,
        isCriterionDeselectionDisabled:
          _.filter(testInclusions.criteria).length < 3,
        missingValueWarnings,
        scaleRangesWarnings,
        title,
        addSubproblem: addSubproblemWrapper,
        getIncludedDataSourceForCriterion,
        getSliderRangeForDS,
        isAlternativeDeselectionDisabled: isAlternativeDeselectionDisabledWrapper,
        isAlternativeExcluded,
        isCriterionExcluded,
        isDataSourceDeselectionDisabled: isDataSourceDeselectionDisabledWrapper,
        isDataSourceExcluded,
        resetToDefault,
        setConfiguredRange,
        setTitle,
        updateAlternativeInclusion,
        updateCriterionInclusion,
        updateDataSourceInclusion,
        updateSliderRangeforDS,
        updateStepSizeForDS,
        getStepSizeForDS,
        getStepSizeOptionsForDS
      }}
    >
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
