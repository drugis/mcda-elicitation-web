import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import EffectsTableCriterionDescriptionCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionDescriptionCell/EffectsTableCriterionDescriptionCell';
import EffectsTableCriterionTitleCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionTitleCell/EffectsTableCriterionTitleCell';
import EffectsTableReferenceCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import ValueCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/ValueCell';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AddSubproblemContext} from '../../../AddSubproblemContext';
import InclusionCell from '../../InclusionCell/InclusionCell';

export default function AddSubproblemEffectsTableDataSourceRow({
  criterion,
  dataSource,
  rowIndex
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  rowIndex: number;
}) {
  const {alternatives} = useContext(WorkspaceContext);
  const {
    updateCriterionInclusion,
    isCriterionDeselectionDisabled,
    isDataSourceDeselectionDisabled,
    updateDataSourceInclusion,
    isRowExcluded
  } = useContext(AddSubproblemContext);

  function renderDataSourceCells(): JSX.Element {
    return (
      <>
        <InclusionCell
          itemId={dataSource.id}
          updateInclusion={updateDataSourceInclusion}
          isDeselectionDisabled={isDataSourceDeselectionDisabled(criterion.id)}
          rowSpan={1}
        />
        <EffectsTableUnitOfMeasurementCell dataSource={dataSource} />

        {renderCells()}
        <EffectsTableStrengthsAndUncertainties dataSource={dataSource} />
        <EffectsTableReferenceCell dataSource={dataSource} />
      </>
    );
  }

  function renderCells(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
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
          <InclusionCell
            itemId={criterion.id}
            updateInclusion={updateCriterionInclusion}
            isDeselectionDisabled={isCriterionDeselectionDisabled}
            rowSpan={criterion.dataSources.length}
          />
          <EffectsTableCriterionTitleCell
            rowIndex={rowIndex}
            criterion={criterion}
          />
          <EffectsTableCriterionDescriptionCell criterion={criterion} />
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <TableRow
      id={`criterion-row-${criterion.id}`}
      style={
        isRowExcluded(criterion.id, dataSource.id)
          ? {backgroundColor: 'gray'}
          : {}
      }
    >
      {renderCriterionCells()}
      {renderDataSourceCells()}
    </TableRow>
  );
}
