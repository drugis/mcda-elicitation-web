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
  useState
} from 'react';
import {adjustConfiguredRangeForStepSize} from './AddSubproblemScaleRanges/AddSubproblemScaleRangesUtil';
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

      setSliderRangesByDS(initialConfiguredRanges);
      setStepSizesByDS(currentSubproblem.definition.stepSizes);
      setStepSizeOptionsByDS(stepSizeOptions);
      setStepSizesByDS(stepSizes);

      setConfiguredRanges(
        _.mapValues(
          dataSourcesWithValues,
          (dataSource: IDataSource): [number, number] =>
            adjustConfiguredRangeForStepSize(
              stepSizes[dataSource.id],
              initialConfiguredRanges[dataSource.id],
              initialConfiguredRanges[dataSource.id]
            ) //FIXME check if configured range is valid
        )
      );
    }
  }, [observedRanges, currentSubproblem, dataSourcesWithValues]);
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
      dataSourcesWithValues,
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
    dataSourcesWithValues,
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
      let newRanges = _.cloneDeep(configuredRangesByDS);
      newRanges[dataSourceId] = [lowestConfiguredValue, highestConfiguredValue];
      setConfiguredRanges(newRanges);
    },
    [configuredRangesByDS]
  );

  const updateSliderRangeforDS = useCallback(
    (dataSourceId: string, newRange: [number, number]): void => {
      let newEntry: Record<string, [number, number]> = {};
      newEntry[dataSourceId] = newRange;
      const newSliderRanges = {...sliderRangesByDS, ...newEntry};
      setSliderRangesByDS(newSliderRanges);
    },
    [sliderRangesByDS]
  );

  const getSliderRangeForDS = useCallback(
    (dataSourceId: string) => {
      return sliderRangesByDS[dataSourceId];
    },
    [sliderRangesByDS]
  );

  const updateStepSizeForDS = useCallback(
    (dataSourceId: string, newStepSize: number): void => {
      let newEntry: Record<string, number> = {};
      newEntry[dataSourceId] = newStepSize;
      const newStepSizes = {...stepSizesByDS, ...newEntry};
      setStepSizesByDS(newStepSizes);
    },
    [stepSizesByDS]
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
