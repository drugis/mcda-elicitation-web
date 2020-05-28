import {Grid, MenuItem, Select} from '@material-ui/core';
import React, {ChangeEvent, useContext, useState} from 'react';
import {ManualInputContext} from '../../../../ManualInputContext';

export default function CriterionFavourability({
  isFavourable,
  setIsFavourable
}: {
  isFavourable: boolean;
  setIsFavourable: (x: boolean) => void;
}) {
  const {useFavourability} = useContext(ManualInputContext);
  const [favourability, setFavourability] = useState('unfavourable');

  function handleChange(event: ChangeEvent<{value: unknown}>) {
    if (event.target.value === 'favourable') {
      setFavourability('favourable');
      setIsFavourable(true);
    } else {
      setFavourability('unfavourable');
      setIsFavourable(false);
    }
  }

  return useFavourability ? (
    <Grid item xs={12}>
      <Select
        id="select-favourability"
        value={favourability}
        onChange={handleChange}
        label="Select favourability"
        variant="outlined"
      >
        <MenuItem value={'favourable'}>Favourable</MenuItem>
        <MenuItem value={'unfavourable'}>Unfavourable</MenuItem>
      </Select>
    </Grid>
  ) : (
    <></>
  );
}
