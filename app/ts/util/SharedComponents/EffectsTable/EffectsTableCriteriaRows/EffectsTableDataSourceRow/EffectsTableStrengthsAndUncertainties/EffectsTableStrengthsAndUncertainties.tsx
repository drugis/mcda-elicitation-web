import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import IDataSource from '@shared/interface/IDataSource';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
import {useContext} from 'react';

export default function EffectsTableStrengthsAndUncertainties({
  dataSource,
  isExcluded
}: {
  dataSource: IDataSource;
  isExcluded?: boolean;
}) {
  const {
    toggledColumns: {strength}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <ShowIf condition={strength}>
      <TableCell style={cellStyle}>
        <Box p={1}>
          <Grid id={`soe-unc-${dataSource.id}`} container>
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
    </ShowIf>
  );
}
