import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import ClickableSliderTableCell from 'app/ts/util/ClickableSliderTableCell/ClickableSliderTableCell';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import SensitivityTableButtons from '../SensitivityTableButtons/SensitivityTableButtons';
import DeterministicEquivalentChangeCell from './DeterministicEquivalentChangeCell/DeterministicEquivalentChangeCell';
import {DeterministicWeightsContext} from './DeterministicWeightsContext';

export default function DeterministicWeightsTable(): JSX.Element {
  const {resetWeightsTable} = useContext(DeterministicWeightsContext);
  const {canShowEquivalentChanges} = useContext(EquivalentChangeContext);

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
                canShowEquivalentChanges={canShowEquivalentChanges}
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
  const {canShowEquivalentChanges} = useContext(EquivalentChangeContext);
  const {deterministicChangeableWeights, setImportance} = useContext(
    DeterministicWeightsContext
  );
  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  return (
    <>
      {_.map(filteredCriteria, (criterion: ICriterion) => {
        const weight = deterministicChangeableWeights.weights[criterion.id];
        const importance =
          deterministicChangeableWeights.importances[criterion.id];
        return (
          <TableRow key={`${criterion.id}-weights-table-row`}>
            <TableCell id={`title-${criterion.id}`}>
              {criterion.title}
            </TableCell>
            <TableCell id={`weight-${criterion.id}`}>
              {significantDigits(weight)}
            </TableCell>
            <ClickableSliderTableCell
              key={`${criterion.id}-importance-cell`}
              id={`importance-${criterion.id}-cell`}
              value={importance}
              min={1}
              max={100}
              stepSize={1}
              labelRenderer={(value: number) => `${Math.round(value)}%`}
              setterCallback={(newValue: number) =>
                setImportance(criterion.id, newValue)
              }
            />
            <ShowIf condition={canShowEquivalentChanges}>
              <DeterministicEquivalentChangeCell criterion={criterion} />
            </ShowIf>
          </TableRow>
        );
      })}
    </>
  );
}

function ColumnHeaders({
  canShowEquivalentChanges
}: {
  canShowEquivalentChanges: boolean;
}): JSX.Element {
  return (
    <>
      <TableCell>Criterion</TableCell>
      <TableCell>Weight</TableCell>
      <TableCell>Importance (worst → best)</TableCell>
      <ShowIf condition={canShowEquivalentChanges}>
        <TableCell>Equivalent change</TableCell>
      </ShowIf>
    </>
  );
}
