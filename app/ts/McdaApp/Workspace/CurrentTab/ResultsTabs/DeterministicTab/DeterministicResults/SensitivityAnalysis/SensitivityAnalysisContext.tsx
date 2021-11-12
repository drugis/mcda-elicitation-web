import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {IMeasurementsSensitivityCommand} from '@shared/interface/Patavi/IMeasurementsSensitivityCommand';
import {IMeasurementsSensitivityResults} from '@shared/interface/Patavi/IMeasurementsSensitivityResults';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPreferencesSensitivityCommand} from '@shared/interface/Patavi/IPreferencesSensitivityCommand';
import {IPreferencesSensitivityResults} from '@shared/interface/Patavi/IPreferencesSensitivityResults';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import ISensitivityAnalysisContext from './ISensitivityAnalysisContext';

export const SensitivityAnalysisContext =
  createContext<ISensitivityAnalysisContext>({} as ISensitivityAnalysisContext);

export function SensitivityAnalysisContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);

  const {filteredCriteria, filteredAlternatives, filteredWorkspace} =
    useContext(CurrentSubproblemContext);
  const {setError} = useContext(ErrorContext);

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
  const [preferencesSensitivityParameter, setPreferencesSensitivityParameter] =
    useState<PreferenceSensitivityParameter>('importance');
  const [
    preferencesSensitivityLowestValue,
    setPreferencesSensitivityLowestValue
  ] = useState<number>(0.1);
  const [
    preferencesSensitivityHighestValue,
    setPreferencesSensitivityHighestValue
  ] = useState<number>(0.9);

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
        currentScenario.state.weights,
        true
      );
      getMeasurementsSensitivityResults(pataviProblem);
    }
  }, [
    getMeasurementsSensitivityResults, // memo: 2 useEffects because transitive dependency
    currentScenario.state.prefs,
    currentScenario.state.weights,
    filteredWorkspace,
    pvfs
  ]);

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        filteredWorkspace,
        currentScenario.state.prefs,
        pvfs,
        currentScenario.state.weights,
        true
      );
      getPreferencesSensitivityResults(pataviProblem);
    }
  }, [
    getPreferencesSensitivityResults, // memo: 2 useEffects because transitive dependency
    currentScenario.state.prefs,
    currentScenario.state.weights,
    filteredWorkspace,
    pvfs
  ]);

  return (
    <SensitivityAnalysisContext.Provider
      value={{
        measurementSensitivityAlternative,
        measurementSensitivityCriterion,
        measurementsSensitivityResults,
        preferencesSensitivityCriterion,
        preferencesSensitivityHighestValue,
        preferencesSensitivityLowestValue,
        preferencesSensitivityParameter,
        preferencesSensitivityResults,
        setMeasurementSensitivityAlternative,
        setMeasurementSensitivityCriterion,
        setPreferencesSensitivityCriterion,
        setPreferencesSensitivityHighestValue,
        setPreferencesSensitivityLowestValue,
        setPreferencesSensitivityParameter
      }}
    >
      {children}
    </SensitivityAnalysisContext.Provider>
  );
}
