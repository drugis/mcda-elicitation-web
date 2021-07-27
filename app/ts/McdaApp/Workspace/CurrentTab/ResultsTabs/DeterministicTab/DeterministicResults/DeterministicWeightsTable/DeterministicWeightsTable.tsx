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
import {TPreferences} from '@shared/types/Preferences';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import ClickableRangeTableCell from 'app/ts/util/ClickableRangeTableCell/ClickableRangeTableCell';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import EquivalentChangeCell from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/EquivalentChangeTableComponents/EquivalentChangeCell';
import {buildImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/PreferencesWeightsTableUtil';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import {DeterministicWeightsContext} from './DeterministicWeightsContext';

export default function DeterministicWeightsTable(): JSX.Element {
  const {currentScenario} = useContext(CurrentScenarioContext);
  const {canShowEquivalentChanges} = useContext(EquivalentChangeContext);
  const {deterministicChangeableWeights} = useContext(
    DeterministicWeightsContext
  );

  return (
    <Grid container item xs={12}>
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
            <WeightRows preferences={currentScenario.state.prefs} />
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );

  function WeightRows({preferences}: {preferences: TPreferences}): JSX.Element {
    const {filteredCriteria} = useContext(CurrentSubproblemContext);
    const {} = useContext(DeterministicResultsContext);
    return (
      <>
        {_.map(filteredCriteria, (criterion: ICriterion) => {
          const weight =
            deterministicChangeableWeights.weights.mean[criterion.id];
          const importance =
            deterministicChangeableWeights.importances[criterion.id];
          const equivalentChange =
            deterministicChangeableWeights.equivalentChanges[criterion.id];
          const setterCallback = () => {};
          return (
            <TableRow key={criterion.id}>
              <TableCell id={`title-${criterion.id}`}>
                {criterion.title}
              </TableCell>
              <TableCell id={`weight-${criterion.id}`}>
                {significantDigits(weight)}
              </TableCell>
              <ClickableRangeTableCell
                id={`importance-${criterion.id}`}
                value={importance}
                min={1}
                max={100}
                stepSize={1}
                labelRenderer={(value: number) => {
                  return value + '%';
                }}
                setterCallback={setterCallback}
              />
              <ShowIf condition={canShowEquivalentChanges}>
                <TableCell id={`equivalent-change-${criterion.id}`}>
                  <EquivalentChangeCell criterion={criterion} />
                </TableCell>
              </ShowIf>
            </TableRow>
          );
        })}
      </>
    );
  }
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
      <TableCell>Importance</TableCell>
      <ShowIf condition={canShowEquivalentChanges}>
        <TableCell>Equivalent change</TableCell>
      </ShowIf>
    </>
  );
}
