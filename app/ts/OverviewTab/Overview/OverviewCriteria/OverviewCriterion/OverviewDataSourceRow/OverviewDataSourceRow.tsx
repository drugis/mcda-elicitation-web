import {IconButton, TableCell, TableRow, Tooltip} from '@material-ui/core';
import EffectTableDataSourceCells from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectTableDataSourceCells/EffectTableDataSourceCells';
import MoveUpDownButtons from 'app/ts/MoveUpDownButtons/MoveUpDownButtons';
import React, {useContext} from 'react';
import Edit from '@material-ui/icons/Edit';
import _ from 'lodash';
import IDataSource from '@shared/interface/IDataSource';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';

export default function OverviewDataSourceRow({
  dataSource,
  nextId,
  previousId
}: {
  dataSource: IDataSource;
  nextId: string;
  previousId: string;
}) {
  const {alternatives, swapDataSources} = useContext(WorkspaceContext);

  return (
    <TableRow>
      <TableCell align={'center'}>
        <MoveUpDownButtons
          nextId={nextId}
          swap={_.partial(swapDataSources, dataSource.criterionId)}
          id={dataSource.id}
          previousId={previousId}
        />
      </TableCell>
      <EffectTableDataSourceCells
        dataSource={dataSource}
        alternatives={_.values(alternatives)}
      />
      <TableCell align={'center'}>
        <Tooltip title="Edit data source">
          <IconButton color="primary">
            <Edit />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
