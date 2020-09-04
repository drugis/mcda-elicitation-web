import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ElicitationContext} from '../../../ElicitationContext';
import MatchingSlider from './MatchingSlider/MatchingSlider';

export default function MatchingSetImportance() {
  const {mostImportantCriterion, criteria, currentStep} = useContext(
    ElicitationContext
  );

  const currentCriterion = getCurrentCriterion();
  const statement = getStatement();

  function getCurrentCriterion() {
    return _.reject([...criteria.values()], (criterion) => {
      return criterion.mcdaId === mostImportantCriterion.mcdaId;
    })[currentStep - 2];
  }

  function getStatement(): string {
    const template =
      'How much better should %criterion1% minimally become to justify the worsening of %criterion2%?';
    return template
      .replace(/%criterion1%/gi, mostImportantCriterion.title)
      .replace(/%unit1%/gi, mostImportantCriterion.unitOfMeasurement)
      .replace(/%worst1%/gi, String(getWorst(mostImportantCriterion)))
      .replace(/%best1%/gi, String(getBest(mostImportantCriterion)))
      .replace(/%criterion2%/gi, currentCriterion.title)
      .replace(/%unit2%/gi, currentCriterion.unitOfMeasurement)
      .replace(/%worst2%/gi, String(getWorst(currentCriterion)))
      .replace(/%best2%/gi, String(getBest(currentCriterion)));
  }

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
                <MatchingSlider currentCriterionId={currentCriterion.mcdaId} />
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
