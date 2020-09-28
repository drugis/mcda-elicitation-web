import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
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
              native
              id="input-parameters-selector"
              value={inputType}
              onChange={handleTypeChange}
              style={{minWidth: '198px'}}
            >
              <option value="normal">Normal</option>
              <option value="beta">Beta</option>
              <option value="gamma">Gamma</option>
              <option value="value">Value</option>
              <option value="range">Range</option>
              <option value="empty">Empty cell</option>
              <option value="text">Text</option>
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
          id="edit-distribution-cell"
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
