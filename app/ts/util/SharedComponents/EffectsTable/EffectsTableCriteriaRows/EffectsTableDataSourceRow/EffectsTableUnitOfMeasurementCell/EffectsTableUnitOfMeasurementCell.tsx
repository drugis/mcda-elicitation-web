import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import {useContext} from 'react';

export default function EffectsTableUnitOfMeasurementCell({
  dataSource,
  isExcluded
}: {
  dataSource: IDataSource;
  isExcluded?: boolean;
}) {
  const {
    showPercentages,
    toggledColumns: {units}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <ShowIf condition={units}>
      <TableCell id={`unit-cell-${dataSource.id}`} style={cellStyle}>
        {getUnitLabel(dataSource.unitOfMeasurement, showPercentages)}
      </TableCell>
    </ShowIf>
  );
}
