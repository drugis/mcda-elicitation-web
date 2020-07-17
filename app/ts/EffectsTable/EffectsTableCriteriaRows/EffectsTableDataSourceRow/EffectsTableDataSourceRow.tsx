import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import _ from 'lodash';
import React, {useContext} from 'react';
import {EffectsTableContext} from '../../EffectsTableContext/EffectsTableContext';
import ValueCell from './ValueCell/ValueCell';

export default function EffectsTableDataSourceRow({
  criterion,
  dataSource,
  index
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  index: number;
}) {
  const {alternatives} = useContext(EffectsTableContext);

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
      return (
        <ValueCell
          key={alternative.id}
          alternativeId={alternative.id}
          dataSourceId={dataSource.id}
        />
      );
    });
  }

  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      {index === 0 ? (
        <>
          <TableCell
            id={`criterion-title-${index}`}
            rowSpan={criterion.dataSources.length}
          >
            {criterion.title}
          </TableCell>
          <TableCell rowSpan={criterion.dataSources.length}>
            {criterion.description}
          </TableCell>
        </>
      ) : (
        <></>
      )}
      {createDataSourceCells(dataSource)}
    </TableRow>
  );
}
