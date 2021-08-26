import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

export default function FavourabilityHeader({
  numberOfColumns,
  headerText,
  headerId
}: {
  numberOfColumns: number;
  headerText: string;
  headerId: string;
}) {
  return (
    <TableRow>
      <TableCell colSpan={numberOfColumns}>
        <Box p={1}>
          <Typography id={headerId} variant="h6">
            {headerText}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
