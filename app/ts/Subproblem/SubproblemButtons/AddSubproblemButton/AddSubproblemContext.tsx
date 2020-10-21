import {checkTitleErrors} from 'app/ts/util/checkTitleErrors';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {createContext, useContext, useEffect, useState} from 'react';
import IAddSubproblemContext from './IAddSubproblemContext';
import _ from 'lodash';
import IAlternative from '@shared/interface/IAlternative';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import {Distribution} from '@shared/interface/IDistribution';

export const AddSubproblemContext = createContext<IAddSubproblemContext>(
  {} as IAddSubproblemContext
);

export function AddSubproblemContextProviderComponent(props: {children: any}) {
  const {currentSubproblem, subproblems, alternatives, workspace} = useContext(
    WorkspaceContext
  );
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<string[]>(getErrors());
  const [alternativeInclusions, setAlternativeInclusions] = useState<
    Record<string, boolean>
  >(initAlternativeInclusions());
  const baselineMap = getBaselineMap(alternatives, workspace.distributions);

  function initAlternativeInclusions(): Record<string, boolean> {
    return _.mapValues(alternatives, () => {
      return true;
    });
  }

  function getErrors(): string[] {
    const titleError = checkTitleErrors(title, subproblems);
    if (titleError) {
      return [titleError];
    } else {
      return [];
    }
  }

  useEffect(() => {
    setErrors(getErrors());
  }, [title]);

  useEffect(() => {
    // take selections from currentSubproblem
  }, []);

  function updateAlternativeInclusion(id: string, newValue: boolean) {
    let newInclusions = {...alternativeInclusions};
    newInclusions[id] = newValue;
    setAlternativeInclusions(newInclusions);
  }

  function isAlternativeDisabled(id: string) {
    return _.filter(alternativeInclusions).length < 3 || isBaseline(id);
  }

  function isBaseline(id: string) {
    return baselineMap[id];
  }

  function getBaselineMap(
    alternatives: Record<string, IAlternative>,
    distributions: Distribution[]
  ) {
    return _.mapValues(alternatives, (alternative) => {
      return _.some(distributions, (distribution) => {
        return true; //(
        // !distribution.alternative &&
        // alternative.id ===
        //   distribution.performance.distribution.parameters.baseline.name
        //);
      });
    });
  }

  return (
    <AddSubproblemContext.Provider
      value={{
        title,
        errors,
        setTitle,
        updateAlternativeInclusion,
        isAlternativeDisabled
      }}
    >
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
