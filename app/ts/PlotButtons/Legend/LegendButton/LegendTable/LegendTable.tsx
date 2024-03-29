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
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import {ChangeEvent, KeyboardEvent, useContext} from 'react';

export default function LegendTable({
  newTitles,
  handleKey,
  handleLegendChange
}: {
  newTitles: Record<string, string>;
  handleKey: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleLegendChange: (
    alternativeId: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

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
