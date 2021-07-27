import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import {TPreferences} from '@shared/types/Preferences';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {getEquivalentValue} from '../../../../Preferences/EquivalentChange/equivalentChangeUtil';
import {buildImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/PreferencesWeightsTableUtil';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import IDeterministicWeightsContext from './IDeterministicWeightsContext';

export const DeterministicWeightsContext =
  createContext<IDeterministicWeightsContext>(
    {} as IDeterministicWeightsContext
  );

export function DeterministicWeightsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {filteredCriteria, filteredAlternatives, filteredWorkspace} =
    useContext(CurrentSubproblemContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const {partOfInterval, referenceWeight} = useContext(EquivalentChangeContext);
  const {setRecalculatedWeights} = useContext(DeterministicResultsContext);

  const [deterministicChangeableWeights, setDeterministicChangeableWeights] =
    useState<IDeterministicChangeableWeights>(
      buildDeterministicWeights(
        filteredCriteria,
        currentScenario.state.prefs,
        currentScenario.state.weights
      )
    );

  function buildDeterministicWeights(
    criteria: ICriterion[],
    preferences: TPreferences,
    weights: IWeights
  ): IDeterministicChangeableWeights {
    const importances = _.mapValues(
      buildImportances(criteria, preferences),
      (importance: number): IChangeableValue => {
        return {originalValue: importance, currentValue: importance};
      }
    );
    const equivalentChanges = _(criteria)
      .map((criterion: ICriterion): IChangeableValue => {
        return {
          originalValue: getEquivalentValue(
            getUsePercentage(criterion.dataSources[0]),
            weights.mean[criterion.id],
            pvfs[criterion.id],
            partOfInterval,
            referenceWeight
          ),
          currentValue: 1
        };
      })
      .keyBy('id')
      .value();

    return {
      importances,
      weights,
      equivalentChanges,
      partOfInterval
    };
  }

  function setImportance(criterionId: string, value: number) {
    const newValues = recalc();
    setRecalculatedWeights(newValues);
  }

  function setEquivalentValue(criterionId: string, value: number) {
    const newValues = recalc();
    setRecalculatedWeights(newValues);
  }

  function recalc(): IWeights {
    return {} as IWeights;
  }

  return (
    <DeterministicWeightsContext.Provider
      value={{
        deterministicChangeableWeights
      }}
    >
      {children}
    </DeterministicWeightsContext.Provider>
  );
}
