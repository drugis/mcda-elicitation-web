import {TableCell, TableRow} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import MoveUpDownButtons from 'app/ts/McdaApp/MoveUpDownButtons/MoveUpDownButtons';
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
      <TableCell id={`alternative-title-${alternative.id}`}>
        {alternative.title}
      </TableCell>
      <TableCell align={'center'}>
        <EditOverviewAlternativeButton alternative={alternative} />
      </TableCell>
      <TableCell align={'center'}>
        <MoveUpDownButtons
          swap={swapAlternatives}
          id={alternative.id}
          nextId={nextAlternativeId}
          previousId={previousAlternativeId}
        />
      </TableCell>
    </TableRow>
  );
}
