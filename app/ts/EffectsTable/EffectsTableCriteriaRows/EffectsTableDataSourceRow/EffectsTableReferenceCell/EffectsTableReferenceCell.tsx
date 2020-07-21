import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import React, { useContext } from 'react';

export default function EffectsTableReferenceCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showRefereces} = useContext(SettingsContext);
  return showRefereces ? (
    <TableCell>{dataSource.reference}</TableCell>
  ) : (
    <></>
  );
}
