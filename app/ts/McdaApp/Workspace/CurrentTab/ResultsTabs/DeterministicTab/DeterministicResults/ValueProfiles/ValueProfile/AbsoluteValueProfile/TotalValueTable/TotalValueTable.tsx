import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {TProfileCase} from 'app/ts/type/profileCase';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';

export default function TotalValueTable({
  alternatives,
  totalValues,
  profileCase,
  isRelative = false
}: {
  alternatives: IAlternative[];
  totalValues: Record<string, number>;
  profileCase: TProfileCase;
  isRelative?: boolean;
}): JSX.Element {
  return (
    <Table id={`total-value-table-${profileCase}`}>
      <TableHead>
        <TableRow>
          {_.map(alternatives, (alternative: IAlternative, index: number) => (
            <TableCell
              key={alternative.id}
              id={`total-value-alternative-header-${index}-${profileCase}`}
            >
              {alternative.title}
            </TableCell>
          ))}
          <ShowIf condition={isRelative}>
            <TableCell>Difference</TableCell>
          </ShowIf>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {_.map(alternatives, (alternative: IAlternative, index: number) => (
            <TableCell
              key={alternative.id}
              id={`total-value-alternative-value-${index}-${profileCase}`}
            >
              {significantDigits(totalValues[alternative.id])}
            </TableCell>
          ))}
          <ShowIf condition={isRelative}>
            <TableCell id="relative-total-difference">
              {significantDigits(
                totalValues[alternatives[0].id] -
                  totalValues[alternatives[1].id]
              )}
            </TableCell>
          </ShowIf>
        </TableRow>
      </TableBody>
    </Table>
  );
}
