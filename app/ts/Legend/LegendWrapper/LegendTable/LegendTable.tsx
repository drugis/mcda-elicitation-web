import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import IAlternative from '@shared/interface/IAlternative';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function LegendTable({
  newTitles,
  handleKey,
  handleLegendChange
}: {
  newTitles: Record<string, string>;
  handleKey: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleLegendChange: (
    alternativeId: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}): JSX.Element {
  const {filteredAlternatives} = useContext(SubproblemContext);

  function renderLegendRows(): JSX.Element[] {
    return _.map(
      filteredAlternatives,
      (alternative: IAlternative, index: number): JSX.Element => (
        <TableRow key={alternative.id}>
          <TableCell>{alternative.title}</TableCell>
          <TableCell>
            <ArrowRightAltIcon />
          </TableCell>
          <TableCell>
            <TextField
              id={`label-input-${index}`}
              value={newTitles[alternative.id]}
              onChange={_.partial(handleLegendChange, alternative.id)}
              type="text"
              error={!newTitles[alternative.id]}
              onKeyDown={handleKey}
            />
          </TableCell>
        </TableRow>
      )
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Original name</TableCell>
          <TableCell></TableCell>
          <TableCell>New name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{renderLegendRows()}</TableBody>
    </Table>
  );
}
