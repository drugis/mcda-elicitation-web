import IEffectsTableContext from '@shared/interface/IEffectsTableContext';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import _ from 'lodash';
import React, {createContext} from 'react';

export const EffectsTableContext = createContext<IEffectsTableContext>(
  {} as IEffectsTableContext
);

export function EffectsTableContextProviderComponent({
  children,
  oldWorkspace,
  scales
}: {
  children: any;
  oldWorkspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
}) {
  const workspace: IWorkspace = buildWorkspace(oldWorkspace);
  const {decimal, percentage} = UnitOfMeasurementType;

  function canBePercentage(dataSourceId: string): boolean {
    const unitType = _(workspace.criteria)
      .flatMap('dataSources')
      .find(['id', dataSourceId]).unitOfMeasurement.type;
    return unitType === decimal || unitType === percentage;
  }

  return (
    <EffectsTableContext.Provider
      value={{
        workspace,
        alternatives: workspace.alternatives,
        scales,
        canBePercentage
      }}
    >
      {children}
    </EffectsTableContext.Provider>
  );
}
