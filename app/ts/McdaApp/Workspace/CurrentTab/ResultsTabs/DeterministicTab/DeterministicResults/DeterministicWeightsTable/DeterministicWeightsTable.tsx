import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import SensitivityTableButtons from '../SensitivityTableButtons/SensitivityTableButtons';
import {DeterministicWeightsContext} from './DeterministicWeightsContext';
import DeterministicWeightsRow from './DeterministicWeightsRow';

export default function DeterministicWeightsTable(): JSX.Element {
  const {resetWeightsTable} = useContext(DeterministicWeightsContext);
  const {canShowEquivalentChange} = useContext(EquivalentChangeContext);

  return (
    <Grid container>
      <Grid item xs={9}>
        <Typography variant="h5">
          <InlineHelp helpId="representative-weights">Weights</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId="#deterministic-weights-table" />
      </Grid>
      <Grid item xs={12}>
        <Table id="deterministic-weights-table">
          <TableHead>
            <TableRow>
              <ColumnHeaders
                canShowEquivalentChange={canShowEquivalentChange}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            <WeightRows />
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={12}>
        <SensitivityTableButtons
          resetter={resetWeightsTable}
          idContext="weights"
        />
      </Grid>
    </Grid>
  );
}

function WeightRows(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  return (
    <>
      {_.map(filteredCriteria, (criterion) => (
        <DeterministicWeightsRow criterion={criterion} />
      ))}
    </>
  );
}

function ColumnHeaders({
  canShowEquivalentChange
}: {
  canShowEquivalentChange: boolean;
}): JSX.Element {
  return (
    <>
      <TableCell>Criterion</TableCell>
      <TableCell>Unit</TableCell>
      <TableCell>Best</TableCell>
      <TableCell>Worst</TableCell>
      <TableCell>Weight</TableCell>
      <TableCell>Importance (worst → best)</TableCell>
      <ShowIf condition={canShowEquivalentChange}>
        <TableCell>Equivalent change</TableCell>
      </ShowIf>
    </>
  );
}
