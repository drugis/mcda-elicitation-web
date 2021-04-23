import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import {getDataSourcesById} from '@shared/util';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContext} from 'app/ts/McdaApp/Workspace/SubproblemsContext/SubproblemsContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {calculateObservedRanges} from '../../ScaleRanges/ScalesTable/ScalesTableUtil';
import {
  adjustConfiguredRangeForStepSize,
  getStepSizeAdjustedConfiguredRanges
} from './AddSubproblemScaleRanges/AddSubproblemScaleRangesUtil';
import {
  createSubproblemDefinition,
  getBaselineMap,
  getDataSourcesWithValidValues,
  getInitialStepSizeOptions as getStepSizeOptions,
  getIntialStepSizes as getStepSizes,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  getSubproblemTitleError,
  initConfiguredRanges as getConfiguredRanges,
  initInclusions,
  isAlternativeDeselectionDisabled,
  isDataSourceDeselectionDisabled
} from './AddSubproblemUtil';
import IAddSubproblemContext from './IAddSubproblemContext';

export const AddSubproblemContext = createContext<IAddSubproblemContext>(
  {} as IAddSubproblemContext
);

export function AddSubproblemContextProviderComponent(props: {children: any}) {
  const {alternatives, workspace, criteria, scales} = useContext(
    WorkspaceContext
  );
  const {observedRanges: initialObservedRanges, currentSubproblem} = useContext(
    CurrentSubproblemContext
  );
  const {subproblems, addSubproblem} = useContext(SubproblemsContext);

  // *** refs/consts
  const {current: dataSourcesById} = useRef<Record<string, IDataSource>>(
    getDataSourcesById(criteria)
  );
  const dataSourcesWithValidValues = useMemo<
    Record<string, IDataSource>
  >(() => {
    return getDataSourcesWithValidValues(
      dataSourcesById,
      calculateObservedRanges(scales, workspace)
    );
  }, [dataSourcesById, scales, workspace]);
  const baselineMap = useMemo<Record<string, boolean>>(() => {
    return getBaselineMap(alternatives, workspace.relativePerformances);
  }, [alternatives, workspace.relativePerformances]);
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
  const [observedRanges, setObservedRanges] = useState<
    Record<string, [number, number]>
  >(initialObservedRanges);
  // *** end states

  // *** useEffects
  useEffect(() => {
    setErrors(getSubproblemTitleError(title, subproblems));
  }, [title, subproblems]);

  useEffect(() => {
    const includedCriteria = _.filter(
      workspace.criteria,
      (criterion: ICriterion) => criterionInclusions[criterion.id]
    );
    const includedAlternatives = _.filter(
      workspace.alternatives,
      (alternative: IAlternative) => alternativeInclusions[alternative.id]
    );
    const updatedObservedRanges = calculateObservedRanges(scales, {
      //included datasources?
      ...workspace,
      criteria: includedCriteria,
      alternatives: includedAlternatives
    });
    setObservedRanges(updatedObservedRanges);
    const newScaleWarnings = getScaleBlockingWarnings(
      criterionInclusions,
      dataSourceInclusions,
      alternativeInclusions,
      workspace,
      updatedObservedRanges
    );
    setScaleRangesWarnings(newScaleWarnings);
    setMissingValueWarnings(
      getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      )
    );
    if (newScaleWarnings.length === 0) {
      const includedDataSourcesWithValidValues = _.pickBy(
        dataSourcesWithValidValues,
        (_, id: string) => Boolean(updatedObservedRanges[id])
      );
      const newConfiguredRanges = getConfiguredRanges(
        includedDataSourcesWithValidValues,
        updatedObservedRanges,
        currentSubproblem.definition.ranges
      );

      const stepSizeOptions = getStepSizeOptions(
        includedDataSourcesWithValidValues,
        updatedObservedRanges
      );
      const stepSizes = getStepSizes(
        stepSizeOptions,
        currentSubproblem.definition.stepSizes
      );
      setStepSizeOptionsByDS(stepSizeOptions);
      setStepSizesByDS(stepSizes);

      setSliderRangesByDS(newConfiguredRanges);
      setStepSizesByDS(stepSizes);

      setConfiguredRanges(
        getStepSizeAdjustedConfiguredRanges(
          includedDataSourcesWithValidValues,
          stepSizes,
          newConfiguredRanges
        )
      );
    }
  }, [
    alternativeInclusions,
    criterionInclusions,
    currentSubproblem.definition.ranges,
    currentSubproblem.definition.stepSizes,
    dataSourceInclusions,
    dataSourcesWithValidValues,
    scales,
    workspace
  ]);

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
    const allObservedRanges = calculateObservedRanges(scales, workspace);
    const initialConfiguredRanges = getConfiguredRanges(
      dataSourcesWithValidValues,
      allObservedRanges
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
    scales,
    workspace
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
        newObservedRanges: observedRanges,
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
