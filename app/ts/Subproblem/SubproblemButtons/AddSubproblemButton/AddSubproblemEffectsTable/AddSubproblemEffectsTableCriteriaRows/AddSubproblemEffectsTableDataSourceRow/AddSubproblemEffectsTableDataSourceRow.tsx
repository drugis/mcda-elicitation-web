import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
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
  function renderCriterionCells(): JSX.Element {
    if (rowIndex === 0) {
      return <AddSubproblemCriterionCells criterion={criterion} />;
    } else {
      return <></>;
    }
  }

  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      {renderCriterionCells()}
      <AddSubproblemDataSourceCells
        criterion={criterion}
        dataSource={dataSource}
      />
    </TableRow>
  );
}
