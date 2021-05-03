import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import React from 'react';
import AddSubproblemCriterionCells from './AddSubproblemCriterionCells/AddSubproblemCriterionCells';
import AddSubproblemDataSourceCells from './AddSubproblemDataSourceCells/AddSubproblemDataSourceCells';

export default function AddSubproblemEffectsTableDataSourceRow({
  criterion,
  dataSource,
  rowIndex
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  rowIndex: number;
}) {
  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      <ShowIf condition={rowIndex === 0}>
        <AddSubproblemCriterionCells criterion={criterion} />
      </ShowIf>
      <AddSubproblemDataSourceCells
        criterion={criterion}
        dataSource={dataSource}
      />
    </TableRow>
  );
}
