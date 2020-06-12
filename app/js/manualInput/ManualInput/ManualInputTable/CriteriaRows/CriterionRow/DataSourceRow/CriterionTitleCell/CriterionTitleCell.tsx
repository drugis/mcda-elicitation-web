import {TableCell} from '@material-ui/core';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function CriterionTitleCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {setCriterionProperty} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length;

  function handleChange(newTitle: string) {
    setCriterionProperty(criterion.id, 'title', newTitle);
  }

  return (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <InlineEditor
        value={criterion.title}
        tooltipText={'Edit criterion title'}
        callback={handleChange}
        errorOnEmpty={true}
      />
    </TableCell>
  );
}
