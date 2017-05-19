'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const createRange = require('lodash/range');

const createTimingColumns = (totalTime, schedule) => {
  return createRange(totalTime)
    .map((timeUnit) => {
      const isWaiting = schedule.waitingUnits[timeUnit] === timeUnit;
      const isExecuting = schedule.executionUnits[timeUnit] === timeUnit;
      const isCompleted = schedule.completionTime === timeUnit;

      return (
        <td key={timeUnit}>
          {isWaiting && 'E'}
          {isExecuting && 'X'}
          {isCompleted && 'FI'}
        </td>
      );
    });
}

const ProcessScheduleRow = (props) => {
  const { totalTime, process } = props;

  return (
    <tr>
      <td>{process.process.name}</td>
      {createTimingColumns(totalTime, process.schedule)}
    </tr>
  );
};

ProcessScheduleRow.propTypes = {
  process: PropTypes.object.isRequired,
  totalTime: PropTypes.number.isRequired,
};

module.exports = ProcessScheduleRow;
