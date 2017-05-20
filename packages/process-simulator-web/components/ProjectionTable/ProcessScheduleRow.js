'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const createRange = require('lodash/range');

const createTimingColumns = (totalTime, schedule) => {
  const range = createRange(totalTime + 1);

  return range.map((timeUnit) => {
    const isWaiting = !!schedule.waitingUnits.filter(u => u === timeUnit).length;
    const isExecuting = !!schedule.executionUnits.filter(u => u === timeUnit).length;
    const isCompleted = schedule.completionTime === timeUnit;

    const styles = classNames({
      label: true,
      'label-primary': isWaiting,
      'label-success': isExecuting,
      'label-default': isCompleted,
    });

    return (
      <td key={timeUnit}>
        <span className={styles}>
          {isWaiting && 'E'}
          {isExecuting && 'X'}
          {isCompleted && 'FI'}
        </span>
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
