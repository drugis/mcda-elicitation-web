import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IError from '@shared/interface/IError';
import {IDeterministicResults} from '@shared/interface/Patavi/IDeterministicResults';
import {IDeterministicResultsCommand} from '@shared/interface/Patavi/IDeterministicResultsCommand';
import {IMeasurementsSensitivityCommand} from '@shared/interface/Patavi/IMeasurementsSensitivityCommand';
import {IMeasurementsSensitivityResults} from '@shared/interface/Patavi/IMeasurementsSensitivityResults';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPreferencesSensitivityCommand} from '@shared/interface/Patavi/IPreferencesSensitivityCommand';
import {IPreferencesSensitivityResults} from '@shared/interface/Patavi/IPreferencesSensitivityResults';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {IRecalculatedDeterministicResultsCommand} from '@shared/interface/Patavi/IRecalculatedDeterministicResultsCommand';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TValueProfile} from '@shared/types/TValueProfile';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import IChangeableValue from 'app/ts/interface/ISensitivityValue';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {TProfileCase} from 'app/ts/type/ProfileCase';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {getInitialSensitivityValues} from '../DeterministicResultsUtil';
import IDeterministicResultsContext from './IDeterministicResultsContext';

export const DeterministicResultsContext =
  createContext<IDeterministicResultsContext>(
    {} as IDeterministicResultsContext
  );

export function DeterministicResultsContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const {scales} = useContext(WorkspaceContext);
  const {
    filteredCriteria,
    filteredAlternatives,
    filteredEffects,
    filteredWorkspace
  } = useContext(CurrentSubproblemContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);

  const [sensitivityTableValues, setSensitivityTableValues] = useState<
    Record<string, Record<string, IChangeableValue>>
  >(
    getInitialSensitivityValues(
      filteredCriteria,
      filteredAlternatives,
      filteredEffects,
      scales
    )
  );
  const [recalculatedCells, setRecalculatedCells] = useState<
    IRecalculatedCell[]
  >([]);
  const [weights, setWeights] = useState<IWeights>();
  const [baseTotalValues, setBaseTotalValues] =
    useState<Record<string, number>>();
  const [baseValueProfiles, setBaseValueProfiles] =
    useState<Record<string, Record<string, number>>>();
  const [recalculatedTotalValues, setRecalculatedTotalValues] =
    useState<Record<string, number>>();
  const [recalculatedValueProfiles, setRecalculatedValueProfiles] =
    useState<Record<string, Record<string, number>>>();
  const [valueProfileType, setValueProfileType] =
    useState<TValueProfile>('absolute');

  const [measurementSensitivityCriterion, setMeasurementSensitivityCriterion] =
    useState<ICriterion>(filteredCriteria[0]);
  const [
    measurementSensitivityAlternative,
    setMeasurementSensitivityAlternative
  ] = useState<IAlternative>(filteredAlternatives[0]);
  const [measurementsSensitivityResults, setMeasurementsSensitivityResults] =
    useState<Record<string, Record<number, number>>>();

  const [preferencesSensitivityCriterion, setPreferencesSensitivityCriterion] =
    useState<ICriterion>(filteredCriteria[0]);
  const [preferencesSensitivityResults, setPreferencesSensitivityResults] =
    useState<Record<string, Record<number, number>>>();
  const [areRecalculatedPlotsLoading, setAreRecalculatedPlotsLoading] =
    useState<boolean>(false);

  const [baseReference, setBaseReference] = useState<IAlternative>(
    filteredAlternatives[0]
  );
  const [baseComparator, setBaseComparator] = useState<IAlternative>(
    filteredAlternatives[1]
  );
  const [recalculatedReference, setRecalculatedReference] =
    useState<IAlternative>(filteredAlternatives[0]);
  const [recalculatedComparator, setRecalculatedComparator] =
    useState<IAlternative>(filteredAlternatives[1]);

  function getReference(profileCase: TProfileCase) {
    return profileCase === 'base' ? baseReference : recalculatedReference;
  }

  function getComparator(profileCase: TProfileCase) {
    return profileCase === 'base' ? baseComparator : recalculatedComparator;
  }

  function setReference(profileCase: TProfileCase, value: IAlternative) {
    if (profileCase === 'base') {
      setBaseReference(value);
    } else {
      setRecalculatedReference(value);
    }
  }

  function setComparator(profileCase: TProfileCase, value: IAlternative) {
    if (profileCase === 'base') {
      setBaseComparator(value);
    } else {
      setRecalculatedComparator(value);
    }
  }

  const getDeterministicResults = useCallback(
    (pataviProblem: IPataviProblem): void => {
      const pataviCommand: IDeterministicResultsCommand = {
        ...pataviProblem,
        method: 'deterministic'
      };
      setWeights(undefined);
      setBaseTotalValues(undefined);
      setBaseValueProfiles(undefined);
      axios
        .post('/api/v2/patavi/deterministicResults', pataviCommand)
        .then((result: AxiosResponse<IDeterministicResults>) => {
          setWeights(result.data.weights);
          setBaseTotalValues(result.data.total);
          setBaseValueProfiles(result.data.value);
        })
        .catch(setError);
    },
    [setError]
  );

  const getMeasurementsSensitivityResults = useCallback(
    (pataviProblem: IPataviProblem): void => {
      const pataviCommand: IMeasurementsSensitivityCommand = {
        ...pataviProblem,
        method: 'sensitivityMeasurementsPlot',
        sensitivityAnalysis: {
          alternative: measurementSensitivityAlternative.id,
          criterion: measurementSensitivityCriterion.id
        }
      };
      setMeasurementsSensitivityResults(undefined);
      axios
        .post('/api/v2/patavi/measurementsSensitivity', pataviCommand)
        .then((result: AxiosResponse<IMeasurementsSensitivityResults>) => {
          setMeasurementsSensitivityResults(result.data.total);
        })
        .catch(setError);
    },
    [
      measurementSensitivityAlternative.id,
      measurementSensitivityCriterion.id,
      setError
    ]
  );

  const getPreferencesSensitivityResults = useCallback(
    (pataviProblem: IPataviProblem): void => {
      const pataviCommand: IPreferencesSensitivityCommand = {
        ...pataviProblem,
        method: 'sensitivityWeightPlot',
        sensitivityAnalysis: {
          criterion: preferencesSensitivityCriterion.id
        }
      };
      setPreferencesSensitivityResults(undefined);
      axios
        .post('/api/v2/patavi/preferencesSensitivity', pataviCommand)
        .then((result: AxiosResponse<IPreferencesSensitivityResults>) => {
          setPreferencesSensitivityResults(result.data.total);
        })
        .catch(setError);
    },
    [preferencesSensitivityCriterion.id, setError]
  );

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        filteredWorkspace,
        currentScenario.state.prefs,
        pvfs,
        true
      );
      getDeterministicResults(pataviProblem);
    }
  }, [
    currentScenario.state.prefs,
    filteredWorkspace,
    getDeterministicResults,
    pvfs
  ]);

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        filteredWorkspace,
        currentScenario.state.prefs,
        pvfs,
        true
      );
      getMeasurementsSensitivityResults(pataviProblem);
    }
  }, [
    currentScenario.state.prefs,
    filteredWorkspace,
    getMeasurementsSensitivityResults,
    pvfs
  ]);

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        filteredWorkspace,
        currentScenario.state.prefs,
        pvfs,
        true
      );
      getPreferencesSensitivityResults(pataviProblem);
    }
  }, [
    currentScenario.state.prefs,
    filteredWorkspace,
    getPreferencesSensitivityResults,
    pvfs
  ]);

  function setCurrentValue(
    criterionId: string,
    alternativeId: string,
    newValue: number
  ): void {
    const originalValue =
      sensitivityTableValues[criterionId][alternativeId].originalValue;
    const newValues = {
      ...sensitivityTableValues,
      [criterionId]: {
        ...sensitivityTableValues[criterionId],
        [alternativeId]: {
          originalValue: originalValue,
          currentValue: newValue
        }
      }
    };
    setSensitivityTableValues(newValues);
    const filteredRecalculatedCells = _.reject(
      recalculatedCells,
      (cell: IRecalculatedCell) =>
        cell.criterion === criterionId && cell.alternative === alternativeId
    );
    setRecalculatedCells(
      filteredRecalculatedCells.concat({
        alternative: alternativeId,
        criterion: criterionId,
        value: newValue
      })
    );
  }

  function resetSensitivityTable(): void {
    setSensitivityTableValues(
      getInitialSensitivityValues(
        filteredCriteria,
        filteredAlternatives,
        filteredEffects,
        scales
      )
    );
    setRecalculatedCells([]);
    setRecalculatedTotalValues(undefined);
    setRecalculatedValueProfiles(undefined);
  }

  function recalculateValuePlots(): void {
    setAreRecalculatedPlotsLoading(true);
    const pataviProblem = getPataviProblem(
      filteredWorkspace,
      currentScenario.state.prefs,
      pvfs,
      true
    );

    const pataviCommand: IRecalculatedDeterministicResultsCommand = {
      ...pataviProblem,
      method: 'sensitivityMeasurements',
      sensitivityAnalysis: {
        meas: recalculatedCells
      }
    };

    setRecalculatedTotalValues(undefined);
    setRecalculatedValueProfiles(undefined);
    setAreRecalculatedPlotsLoading(true);

    axios
      .post('/api/v2/patavi/recalculateDeterministicResults', pataviCommand)
      .then((result: AxiosResponse<IDeterministicResults>) => {
        setRecalculatedTotalValues(result.data.total);
        setRecalculatedValueProfiles(result.data.value);
        setAreRecalculatedPlotsLoading(false);
        setRecalculatedReference(baseReference);
        setRecalculatedComparator(baseComparator);
      })
      .catch((error: IError) => {
        setAreRecalculatedPlotsLoading(false);
        setError(error);
      });
  }

  return (
    <DeterministicResultsContext.Provider
      value={{
        areRecalculatedPlotsLoading,
        baseTotalValues,
        baseValueProfiles,
        measurementSensitivityAlternative,
        measurementSensitivityCriterion,
        measurementsSensitivityResults,
        preferencesSensitivityCriterion,
        preferencesSensitivityResults,
        recalculatedTotalValues,
        recalculatedValueProfiles,
        sensitivityTableValues,
        valueProfileType,
        weights,
        getReference,
        getComparator,
        recalculateValuePlots,
        resetSensitivityTable,
        setReference,
        setComparator,
        setCurrentValue,
        setMeasurementSensitivityAlternative,
        setMeasurementSensitivityCriterion,
        setPreferencesSensitivityCriterion,
        setValueProfileType
      }}
    >
      {children}
    </DeterministicResultsContext.Provider>
  );
}
