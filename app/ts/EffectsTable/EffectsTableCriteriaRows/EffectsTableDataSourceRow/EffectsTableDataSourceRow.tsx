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
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';

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
  const {showPercentages} = useContext(SettingsContext);

  function createDataSourceCells(dataSource: IDataSource): JSX.Element {
    return (
      <>
        <TableCell>{getUnitLabel(dataSource.unitOfMeasurement)}</TableCell>
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

  function getUnitLabel(unit: IUnitOfMeasurement): string {
    if (showPercentages && unit.type === UnitOfMeasurementType.decimal) {
      return '%';
    } else {
      return unit.label;
    }
  }

  function createCells(): JSX.Element[] {
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
