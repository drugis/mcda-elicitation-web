import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {deselectedCellStyle} from 'app/ts/McdaApp/deselectedCellStyle';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function EffectsTableReferenceCell({
  dataSource,
  isExcluded
}: {
  dataSource: IDataSource;
  isExcluded?: boolean;
}) {
  const {
    toggledColumns: {references}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  function renderReference(): JSX.Element | string {
    if (dataSource.referenceLink) {
      return (
        <a target="_blank" href={dataSource.referenceLink}>
          {dataSource.reference}
        </a>
      );
    } else {
      return dataSource.reference;
    }
  }

  return references ? (
    <TableCell id={`reference-${dataSource.id}`} style={cellStyle}>
      {renderReference()}
    </TableCell>
  ) : (
    <></>
  );
}
