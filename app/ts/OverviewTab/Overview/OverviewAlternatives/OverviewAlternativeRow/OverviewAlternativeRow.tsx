import {TableCell, TableRow} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {swapItems} from 'app/ts/ManualInput/ManualInputService/ManualInputService';
import MoveUpDownButtons from 'app/ts/MoveUpDownButtons/MoveUpDownButtons';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import EditOverviewAlternativeButton from './EditOverviewAlternativeButton/EditOverviewAlternativeButton';

export default function OverviewAlternativeRow({
  alternative,
  nextAlternativeId,
  previousAlternativeId
}: {
  alternative: IAlternative;
  nextAlternativeId: string | undefined;
  previousAlternativeId: string | undefined;
}): JSX.Element {
  const {swapAlternatives} = useContext(WorkspaceContext);

  return (
    <TableRow>
      <TableCell align={'center'}>
        <MoveUpDownButtons
          swap={swapAlternatives}
          id={alternative.id}
          nextId={nextAlternativeId}
          previousId={previousAlternativeId}
        />
      </TableCell>
      <TableCell>{alternative.title}</TableCell>
      <TableCell align={'center'}>
        <EditOverviewAlternativeButton alternative={alternative} />
      </TableCell>
    </TableRow>
  );
}
