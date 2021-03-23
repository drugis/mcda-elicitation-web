import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {adjustConfiguredRangeForStepSize} from './AddSubproblemScaleRanges/AddSubproblemScaleRangesUtil';
import {
  createSubproblemDefinition,
  getBaselineMap,
  getDataSourcesWithValidValues,
  getInitialStepSizeOptions,
  getIntialStepSizes,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  getSubproblemTitleError,
  initConfiguredRanges,
  initInclusions,
  isAlternativeDeselectionDisabled,
  isDataSourceDeselectionDisabled
} from './AddSubproblemUtil';
import IAddSubproblemContext from './IAddSubproblemContext';

export const AddSubproblemContext = createContext<IAddSubproblemContext>(
  {} as IAddSubproblemContext
);

export function AddSubproblemContextProviderComponent(props: {children: any}) {
  console.log('render context');
  const {
    subproblems,
    alternatives,
    workspace,
    criteria,
    currentSubproblem,
    addSubproblem
  } = useContext(WorkspaceContext);
  const {observedRanges} = useContext(SubproblemContext);

  // *** refs/consts
  const {current: dataSourcesById} = useRef<Record<string, IDataSource>>(
    _(criteria).flatMap('dataSources').keyBy('id').value()
  );
  const {current: dataSourcesWithValidValues} = useRef<
    Record<string, IDataSource>
  >(getDataSourcesWithValidValues(dataSourcesById, observedRanges));
  const {current: baselineMap} = useRef<Record<string, boolean>>(
    getBaselineMap(alternatives, workspace.relativePerformances)
  );
  const defaultTitle = 'new problem';

  // *** states
  const [title, setTitle] = useState<string>(defaultTitle);
  const [errors, setErrors] = useState<string[]>(
    getSubproblemTitleError(title, subproblems)
  );
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
          criterionInclusions,
          dataSourceInclusions,
          alternativeInclusions,
          workspace,
          observedRanges
        )
      );
    }
    setMissingValueWarnings(
      getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      )
    );
  }, [
    workspace,
    observedRanges,
    dataSourceInclusions,
    alternativeInclusions,
    criterionInclusions
  ]);

  useEffect(() => {
    if (!_.isEmpty(observedRanges)) {
      const initialConfiguredRanges = initConfiguredRanges(
        dataSourcesWithValidValues,
        observedRanges,
        currentSubproblem.definition.ranges
      );

      const stepSizeOptions = getInitialStepSizeOptions(
        dataSourcesWithValidValues,
        observedRanges
      );
      const stepSizes = getIntialStepSizes(
        stepSizeOptions,
        currentSubproblem.definition.stepSizes
      );
      setStepSizeOptionsByDS(stepSizeOptions);
      setStepSizesByDS(stepSizes);

      setSliderRangesByDS(initialConfiguredRanges);
      setStepSizesByDS(stepSizes);

      setConfiguredRanges(
        _.mapValues(dataSourcesWithValidValues, (dataSource: IDataSource): [
          number,
          number
        ] =>
          adjustConfiguredRangeForStepSize(
            stepSizes[dataSource.id],
            initialConfiguredRanges[dataSource.id],
            initialConfiguredRanges[dataSource.id]
          )
        )
      );
    }
  }, [observedRanges, currentSubproblem, dataSourcesWithValidValues]);
  // *** end useEffects

  const updateAlternativeInclusion = useCallback(
    (id: string, newValue: boolean): void => {
      setAlternativeInclusions({...alternativeInclusions, [id]: newValue});
    },
    [alternativeInclusions]
  );

  const updateCriterionInclusion = useCallback(
    (id: string, newValue: boolean): void => {
      const newDataSourceInclusions = _(criteria[id].dataSources)
        .keyBy('id')
        .mapValues(() => newValue)
        .value();

      setScaleRangesWarnings(['Updating']);
      setCriterionInclusions({...criterionInclusions, [id]: newValue});
      setDataSourceInclusions({
        ...dataSourceInclusions,
        ...newDataSourceInclusions
      });
    },
    [criteria, criterionInclusions, dataSourceInclusions]
  );

  const updateDataSourceInclusion = useCallback(
    (id: string, newValue: boolean): void => {
      setScaleRangesWarnings(['Updating']);
      setDataSourceInclusions({
        ...dataSourceInclusions,
        [id]: newValue
      });
    },
    [dataSourceInclusions]
  );

  const isCriterionExcluded = useCallback(
    (criterionId: string): boolean => {
      return !criterionInclusions[criterionId];
    },
    [criterionInclusions]
  );

  const isDataSourceExcluded = useCallback(
    (dataSourceId: string): boolean => {
      return !dataSourceInclusions[dataSourceId];
    },
    [dataSourceInclusions]
  );

  const isAlternativeExcluded = useCallback(
    (alternativeId: string): boolean => {
      return !alternativeInclusions[alternativeId];
    },
    [alternativeInclusions]
  );

  const getIncludedDataSourceForCriterion = useCallback(
    (criterion: ICriterion): IDataSource => {
      return _.find(
        criterion.dataSources,
        (dataSource: IDataSource) => dataSourceInclusions[dataSource.id]
      );
    },
    [dataSourceInclusions]
  );

  const isAlternativeDeselectionDisabledWrapper = useCallback(
    (id: string): boolean => {
      return isAlternativeDeselectionDisabled(
        id,
        alternativeInclusions,
        baselineMap
      );
    },
    [alternativeInclusions, baselineMap]
  );

  const isDataSourceDeselectionDisabledWrapper = useCallback(
    (criterionId: string, dataSourceId: string): boolean => {
      return isDataSourceDeselectionDisabled(
        criteria[criterionId],
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
    },
    [criteria, criterionInclusions, dataSourceInclusions]
  );

  const resetToDefault = useCallback((): void => {
    const initialConfiguredRanges = initConfiguredRanges(
      dataSourcesWithValidValues,
      observedRanges
    );
    setAlternativeInclusions(_.mapValues(alternatives, () => true));
    setCriterionInclusions(_.mapValues(criteria, () => true));
    setDataSourceInclusions(_.mapValues(dataSourcesById, () => true));
    setConfiguredRanges(initialConfiguredRanges);
    setSliderRangesByDS(initialConfiguredRanges);
    setTitle(defaultTitle);
    setScaleRangesWarnings(['Updating']);
  }, [
    alternatives,
    criteria,
    dataSourcesById,
    dataSourcesWithValidValues,
    observedRanges
  ]);

  const addSubproblemWrapper = useCallback((): void => {
    const subproblemCommand: ISubproblemCommand = {
      title: title,
      definition: createSubproblemDefinition(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        configuredRangesByDS,
        stepSizesByDS
      )
    };
    addSubproblem(subproblemCommand);
  }, [
    addSubproblem,
    alternativeInclusions,
    configuredRangesByDS,
    criterionInclusions,
    dataSourceInclusions,
    stepSizesByDS,
    title
  ]);

  const setConfiguredRange = useCallback(
    (
      dataSourceId: string,
      lowestConfiguredValue: number,
      highestConfiguredValue: number
    ): void => {
      setConfiguredRanges({
        ...configuredRangesByDS,
        [dataSourceId]: [lowestConfiguredValue, highestConfiguredValue]
      });
    },
    [setConfiguredRanges, configuredRangesByDS]
  );

  const updateSliderRangeforDS = useCallback(
    (dataSourceId: string, newRange: [number, number]): void => {
      setSliderRangesByDS({...sliderRangesByDS, [dataSourceId]: newRange});
    },
    [setSliderRangesByDS, sliderRangesByDS]
  );

  const getSliderRangeForDS = useCallback(
    (dataSourceId: string) => {
      return sliderRangesByDS[dataSourceId];
    },
    [sliderRangesByDS]
  );

  const updateStepSizeForDS = useCallback(
    (dataSourceId: string, newStepSize: number): void => {
      const newStepSizes = {...stepSizesByDS, [dataSourceId]: newStepSize};
      setStepSizesByDS(newStepSizes);
      const configuredRange = configuredRangesByDS[dataSourceId];
      const [newMin, newMax] = adjustConfiguredRangeForStepSize(
        newStepSize,
        configuredRangesByDS[dataSourceId],
        sliderRangesByDS[dataSourceId]
      );
      if (!_.isEqual(configuredRange, [newMin, newMax])) {
        setConfiguredRange(dataSourceId, newMin, newMax);
      }
    },
    [configuredRangesByDS, setConfiguredRange, sliderRangesByDS, stepSizesByDS]
  );

  const getStepSizeForDS = useCallback(
    (dataSourceId: string): number => {
      return stepSizesByDS[dataSourceId];
    },
    [stepSizesByDS]
  );

  const getStepSizeOptionsForDS = useCallback(
    (dataSourceId: string): [number, number, number] => {
      return stepSizeOptionsByDS[dataSourceId];
    },
    [stepSizeOptionsByDS]
  );

  return (
    <AddSubproblemContext.Provider
      value={{
        errors,
        configuredRanges: configuredRangesByDS,
        isCriterionDeselectionDisabled:
          _.filter(criterionInclusions).length < 3,
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
