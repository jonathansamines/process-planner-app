'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const createRange = require('lodash/range');

const createTimingColumns = (totalTime, schedule) => {
  const range = createRange(totalTime);

  return range.map((timeUnit) => {
    console.log(timeUnit, schedule.waitingUnits[timeUnit]);
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
};

const ProcessScheduleRow = (props) => {
  const { totalTime, processName, schedule } = props;

  return (
    <tr>
      <td>{processName}</td>
      {createTimingColumns(totalTime, schedule)}
    </tr>
  );
};

ProcessScheduleRow.propTypes = {
  processName: PropTypes.string.isRequired,
  schedule: PropTypes.object.isRequired,
  totalTime: PropTypes.number.isRequired,
};

module.exports = ProcessScheduleRow;
