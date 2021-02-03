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
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import SensitivityMeasurementsTableRow from './SensitivityMeasurementsTableRow/SensitivityMeasurementsTableRow';
import SensitivityTableButtons from './SensitivityTableButtons/SensitivityTableButtons';

export default function SensitivityMeasurementsTable(): JSX.Element {
  const {filteredAlternatives, filteredCriteria} = useContext(
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
      <Grid item xs={12}>
        <Typography variant="h5">
          Measurements <InlineHelp helpId="effects-table" />
        </Typography>
      </Grid>
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
    </Grid>
  );
}
