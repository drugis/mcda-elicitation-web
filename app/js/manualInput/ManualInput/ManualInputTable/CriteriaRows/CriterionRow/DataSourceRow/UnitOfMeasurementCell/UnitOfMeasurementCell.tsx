import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TextField,
  Tooltip
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useState} from 'react';
import IDataSource from '../../../../../../../interface/IDataSource';
import {UnitOfMeasurementType} from '../../../../../../../interface/IUnitOfMeasurement';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import DialogTitle from '../../../../../DialogTitle/DialogTitle';

export default function UnitOfMeasurementCell({
  dataSource
}: {
  dataSource: IDataSource;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {setDataSource} = useContext(ManualInputContext);

  const unitOptions = {
    decimal: {
      label: 'Proportion (decimal)',
      type: 'decimal',
      defaultValue: 'Proportion',
      defaultLowerBound: 0,
      defaultUpperBound: 1
    },
    percentage: {
      label: 'Proportion (percentage)',
      type: 'percentage',
      defaultValue: '%',
      defaultLowerBound: 0,
      defaultUpperBound: 100
    },
    custom: {
      label: 'Custom',
      type: 'custom',
      defaultValue: '',
      defaultLowerBound: -Infinity,
      defaultUpperBound: Infinity
    }
  };
  const lowerBoundOptions = [-Infinity, 0];
  const upperBoundOptions = [1, 100, Infinity];

  function toggleDialog() {
    setIsDialogOpen(!isDialogOpen);
  }

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // setCriterion({...criterion, title: event.target.value});
  }

  function handleLabelChange() {}

  function handleLowerBoundChange() {}

  function handleUpperBoundChange() {}

  return (
    <TableCell>
      <Tooltip title="Edit unit of measurement">
        <IconButton size="small" color="primary" onClick={toggleDialog}>
          <Edit />
        </IconButton>
      </Tooltip>
      {dataSource.unitOfMeasurement.label}

      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitle id="dialog-title" onClose={toggleDialog}>
          Edit unit of measurement
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              Type of unit
            </Grid>
            <Grid item xs={6}>
              <Select
                value={dataSource.unitOfMeasurement.type}
                onChange={handleTypeChange}
                style={{minWidth: '198px'}}
              >
                {_.map(unitOptions, (option) => {
                  return (
                    <MenuItem key={option.type} value={option.type}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={6}>
              Label
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={dataSource.unitOfMeasurement.label}
                onChange={handleLabelChange}
                disabled={
                  dataSource.unitOfMeasurement.type !==
                  UnitOfMeasurementType.custom
                }
              />
            </Grid>
            <Grid item xs={6}>
              Lower bound
            </Grid>
            <Grid item xs={6}>
              <Select
                value={dataSource.unitOfMeasurement.lowerBound}
                onChange={handleLowerBoundChange}
                style={{minWidth: '198px'}}
                disabled={
                  dataSource.unitOfMeasurement.type !==
                  UnitOfMeasurementType.custom
                }
              >
                {_.map(lowerBoundOptions, (option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={6}>
              Upper bound
            </Grid>
            <Grid item xs={6}>
              <Select
                value={dataSource.unitOfMeasurement.upperBound}
                onChange={handleUpperBoundChange}
                style={{minWidth: '198px'}}
                disabled={
                  dataSource.unitOfMeasurement.type !==
                  UnitOfMeasurementType.custom
                }
              >
                {_.map(upperBoundOptions, (option) => {
                  return (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justify="flex-start">
            <Grid item>
              <Button
                color="primary"
                onClick={toggleDialog}
                variant="contained"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </TableCell>
  );
}
