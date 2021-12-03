import ICriterion from '@shared/interface/ICriterion';
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
import {DeterministicWeightsContext} from '../../DeterministicWeightsTable/DeterministicWeightsContext';

interface IPreferencesSensitivityContext {
  criterion: ICriterion;
  parameter: PreferenceSensitivityParameter;
  results: Record<string, Record<number, number>>;
  highestValue: number;
  lowestValue: number;
  setCriterion: (criterion: ICriterion) => void;
  setHighestValue: (value: number) => void;
  setLowestValue: (value: number) => void;
  setParameter: (parameter: PreferenceSensitivityParameter) => void;
}

export const PreferencesSensitivityContext =
  createContext<IPreferencesSensitivityContext>(
    {} as IPreferencesSensitivityContext
  );

export function PreferencesSensitivityContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {filteredCriteria, filteredWorkspace} = useContext(
    CurrentSubproblemContext
  );
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {setError} = useContext(ErrorContext);
  const {deterministicChangeableWeights} = useContext(
    DeterministicWeightsContext
  );

  const [criterion, setCriterion] = useState<ICriterion>(filteredCriteria[0]);
  const [results, setResults] =
    useState<Record<string, Record<number, number>>>();
  const [parameter, setParameter] =
    useState<PreferenceSensitivityParameter>('importance');
  const [lowestValue, setLowestValue] = useState<number>(0.1);
  const [highestValue, setHighestValue] = useState<number>(0.9);

  const getResults = useCallback(
    (pataviProblem: IPataviProblem): void => {
      if (deterministicChangeableWeights) {
        const equivalentChanges: Record<string, number> = _.mapValues(
          deterministicChangeableWeights.equivalentChanges,
          (changeableValue) => changeableValue.originalValue
        );
        const pataviCommand: IPreferencesSensitivityCommand = {
          ...pataviProblem,
          method: 'sensitivityWeightPlot',
          sensitivityAnalysis: {
            parameter,
            criterion: criterion.id,
            lowestValue,
            highestValue,
            equivalentChanges
          }
        };
        setResults(undefined);
        axios
          .post('/api/v2/patavi/preferencesSensitivity', pataviCommand)
          .then((result: AxiosResponse<IPreferencesSensitivityResults>) => {
            setResults(result.data.total);
          })
          .catch(setError);
      }
    },
    [
      criterion.id,
      deterministicChangeableWeights,
      highestValue,
      lowestValue,
      parameter,
      setError
    ]
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
      getResults(pataviProblem);
    }
  }, [
    getResults,
    currentScenario.state.prefs,
    currentScenario.state.weights,
    filteredWorkspace,
    pvfs
  ]);

  return (
    <PreferencesSensitivityContext.Provider
      value={{
        criterion,
        parameter,
        results,
        lowestValue,
        highestValue,
        setCriterion,
        setParameter,
        setLowestValue,
        setHighestValue
      }}
    >
      {children}
    </PreferencesSensitivityContext.Provider>
  );
}
