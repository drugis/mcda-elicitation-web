import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
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

  return (
    <ShowIf condition={references}>
      <TableCell id={`reference-${dataSource.id}`} style={cellStyle}>
        {renderReference()}
      </TableCell>
    </ShowIf>
  );
}
