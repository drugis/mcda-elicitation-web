import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import {InlineHelp} from 'help-popup';
import React, {ChangeEvent, useContext, useState} from 'react';

export default function FavourabilitySwitch({
  criterion,
  setCriterion
}: {
  criterion: ICriterion;
  setCriterion: (criterion: ICriterion) => void;
}): JSX.Element {
  const {workspace} = useContext(WorkspaceContext);

  const [favourability, setFavourability] = useState<string>(
    String(criterion.isFavourable)
  );

  if (workspace.properties.useFavourability) {
    function handleFavourabilityChanged(
      event: ChangeEvent<HTMLInputElement>
    ): void {
      const value = event.target.value === 'true';
      setFavourability(event.target.value);
      setCriterion({...criterion, isFavourable: value});
    }

    return (
      <>
        <Grid item xs={12}>
          <Typography>
            <InlineHelp helpId="favourability">Favourability </InlineHelp>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <RadioGroup
            row
            name="favourability-radio"
            value={favourability}
            onChange={handleFavourabilityChanged}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Favourable"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Not favourable"
            />
          </RadioGroup>
        </Grid>
      </>
    );
  } else {
    return <></>;
  }
}
