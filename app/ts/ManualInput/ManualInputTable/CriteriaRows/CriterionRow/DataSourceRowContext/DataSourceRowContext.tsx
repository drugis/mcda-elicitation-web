import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IDataSourceRowContext from '@shared/interface/IDataSourceRowContext';
import React, {createContext} from 'react';

export const DataSourceRowContext = createContext<IDataSourceRowContext>(
  {} as IDataSourceRowContext
);

export function DataSourceRowContextProviderComponent({
  criterion,
  dataSource,
  previousCriterion,
  nextCriterion,
  previousDataSource,
  nextDataSource,
  children
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
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
        dataSource: dataSource,
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
