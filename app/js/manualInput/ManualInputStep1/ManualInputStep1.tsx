import React, {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';
import {Grid, Row, Col} from 'rsuite';

export default function ManualInputStep1() {
  // const {title, setTitle} = useContext(ManualInputContext);

  return (
    <Grid>
      <Row>
        <Col xs={24}>
          <h3 id="manual-input-header-step1">
            Create workspace manually — step 1 of 2
          </h3>
        </Col>
      </Row>

    </Grid>
  );
}
