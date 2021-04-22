import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {CurrentScenarioContext} from '../Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from '../Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import {ILegendContext} from './ILegendContext';

export const LegendContext = createContext<ILegendContext>(
  {} as ILegendContext
);

export function LegendContextProviderComponent({
  canEdit,
  children
}: {
  canEdit: boolean;
  children: any;
}) {
  const {currentScenario, updateScenario} = useContext(CurrentScenarioContext);
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  const [legendByAlternativeId, setLegendByAlternativeId] = useState<
    Record<string, string>
  >();

  useEffect(() => {
    if (currentScenario.state.legend) {
      setLegendByAlternativeId(
        _.mapValues(currentScenario.state.legend, 'newTitle')
      );
    }
  }, [currentScenario.state.legend]);

  function saveLegend(newLegend: Record<string, string>): void {
    setLegendByAlternativeId(newLegend);
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        legend: buildLegend(filteredAlternatives, newLegend)
      }
    });
  }

  function buildLegend(
    alternatives: IAlternative[],
    legend: Record<string, string>
  ): Record<string, {baseTitle: string; newTitle: string}> {
    return _(alternatives)
      .keyBy('id')
      .mapValues((alternative: IAlternative) => {
        return {baseTitle: alternative.title, newTitle: legend[alternative.id]};
      })
      .value();
  }

  return (
    <LegendContext.Provider
      value={{canEdit, legendByAlternativeId, saveLegend}}
    >
      {children}
    </LegendContext.Provider>
  );
}
