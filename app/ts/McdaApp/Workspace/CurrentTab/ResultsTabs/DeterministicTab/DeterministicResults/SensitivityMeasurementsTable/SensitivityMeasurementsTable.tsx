import {
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import EffectsTableAlternativeHeaders from 'app/ts/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import CriteriaHeader from 'app/ts/EffectsTable/EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from 'app/ts/EffectsTable/EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import SensitivityMeasurementsTableRow from './SensitivityMeasurementsTableRow/SensitivityMeasurementsTableRow';
import SensitivityTableButtons from './SensitivityTableButtons/SensitivityTableButtons';

export default function SensitivityMeasurementsTable(): JSX.Element {
  const {filteredAlternatives, filteredCriteria, configuredRanges} = useContext(
    CurrentSubproblemContext
  );

  return (
    <Grid container item xs={12} spacing={1}>
      <Grid item xs={12} id="sensitivity-measurements-header">
        <Typography variant="h5">
          <InlineHelp helpId="deterministic-effects-table">
            Measurements
          </InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <LoadingSpinner showSpinnerCondition={_.isEmpty(configuredRanges)}>
          <Grid item xs={9}>
            <Typography>
              <em>Values can be changed by clicking them.</em>
            </Typography>
          </Grid>
          <Grid container item xs={3} justify="flex-end">
            <ClipboardButton targetId="#sensitivity-measurements-table" />
          </Grid>
          <Grid item xs={12}>
            <Table id="sensitivity-measurements-table" size="small">
              <TableHead>
                <TableRow>
                  <CriteriaHeader colSpan={1} />
                  <DescriptionHeader />
                  <UnitsHeader />
                  <EffectsTableAlternativeHeaders
                    alternatives={filteredAlternatives}
                  />
                  <SoEUncHeader />
                  <ReferencesHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                <Rows criteria={filteredCriteria} />
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <SensitivityTableButtons />
          </Grid>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}

function Rows({criteria}: {criteria: ICriterion[]}): JSX.Element {
  return (
    <>
      {_.map(criteria, (criterion: ICriterion) => (
        <SensitivityMeasurementsTableRow
          key={criterion.id}
          criterion={criterion}
        />
      ))}
    </>
  );
}
