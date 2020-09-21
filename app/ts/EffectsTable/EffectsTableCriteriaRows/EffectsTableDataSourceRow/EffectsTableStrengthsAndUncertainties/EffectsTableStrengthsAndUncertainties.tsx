import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function EffectsTableStrengthsAndUncertainties({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const {showStrengthsAndUncertainties} = useContext(SettingsContext);
  return showStrengthsAndUncertainties ? (
    <TableCell>
      <Box p={1}>
        <Grid container>
          <Grid item xs={12}>
            <b>SoE: </b>
            {dataSource.strengthOfEvidence}
          </Grid>
          <Grid item xs={12}>
            <b>Unc: </b>
            {dataSource.uncertainty}
          </Grid>
        </Grid>
      </Box>
    </TableCell>
  ) : (
    <></>
  );
}
