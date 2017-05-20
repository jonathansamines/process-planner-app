'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const createRange = require('lodash/range');

const createTimingColumns = (totalTime, schedule) => {
  const range = createRange(totalTime);

  return range.map((timeUnit) => {
    const isWaiting = !!schedule.waitingUnits.find(u => u - 1 === timeUnit);
    const isExecuting = !!schedule.executionUnits.find(u => u - 1 === timeUnit);
    const isCompleted = schedule.completionTime - 1 === timeUnit;

    return (
      <td key={timeUnit}>
        {isWaiting && 'E'}
        {isExecuting && 'X'}
        {isCompleted && 'FI'}
      </td>
    );
  });
};

const ProcessScheduleRow = (props) => {
  const { totalTime, processName, schedule, startTime } = props;

  return (
    <tr>
      <td>{processName}</td>
      {createTimingColumns(totalTime, schedule, startTime)}
    </tr>
  );
};

ProcessScheduleRow.propTypes = {
  processName: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  schedule: PropTypes.object.isRequired,
  totalTime: PropTypes.number.isRequired,
};

module.exports = ProcessScheduleRow;
