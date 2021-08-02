import IAlternative from '@shared/interface/IAlternative';
import IError from '@shared/interface/IError';
import {IDeterministicResults} from '@shared/interface/Patavi/IDeterministicResults';
import {IDeterministicResultsCommand} from '@shared/interface/Patavi/IDeterministicResultsCommand';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {IRecalculatedDeterministicResultsCommand} from '@shared/interface/Patavi/IRecalculatedDeterministicResultsCommand';
import {TValueProfile} from '@shared/types/TValueProfile';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
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
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {setError} = useContext(ErrorContext);
  const {filteredAlternatives, filteredWorkspace} = useContext(
    CurrentSubproblemContext
  );

  const [recalculatedCells, setRecalculatedCells] = useState<
    IRecalculatedCell[]
  >([]);
  const [recalculatedTotalValues, setRecalculatedTotalValues] =
    useState<Record<string, number>>();
  const [recalculatedValueProfiles, setRecalculatedValueProfiles] =
    useState<Record<string, Record<string, number>>>();
  const [recalculatedWeights, setRecalculatedWeights] = useState<
    Record<string, number>
  >(currentScenario.state.weights.mean);

  const [valueProfileType, setValueProfileType] =
    useState<TValueProfile>('absolute');
  const [areRecalculatedPlotsLoading, setAreRecalculatedPlotsLoading] =
    useState<boolean>(false);

  //valueprofilecontext
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
  const [baseTotalValues, setBaseTotalValues] =
    useState<Record<string, number>>();
  const [baseValueProfiles, setBaseValueProfiles] =
    useState<Record<string, Record<string, number>>>();

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
      setBaseTotalValues(undefined);
      setBaseValueProfiles(undefined);
      axios
        .post('/api/v2/patavi/deterministicResults', pataviCommand)
        .then((result: AxiosResponse<IDeterministicResults>) => {
          setBaseTotalValues(result.data.total);
          setBaseValueProfiles(result.data.value);
        })
        .catch(setError);
    },
    [setError]
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
      getDeterministicResults(pataviProblem);
    }
  }, [currentScenario, filteredWorkspace, getDeterministicResults, pvfs]);

  function recalculateValuePlots(): void {
    setAreRecalculatedPlotsLoading(true);
    const pataviProblem = getPataviProblem(
      filteredWorkspace,
      currentScenario.state.prefs,
      pvfs,
      {'2.5%': {}, mean: recalculatedWeights, '97.5%': {}},
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
        recalculatedCells,
        recalculatedTotalValues,
        recalculatedValueProfiles,
        valueProfileType,
        recalculatedWeights,
        getReference,
        getComparator,
        recalculateValuePlots,
        setRecalculatedCells,
        setRecalculatedTotalValues,
        setRecalculatedValueProfiles,
        setRecalculatedWeights,
        setReference,
        setComparator,
        setValueProfileType
      }}
    >
      {children}
    </DeterministicResultsContext.Provider>
  );
}
