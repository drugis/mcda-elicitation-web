import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select
} from '@material-ui/core';
import IBetaDistribution from '@shared/interface/IBetaDistribution';
import IDistribution, {distributionType} from '@shared/interface/IDistribution';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import React, {ChangeEvent, useContext} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../InputCellContext/InputCellContext';
import DistributionInputFields from './DistributionInputFields/DistributionInputFields';

export default function DistributionCellDialog({
  isDialogOpen,
  callback,
  cancel
}: {
  isDialogOpen: boolean;
  callback: (distribution: IDistribution) => void;
  cancel: () => void;
}) {
  const {
    alternativeId,
    inputType,
    setInputType,
    value,
    mean,
    standardError,
    alpha,
    beta,
    isValidValue,
    lowerBound,
    isValidLowerBound,
    upperBound,
    isValidUpperBound,
    text,
    isValidMean,
    isValidStandardError,
    isValidAlpha,
    isValidBeta
  } = useContext(InputCellContext);
  const {criterion, dataSource} = useContext(DataSourceRowContext);

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setInputType(event.target.value as distributionType);
  }

  function isInputInvalid(): boolean {
    switch (inputType) {
      case 'value':
        return !isValidValue;
      case 'normal':
        return !isValidMean || !isValidStandardError;
      case 'beta':
        return !isValidAlpha || !isValidBeta;
      case 'gamma':
        return !isValidAlpha || !isValidBeta;
      case 'range':
        return !isValidLowerBound || !isValidUpperBound;
      case 'text':
        return false;
      case 'empty':
        return false;
    }
  }

  function handleEditButtonClick(): void {
    let newDistribution = {
      type: inputType,
      criterionId: criterion.id,
      dataSourceId: dataSource.id,
      alternativeId: alternativeId
    };
    switch (inputType) {
      case 'value':
        callback({
          ...newDistribution,
          value: Number.parseFloat(value)
        } as IValueEffect);
        break;
      case 'normal':
        callback({
          ...newDistribution,
          mean: Number.parseFloat(mean),
          standardError: Number.parseFloat(standardError)
        } as INormalDistribution);
        break;
      case 'beta':
        callback({
          ...newDistribution,
          alpha: Number.parseFloat(alpha),
          beta: Number.parseFloat(beta)
        } as IBetaDistribution);
        break;
      case 'gamma':
        callback({
          ...newDistribution,
          alpha: Number.parseFloat(alpha),
          beta: Number.parseFloat(beta)
        } as IGammaDistribution);
        break;
      case 'range':
        callback({
          ...newDistribution,
          lowerBound: Number.parseFloat(lowerBound),
          upperBound: Number.parseFloat(upperBound)
        } as IRangeEffect);
        break;
      case 'text':
        callback({
          ...newDistribution,
          text: text
        } as ITextEffect);
        break;
      case 'empty':
        callback(newDistribution as IEmptyEffect);
        break;
      default:
        throw `unknown input type ${inputType}`;
    }
  }

  return (
    <Dialog open={isDialogOpen} onClose={cancel} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={cancel}>
        Set value
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            Input parameters
          </Grid>
          <Grid item xs={6}>
            <Select
              value={inputType}
              onChange={handleTypeChange}
              style={{minWidth: '198px'}}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="beta">Beta</MenuItem>
              <MenuItem value="gamma">Gamma</MenuItem>
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="empty">Empty cell</MenuItem>
              <MenuItem value="text">Text</MenuItem>
            </Select>
          </Grid>
          <DistributionInputFields
            editButtonCallback={handleEditButtonClick}
            isInputInvalid={isInputInvalid}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleEditButtonClick}
          variant="contained"
          disabled={isInputInvalid()}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
