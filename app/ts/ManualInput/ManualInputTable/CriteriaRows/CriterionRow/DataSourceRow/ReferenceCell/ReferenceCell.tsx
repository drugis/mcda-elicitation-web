import {Tooltip} from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {ManualInputContext} from 'app/ts//ManualInput/ManualInputContext';
import {checkIfLinkIsInvalid} from 'app/ts/ManualInput/ManualInputUtil/ManualInputUtil';
import React, {useContext, useState} from 'react';
import InlineTooltip from '../InlineTooltip/InlineTooltip';
import ReferenceDialog from './ReferenceDialog/ReferenceDialog';

export default function ReferenceCell({
  dataSource,
  criterion
}: {
  dataSource: IDataSource;
  criterion: ICriterion;
}) {
  const {setDataSource} = useContext(ManualInputContext);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const tooltipText = 'Edit reference';

  function updateDataSource(newReference: string, newReferenceLink: string) {
    setDataSource(criterion.id, {
      ...dataSource,
      reference: newReference,
      referenceLink: newReferenceLink
    });
    closeDialog();
  }

  function renderReference(): JSX.Element {
    if (
      dataSource.reference &&
      dataSource.referenceLink &&
      !checkIfLinkIsInvalid(dataSource.referenceLink)
    ) {
      return (
        <Tooltip title={tooltipText}>
          <>
            <div>{dataSource.reference}</div>
            <div>({dataSource.referenceLink})</div>
          </>
        </Tooltip>
      );
    } else if (dataSource.reference) {
      return (
        <Tooltip title={tooltipText}>
          <span>{dataSource.reference}</span>
        </Tooltip>
      );
    } else {
      return <InlineTooltip tooltipText={tooltipText} />;
    }
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  return (
    <TableCell id={`ds-reference-${dataSource.id}`} align="center">
      <span onClick={openDialog} style={{cursor: 'pointer'}}>
        {renderReference()}
      </span>
      <ReferenceDialog
        isDialogOpen={isDialogOpen}
        cancel={closeDialog}
        callback={updateDataSource}
      />
    </TableCell>
  );
}
