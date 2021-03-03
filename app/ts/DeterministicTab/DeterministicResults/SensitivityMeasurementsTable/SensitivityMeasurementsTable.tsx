import {
  CircularProgress,
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
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import SensitivityMeasurementsTableRow from './SensitivityMeasurementsTableRow/SensitivityMeasurementsTableRow';
import SensitivityTableButtons from './SensitivityTableButtons/SensitivityTableButtons';

export default function SensitivityMeasurementsTable(): JSX.Element {
  const {filteredAlternatives, filteredCriteria, configuredRanges} = useContext(
    SubproblemContext
  );

  function renderRows(): JSX.Element[] {
    return _.map(filteredCriteria, (criterion: ICriterion) => (
      <SensitivityMeasurementsTableRow
        key={criterion.id}
        criterion={criterion}
      />
    ));
  }

  return (
    <Grid container item xs={12} spacing={1}>
      <Grid item xs={12} id="sensitivity-measurements-header">
        <Typography variant="h5">
          <InlineHelp helpId="effects-table">Measurements</InlineHelp>
        </Typography>
      </Grid>
      {!_.isEmpty(configuredRanges) ? (
        <>
          <Grid item xs={9}>
            <em>Values can be changed by clicking them.</em>
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
              <TableBody>{renderRows()}</TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <SensitivityTableButtons />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
}
