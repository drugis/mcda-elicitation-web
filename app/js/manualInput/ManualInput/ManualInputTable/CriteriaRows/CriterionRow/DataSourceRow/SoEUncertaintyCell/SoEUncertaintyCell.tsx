import {Box, Grid, TableCell} from '@material-ui/core';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function SoEUncertaintyCell({
  dataSource,
  criterion
}: {
  dataSource: IDataSource;
  criterion: ICriterion;
}) {
  const {setDataSource} = useContext(ManualInputContext);

  function handleSoEChange(newSoE: string) {
    setDataSource(criterion.id, {...dataSource, strengthOfEvidence: newSoE});
  }

  function handleUncertaintyChange(newUncertainty: string) {
    setDataSource(criterion.id, {...dataSource, uncertainty: newUncertainty});
  }

  return (
    <TableCell>
      <Box p={1}>
        <Grid container>
          <Grid item xs={2}>
            <b>SoE: </b>
          </Grid>
          <Grid item xs={10}>
            <InlineEditor
              value={dataSource.strengthOfEvidence}
              tooltipText={'Edit strength of evidence'}
              callback={handleSoEChange}
            />
          </Grid>
          <Grid item xs={2}>
            <b>Unc: </b>
          </Grid>
          <Grid item xs={10}>
            <InlineEditor
              value={dataSource.uncertainty}
              tooltipText={'Edit uncertainty'}
              callback={handleUncertaintyChange}
            />
          </Grid>
        </Grid>
      </Box>
    </TableCell>
  );
}
