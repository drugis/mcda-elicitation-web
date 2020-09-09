import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import React, {useContext} from 'react';
import {ElicitationContext} from '../../ElicitationContext';
import {
  getCurrentCriterion,
  getMatchingStatement
} from '../MatchingElicitationUtil';
import MatchingSlider from './MatchingSlider/MatchingSlider';

export default function MatchingSetImportance() {
  const {mostImportantCriterionId, currentStep} = useContext(
    ElicitationContext
  );
  const {criteria} = useContext(PreferencesContext);
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
                {getWorst(mostImportantCriterion)}
              </TableCell>
              <TableCell align="center">
                <MatchingSlider currentCriterionId={currentCriterion.id} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{currentCriterion.title}</TableCell>
              <TableCell align="center">{getBest(currentCriterion)}</TableCell>
              <TableCell align="center">{getWorst(currentCriterion)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
