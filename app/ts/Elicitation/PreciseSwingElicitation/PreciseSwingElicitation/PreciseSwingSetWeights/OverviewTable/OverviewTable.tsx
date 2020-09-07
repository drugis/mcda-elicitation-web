import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import PreciseSwingSlider from './PreciseSwingSlider/PreciseSwingSlider';

export default function OverviewTable() {
  const {criteria} = useContext(PreferencesContext);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Criterion</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell align="center">Worst</TableCell>
          <TableCell align="center">Best</TableCell>
          <TableCell align="center">Importance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(criteria, (criterion) => {
          return (
            <TableRow key={criterion.mcdaId}>
              <TableCell>
                <Tooltip
                  disableHoverListener={!criterion.description}
                  title={criterion.description ? criterion.description : ''}
                >
                  <span className="criterion-title">{criterion.title}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{criterion.unitOfMeasurement}</TableCell>
              <TableCell align="center">{getWorst(criterion)}</TableCell>
              <TableCell align="center">{getBest(criterion)}</TableCell>
              <TableCell align="center">
                <PreciseSwingSlider criterion={criterion} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
