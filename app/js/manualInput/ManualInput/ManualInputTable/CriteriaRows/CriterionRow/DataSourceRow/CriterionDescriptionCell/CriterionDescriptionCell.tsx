import {TableCell} from '@material-ui/core';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function CriterionDescriptionCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {setCriterion} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function handleDescriptionChanged(newDescription: string) {
    setCriterion({...criterion, description: newDescription});
  }

  return (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <InlineEditor
        value={criterion.description}
        tooltipText={'Edit criterion description'}
        multiline={true}
        callback={handleDescriptionChanged}
      />
    </TableCell>
  );
}
