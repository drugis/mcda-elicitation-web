import {Grid} from '@material-ui/core';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import React, {useContext} from 'react';
import OverviewTable from './OverviewTable/OverviewTable';

export default function PreciseSwingSetWeights() {
  const {mostImportantCriterion} = useContext(ElicitationContext);

  const statement = getStatement();

  function getStatement(): string {
    const template =
      "You've indicated that improving %criterion1% from %worst1% %unit1% to %best1% %unit1% is the most important (i.e. it has 100% importance). Now indicate the relative importance (in %) to this improvement of each other criterion's improvement using the sliders below.";
    return template
      .replace(/%criterion1%/gi, mostImportantCriterion.title)
      .replace(/%unit1%/gi, mostImportantCriterion.unitOfMeasurement)
      .replace(/%worst1%/gi, String(getWorst(mostImportantCriterion)))
      .replace(/%best1%/gi, String(getBest(mostImportantCriterion)));
  }

  return (
    <Grid container item spacing={2}>
      <Grid
        item
        xs={12}
        id="precise-swing-statement"
        dangerouslySetInnerHTML={{__html: statement}}
      />
      <Grid item xs={12}>
        <OverviewTable />
      </Grid>
    </Grid>
  );
}
