'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const createRange = require('lodash/range');
const ProcessScheduleRow = require('./ProcessScheduleRow');

const createProcessTimingHeaders = (timeUnits) => {
  return createRange(timeUnits)
    .map((unit) => {
      return (
        <th key={unit}>{unit}</th>
      );
    });
};

const ProcessScheduleTable = (props) => {
  const { totalTime, processList } = props;

  return (
    <table>
      <thead>
        <tr>
          <th>Process name</th>
          {createProcessTimingHeaders(schedulingPlan.totalTime)}
        </tr>
      </thead>
      <tbody>
        {processList.map((currentProcess) => (
          <ProcessScheduleRow process={currentProcess} />
        ))}
      </tbody>
    </table>
  );
};

module.exports = ProcessScheduleTable;
