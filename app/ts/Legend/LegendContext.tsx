import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {PreferencesContext} from '../PreferencesTab/PreferencesContext';
import {SubproblemContext} from '../Workspace/SubproblemContext/SubproblemContext';
import {ILegendContext} from './ILegendContext';

export const LegendContext = createContext<ILegendContext>(
  {} as ILegendContext
);

export function LegendContextProviderComponent({children}: {children: any}) {
  const {currentScenario, updateScenario} = useContext(PreferencesContext);
  const {filteredAlternatives} = useContext(SubproblemContext);

  const [legend, setLegend] = useState<Record<string, string>>();

  useEffect(() => {
    if (currentScenario.state.legend) {
      setLegend(_.mapValues(currentScenario.state.legend, 'newTitle'));
    }
  }, []);

  function saveLegend(newLegend: Record<string, string>): void {
    setLegend(newLegend);
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
    <LegendContext.Provider value={{legend, saveLegend}}>
      {children}
    </LegendContext.Provider>
  );
}
