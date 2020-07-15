import {TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function CriterionDescriptionCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {setCriterionProperty} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length;

  function handleDescriptionChanged(newDescription: string) {
    setCriterionProperty(criterion.id, 'description', newDescription);
  }

  return (
    <TableCell rowSpan={numberOfDataSourceRows} align="center">
      <InlineEditor
        value={criterion.description}
        tooltipText={'Edit criterion description'}
        multiline={true}
        callback={handleDescriptionChanged}
      />
    </TableCell>
  );
}
