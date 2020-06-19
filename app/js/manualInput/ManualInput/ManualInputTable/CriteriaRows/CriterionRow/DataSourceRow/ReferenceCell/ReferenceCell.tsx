import {TableCell} from '@material-ui/core';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function ReferenceCell({
  dataSource,
  criterion
}: {
  dataSource: IDataSource;
  criterion: ICriterion;
}) {
  const {setDataSource} = useContext(ManualInputContext);

  function handleChange(newReference: string) {
    setDataSource(criterion.id, {...dataSource, reference: newReference});
  }

  return (
    <TableCell align="center">
      <InlineEditor
        value={dataSource.reference}
        tooltipText={'Edit reference'}
        callback={handleChange}
      />
    </TableCell>
  );
}
