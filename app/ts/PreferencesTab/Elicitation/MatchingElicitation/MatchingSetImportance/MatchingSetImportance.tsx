import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import {ElicitationContext} from '../../ElicitationContext';
import {
  getCurrentCriterion,
  getMatchingStatement
} from '../MatchingElicitationUtil';
import MatchingSlider from './MatchingSlider/MatchingSlider';

export default function MatchingSetImportance() {
  const {showPercentages} = useContext(SettingsContext);
  const {mostImportantCriterionId, currentStep} = useContext(
    ElicitationContext
  );
  const {criteria, pvfs} = useContext(PreferencesContext);

  const mostImportantCriterion = criteria[mostImportantCriterionId];

  const currentCriterion = getCurrentCriterion(
    criteria,
    mostImportantCriterionId,
    currentStep
  );
  const statement = getMatchingStatement(
    mostImportantCriterion,
    currentCriterion
  );

  const usePercentagesForMostImportantCriterion =
    showPercentages &&
    canBePercentage(mostImportantCriterion.unitOfMeasurement.type);

  const usePercentagesForCurrentCriterion =
    showPercentages && canBePercentage(currentCriterion.unitOfMeasurement.type);

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{`Trade-off between ${mostImportantCriterion.title} and ${currentCriterion.title}`}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        id="matching-statement"
        dangerouslySetInnerHTML={{__html: statement}}
      />
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Criterion</TableCell>
              <TableCell align="center">Alternative A</TableCell>
              <TableCell align="center">Alternative B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{mostImportantCriterion.title}</TableCell>
              <TableCell align="center">
                {getWorst(
                  pvfs[mostImportantCriterionId],
                  usePercentagesForMostImportantCriterion
                )}
              </TableCell>
              <TableCell align="center">
                <MatchingSlider currentCriterionId={currentCriterion.id} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{currentCriterion.title}</TableCell>
              <TableCell align="center">
                {getBest(
                  pvfs[currentCriterion.id],
                  usePercentagesForCurrentCriterion
                )}
              </TableCell>
              <TableCell align="center">
                {getWorst(
                  pvfs[currentCriterion.id],
                  usePercentagesForCurrentCriterion
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
