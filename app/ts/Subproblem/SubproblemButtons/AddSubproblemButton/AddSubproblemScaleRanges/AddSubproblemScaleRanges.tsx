import {Grid} from '@material-ui/core';
import {displayWarnings} from 'app/ts/util/displayWarnings';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';
import ScalesSlider from './ScalesSlider/ScalesSlider';

export default function AddSubproblemScaleRanges() {
  const {criteria} = useContext(WorkspaceContext);
  const {scaleRangesWarnings, isCriterionExcluded} = useContext(
    AddSubproblemContext
  );

  function renderSliders() {
    return _.map(criteria, (criterion) => {
      if (!isCriterionExcluded(criterion.id)) {
        return <ScalesSlider key={criterion.id} criterion={criterion} />;
      }
    });
  }

  return (
    <>
      {scaleRangesWarnings.length > 0 ? (
        <>{displayWarnings(scaleRangesWarnings)}</>
      ) : (
        <Grid container item xs={12} spacing={4}>
          {renderSliders()}
        </Grid>
      )}
    </>
  );
}
