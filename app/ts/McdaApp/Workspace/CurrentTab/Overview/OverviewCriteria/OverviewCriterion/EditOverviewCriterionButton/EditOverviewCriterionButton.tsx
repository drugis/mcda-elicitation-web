import {IconButton, Tooltip} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import {OverviewCriterionContext} from 'app/ts/McdaApp/Workspace/CurrentTab/Overview/OverviewCriteria/OverviewCriterionContext/OverviewCriterionContext';
import React, {useContext, useState} from 'react';
import EditOverviewCriterionDialog from './EditOverviewCriterionDialog/EditOverviewCriterionDialog';

export default function EditOverviewCriterionButton() {
  const {criterion} = useContext(OverviewCriterionContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  return (
    <>
      <Tooltip title="Edit criterion">
        <IconButton
          id={`edit-criterion-button-${criterion.id}`}
          color="primary"
          onClick={openDialog}
          size="small"
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <EditOverviewCriterionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
}
