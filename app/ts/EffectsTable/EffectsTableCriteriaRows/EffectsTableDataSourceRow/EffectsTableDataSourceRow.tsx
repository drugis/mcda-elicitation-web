import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import EffectsTableCriterionDescriptionCell from './EffectsTableCriterionDescriptionCell/EffectsTableCriterionDescriptionCell';
import EffectsTableCriterionTitleCell from './EffectsTableCriterionTitleCell/EffectsTableCriterionTitleCell';
import EffectsTableReferenceCell from './EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from './EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from './EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import ValueCell from './ValueCell/ValueCell';

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

  function renderDataSourceCells(): JSX.Element {
    return (
      <>
        <EffectsTableUnitOfMeasurementCell dataSource={dataSource} />
        {renderCells()}
        <EffectsTableStrengthsAndUncertainties dataSource={dataSource} />
        <EffectsTableReferenceCell dataSource={dataSource} />
      </>
    );
  }

  function renderCells(): JSX.Element[] {
    return _.map(filteredAlternatives, (alternative: IAlternative) => {
      return (
        <ValueCell
          key={alternative.id}
          alternativeId={alternative.id}
          dataSourceId={dataSource.id}
        />
      );
    });
  }

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
      {renderDataSourceCells()}
    </TableRow>
  );
}
