import React from 'react';
import Favourability from './Favourability/Favourability';

export default function Criteria() {
  return (
    <span>
      <div>
        <h4>Criteria</h4>
      </div>
      <Favourability />
      <div>
        <button
          id="add-criterion-button"
          className="button small"
          type="button"
        >
          <i className="fa fa-plus"></i> Add Criterion
        </button>
      </div>
      <div>
        {/* <criterion-list> is-input="true" edit-mode="editMode"></criterion-list> */}
      </div>
    </span>
  );
}
