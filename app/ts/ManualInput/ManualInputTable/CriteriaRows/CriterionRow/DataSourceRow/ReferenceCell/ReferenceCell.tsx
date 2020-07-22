import {TableCell, Grid} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {ManualInputContext} from 'app/ts//ManualInput/ManualInputContext';
import React, {useContext} from 'react';
import InlineEditor from '../../../../InlineEditor/InlineEditor';
import ReferenceLink from './ReferenceLink/ReferenceLink';

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
    <TableCell id={`ds-reference-${dataSource.id}`} align="center">
      <Grid container>
        <Grid item xs={12}>
          <InlineEditor
            value={dataSource.reference}
            tooltipText={'Edit reference'}
            callback={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ReferenceLink dataSource={dataSource} criterion={criterion} />
        </Grid>
      </Grid>
    </TableCell>
  );
}
