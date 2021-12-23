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
import IWeights from '@shared/interface/IWeights';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ClipboardButton from 'app/ts/util/SharedComponents/ClipboardButton/ClipboardButton';
import UncertainValue from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/UncertainValue/UncertainValue';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';

export default function SmaaWeightsTable({
  smaaWeights
}: {
  smaaWeights: IWeights;
}): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  function CriterionHeaders(): JSX.Element {
    return (
      <TableRow>
        {_.map(filteredCriteria, (criterion: ICriterion) => (
          <TableCell key={criterion.id}>{criterion.title}</TableCell>
        ))}
      </TableRow>
    );
  }

  function SmaaWeightsValueRow(): JSX.Element {
    return (
      <TableRow>
        {_.map(filteredCriteria, (criterion: ICriterion): JSX.Element => {
          const weight = significantDigits(smaaWeights.mean[criterion.id]);
          const lowerBound = significantDigits(
            smaaWeights['2.5%'][criterion.id]
          );
          const upperBound = significantDigits(
            smaaWeights['97.5%'][criterion.id]
          );
          return (
            <TableCell key={criterion.id}>
              <div style={textCenterStyle}>
                <UncertainValue
                  value={weight}
                  lowerBound={lowerBound}
                  upperBound={upperBound}
                />
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={9}>
        <Typography variant="h5">
          <InlineHelp helpId="representative-weights">Weights</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId="#weigths-table" />
      </Grid>
      <Grid container item xs={12}>
        <LoadingSpinner showSpinnerCondition={!smaaWeights}>
          <Grid item xs={12}>
            <Table id="weigths-table">
              <TableHead>
                <CriterionHeaders />
              </TableHead>
              <TableBody>
                <SmaaWeightsValueRow />
              </TableBody>
            </Table>
          </Grid>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}
