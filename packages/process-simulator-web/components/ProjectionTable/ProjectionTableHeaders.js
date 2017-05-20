'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const createRange = require('lodash/range');

const ProjectionTableHeaders = (props) => {
  const { timeUnits } = props;
  const range = createRange(timeUnits + 1);

  return (
    <thead>
      <tr>
        <th>Procesos</th>
        {range.map(unit => <th key={unit}>{unit}</th>)}
      </tr>
    </thead>
  );
};

ProjectionTableHeaders.propTypes = {
  timeUnits: PropTypes.number.isRequired,
};

module.exports = ProjectionTableHeaders;
