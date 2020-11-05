import TableCell from '@material-ui/core/TableCell';
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
import {deselectedCellStyle} from '../../AddSubproblemEffectsTable';
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
    isCriterionExcluded,
    isDataSourceExcluded,
    isAlternativeExcluded
  } = useContext(AddSubproblemContext);

  const areCriterionCellsExcluded = isCriterionExcluded(criterion.id);
  const areDataSourceCellsExcluded = isDataSourceExcluded(dataSource.id);

  function renderDataSourceCells(): JSX.Element {
    const cellStyle = isDataSourceExcluded(dataSource.id)
      ? deselectedCellStyle
      : {};
    return (
      <>
        <TableCell rowSpan={1} style={cellStyle}>
          <InclusionCell
            itemId={dataSource.id}
            updateInclusion={updateDataSourceInclusion}
            isDeselectionDisabled={isDataSourceDeselectionDisabled(
              criterion.id
            )}
            isExcluded={isDataSourceExcluded(dataSource.id)}
          />
        </TableCell>
        <EffectsTableUnitOfMeasurementCell
          dataSource={dataSource}
          isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
        />

        {renderCells()}
        <EffectsTableStrengthsAndUncertainties
          dataSource={dataSource}
          isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
        />
        <EffectsTableReferenceCell
          dataSource={dataSource}
          isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
        />
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
          isExcluded={
            areCriterionCellsExcluded ||
            areDataSourceCellsExcluded ||
            isAlternativeExcluded(alternative.id)
          }
        />
      );
    });
  }

  function renderCriterionCells(): JSX.Element {
    if (rowIndex === 0) {
      const cellStyle = isCriterionExcluded(criterion.id)
        ? deselectedCellStyle
        : {};
      return (
        <>
          <TableCell rowSpan={criterion.dataSources.length} style={cellStyle}>
            <InclusionCell
              itemId={criterion.id}
              updateInclusion={updateCriterionInclusion}
              isDeselectionDisabled={isCriterionDeselectionDisabled}
              isExcluded={isCriterionExcluded(criterion.id)}
            />
          </TableCell>
          <EffectsTableCriterionTitleCell
            rowIndex={rowIndex}
            criterion={criterion}
            isExcluded={areCriterionCellsExcluded}
          />
          <EffectsTableCriterionDescriptionCell
            criterion={criterion}
            isExcluded={areCriterionCellsExcluded}
          />
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
