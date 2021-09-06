import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import {Distribution} from '@shared/interface/IDistribution';
import {ManualInputContext} from 'app/ts/McdaApp/ManualInput/ManualInputContext';
import {useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import DistributionCellDialog from '../DistributionCellDialog/DistributionCellDialog';
import {InputCellContextProviderComponent} from '../InputCellContext/InputCellContext';
import {createDistributionLabel} from '../InputCellUtil';

export default function DistributionCell({
  alternativeId
}: {
  alternativeId: string;
}) {
  const {getDistribution, setDistribution, distributions} =
    useContext(ManualInputContext);
  const {dataSource, criterion} = useContext(DataSourceRowContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [label, setLabel] = useState('');

  const distribution = getDistribution(
    criterion.id,
    dataSource.id,
    alternativeId
  );

  useEffect(() => {
    setLabel(createDistributionLabel(distribution, dataSource));
  }, [distribution, dataSource]);

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function saveDistribution(newDistribution: Distribution) {
    setDistribution(newDistribution);
    setIsDialogOpen(false);
  }

  return (
    <TableCell align="center">
      <Tooltip title="Edit distribution">
        <span onClick={openDialog} style={{cursor: 'pointer'}}>
          {label}
        </span>
      </Tooltip>
      <InputCellContextProviderComponent
        alternativeId={alternativeId}
        effectOrDistribution={distribution}
      >
        <DistributionCellDialog
          callback={saveDistribution}
          isDialogOpen={isDialogOpen}
          cancel={closeDialog}
        />
      </InputCellContextProviderComponent>
    </TableCell>
  );
}
