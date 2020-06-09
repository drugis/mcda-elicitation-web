import {Box, Card, CardContent} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';

export default function CriteriaList() {
  const {criteria} = useContext(ManualInputContext);

  return (
    <>
      {_.map(criteria, (criterion) => {
        return (
          <Box p={1}>
            <Card>
              <CardContent>
                <strong>{criterion.title}</strong>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </>
  );
}
