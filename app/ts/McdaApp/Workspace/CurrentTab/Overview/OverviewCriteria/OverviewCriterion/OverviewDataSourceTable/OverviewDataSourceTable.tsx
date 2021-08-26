import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IDataSource from '@shared/interface/IDataSource';
import EffectsTableAlternativeHeaders from 'app/ts/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import {OverviewCriterionContext} from 'app/ts/McdaApp/Workspace/CurrentTab/Overview/OverviewCriteria/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import _ from 'lodash';
import {useContext} from 'react';
import OverviewDataSourceRow from '../OverviewDataSourceRow/OverviewDataSourceRow';
import {OverviewDataSourceContextProviderComponent} from './OverviewDataSourceContext/OverviewDataSourceContext';

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
