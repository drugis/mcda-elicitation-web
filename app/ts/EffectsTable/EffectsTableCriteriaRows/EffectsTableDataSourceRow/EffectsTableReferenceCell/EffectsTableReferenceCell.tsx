import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function EffectsTableReferenceCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showRefereces} = useContext(SettingsContext);

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

  return showRefereces ? <TableCell>{renderReference()}</TableCell> : <></>;
}
