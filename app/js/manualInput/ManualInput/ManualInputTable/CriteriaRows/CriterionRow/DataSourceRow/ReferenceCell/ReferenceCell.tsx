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

  function handleChange(newTitle: string) {
    setDataSource(criterion.id, {...dataSource, title: newTitle});
  }

  return (
    <TableCell>
      <InlineEditor
        value={dataSource.title}
        tooltipText={'Edit reference'}
        callback={handleChange}
      />
    </TableCell>
  );
}
