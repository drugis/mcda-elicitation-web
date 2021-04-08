import TableRow from '@material-ui/core/TableRow';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {useContext} from 'react';
import EffectsTableCriterionDescriptionCell from './EffectsTableCriterionDescriptionCell/EffectsTableCriterionDescriptionCell';
import EffectsTableCriterionTitleCell from './EffectsTableCriterionTitleCell/EffectsTableCriterionTitleCell';
import EffectTableDataSourceCells from './EffectTableDataSourceCells/EffectTableDataSourceCells';

export default function EffectsTableDataSourceRow({
  criterion,
  dataSource,
  rowIndex
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  rowIndex: number;
}) {
  const {filteredAlternatives} = useContext(SubproblemContext);

  function renderCriterionCells(): JSX.Element {
    if (rowIndex === 0) {
      return (
        <>
          <EffectsTableCriterionTitleCell criterion={criterion} />
          <EffectsTableCriterionDescriptionCell criterion={criterion} />
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      {renderCriterionCells()}
      <EffectTableDataSourceCells
        dataSource={dataSource}
        alternatives={filteredAlternatives}
      />
    </TableRow>
  );
}
