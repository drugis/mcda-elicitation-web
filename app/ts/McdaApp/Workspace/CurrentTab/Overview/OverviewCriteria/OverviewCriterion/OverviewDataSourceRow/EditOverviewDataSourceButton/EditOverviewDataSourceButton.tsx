import {IconButton, Tooltip} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import {useContext, useState} from 'react';
import {OverviewDataSourceContext} from '../../OverviewDataSourceTable/OverviewDataSourceContext/OverviewDataSourceContext';
import EditOverviewDataSourceDialog from './EditOverviewDataSourceDialog/EditOverDataSourceDialog';

export default function EditOverviewDataSourceButton() {
  const {dataSource} = useContext(OverviewDataSourceContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  return (
    <>
      <Tooltip title="Edit data source">
        <IconButton
          id={`edit-data-source-button-${dataSource.id}`}
          color="primary"
          onClick={openDialog}
          size="small"
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <EditOverviewDataSourceDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
}
