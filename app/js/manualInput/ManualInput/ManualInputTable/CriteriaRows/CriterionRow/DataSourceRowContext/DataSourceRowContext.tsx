import React, {createContext} from 'react';
import ICriterion from '../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../interface/IDataSource';
import IDataSourceRowContext from '../../../../../../interface/IDataSourceRowContext';

export const DataSourceRowContext = createContext<IDataSourceRowContext>(
  {} as IDataSourceRowContext
);

export function DataSourceRowContextProviderComponent({
  criterion,
  dataSourceId,
  previousCriterion,
  nextCriterion,
  previousDataSource,
  nextDataSource,
  children
}: {
  criterion: ICriterion;
  dataSourceId: string;
  previousCriterion: ICriterion | undefined;
  nextCriterion: ICriterion | undefined;
  previousDataSource: IDataSource | undefined;
  nextDataSource: IDataSource | undefined;
  children: any;
}) {
  return (
    <DataSourceRowContext.Provider
      value={{
        criterion: criterion,
        dataSourceId: dataSourceId,
        previousCriterion: previousCriterion,
        nextCriterion: nextCriterion,
        previousDataSource: previousDataSource,
        nextDataSource: nextDataSource
      }}
    >
      {children}
    </DataSourceRowContext.Provider>
  );
}
