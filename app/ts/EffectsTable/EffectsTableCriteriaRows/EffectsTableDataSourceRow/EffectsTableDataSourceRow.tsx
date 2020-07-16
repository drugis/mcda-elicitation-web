import React from 'react';
import IDataSource from '@shared/interface/IDataSource';
import ICriterion from '@shared/interface/ICriterion';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';

export default function EffectsTableDataSourceRow({
  criterion,
  dataSource,
  alternatives,
  index
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  alternatives: IAlternative[];
  index: number;
}) {
  function createDataSourceCells(dataSource: IDataSource) {
    return (
      <>
        <TableCell>{dataSource.unitOfMeasurement.label}</TableCell>
        {createCells()}
        <TableCell>
          <Box p={1}>
            <Grid container>
              <Grid item xs={12}>
                <b>SoE: </b>
                {dataSource.strengthOfEvidence}
              </Grid>
              <Grid item xs={12}>
                <b>Unc: </b>
                {dataSource.uncertainty}
              </Grid>
            </Grid>
          </Box>
        </TableCell>
        <TableCell>{dataSource.reference}</TableCell>
      </>
    );
  }
  function createCells() {
    return _.map(alternatives, (alternative: IAlternative) => {
      return <EffectsTableCell key={alternative.id} alternativeId={alternative.id} />;
    });
  }
  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      {index === 0 ? (
        <>
          <TableCell>{criterion.title}</TableCell>
          <TableCell>{criterion.description}</TableCell>
        </>
      ) : (
        <></>
      )}
      {createDataSourceCells(dataSource)}
    </TableRow>
  );
}
