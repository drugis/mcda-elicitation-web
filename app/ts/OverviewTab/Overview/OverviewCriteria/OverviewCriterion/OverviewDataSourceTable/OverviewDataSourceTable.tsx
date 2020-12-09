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
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';

export default function OverviewDataSourceTable({
  dataSources
}: {
  dataSources: IDataSource[];
}) {
  const {alternatives} = useContext(WorkspaceContext);

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
      <OverviewDataSourceRow
        key={dataSource.id}
        dataSource={dataSource}
        previousId={previousDSId}
        nextId={nextDSId}
      />
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <b>Data sources:</b>
      </Grid>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <UnitsHeader />
              <EffectsTableAlternativeHeaders
                alternatives={_.values(alternatives)}
              />
              <SoEUncHeader />
              <ReferencesHeader />
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderDataSourceRows(dataSources)}</TableBody>
        </Table>
      </Grid>
    </>
  );
}
