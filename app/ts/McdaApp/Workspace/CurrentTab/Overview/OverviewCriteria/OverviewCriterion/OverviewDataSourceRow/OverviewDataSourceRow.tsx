import {TableCell, TableRow} from '@material-ui/core';
import EffectTableDataSourceCells from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectTableDataSourceCells/EffectTableDataSourceCells';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import MoveUpDownButtons from 'app/ts/McdaApp/MoveUpDownButtons/MoveUpDownButtons';
import _ from 'lodash';
import React, {useContext} from 'react';
import {OverviewDataSourceContext} from '../OverviewDataSourceTable/OverviewDataSourceContext/OverviewDataSourceContext';
import EditOverviewDataSourceButton from './EditOverviewDataSourceButton/EditOverviewDataSourceButton';

export default function OverviewDataSourceRow() {
  const {alternatives, swapDataSources} = useContext(WorkspaceContext);
  const {dataSource, previousDataSourceId, nextDataSourceId} = useContext(
    OverviewDataSourceContext
  );

  return (
    <TableRow>
      <EffectTableDataSourceCells
        dataSource={dataSource}
        alternatives={_.values(alternatives)}
      />
      <TableCell align={'center'}>
        <EditOverviewDataSourceButton />
      </TableCell>
      <TableCell align={'center'}>
        <MoveUpDownButtons
          nextId={nextDataSourceId}
          swap={_.partial(swapDataSources, dataSource.criterionId)}
          id={dataSource.id}
          previousId={previousDataSourceId}
        />
      </TableCell>
    </TableRow>
  );
}
