import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, {useContext} from 'react';
import _ from 'lodash';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import EffectsTableAlternativeHeaders from 'app/ts/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import IDataSource from '@shared/interface/IDataSource';
import OverviewDataSourceRow from '../OverviewDataSourceRow/OverviewDataSourceRow';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import {OverviewDataSourceContextProviderComponent} from './OverviewDataSourceContext/OverviewDataSourceContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {OverviewCriterionContext} from 'app/ts/McdaApp/Workspace/CurrentTab/Overview/OverviewCriteria/OverviewCriterionContext/OverviewCriterionContext';

export default function OverviewDataSourceTable() {
  const {alternatives} = useContext(WorkspaceContext);
  const {dataSources} = useContext(OverviewCriterionContext);

  function renderDataSourceRows(dataSources: IDataSource[]): JSX.Element[] {
    return _.map(dataSources, renderDataSourceRow);
  }

  function renderDataSourceRow(
    dataSource: IDataSource,
    index: number
  ): JSX.Element {
    const previousDSId = getPreviousId(index, dataSources);
    const nextDSId = getNextId(index, dataSources);
    return (
      <OverviewDataSourceContextProviderComponent
        key={dataSource.id}
        dataSource={dataSource}
        previousDataSourceId={previousDSId}
        nextDataSourceId={nextDSId}
        index={index}
      >
        <OverviewDataSourceRow key={dataSource.id} />
      </OverviewDataSourceContextProviderComponent>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <UnitsHeader />
          <EffectsTableAlternativeHeaders
            alternatives={_.values(alternatives)}
          />
          <SoEUncHeader />
          <ReferencesHeader />
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{renderDataSourceRows(dataSources)}</TableBody>
    </Table>
  );
}
