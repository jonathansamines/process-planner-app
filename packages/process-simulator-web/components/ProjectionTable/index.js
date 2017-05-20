'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const ProjectionTableHeaders = require('./ProjectionTableHeaders');
const ProcessScheduleRow = require('./ProcessScheduleRow');

const ProjectionTable = (props) => {
  const {
    totalTime,
    projection,
    algorithName,
  } = props;

  return (
    <table className='table table-striped table-condensed'>
      <caption>
        <strong>Planificación de procesos</strong>
        <br />
        <small>
          <strong>Algoritmo: </strong>
          <i>{algorithName}</i>
        </small>
      </caption>
      <ProjectionTableHeaders timeUnits={totalTime} />

      <tbody>
        {projection.map(projectionUnit => (
          <ProcessScheduleRow
            key={projectionUnit.process.name}
            processName={projectionUnit.process.name}
            startTime={projectionUnit.process.startTime}
            totalTime={totalTime}
            schedule={projectionUnit.schedule} />
        ))}
      </tbody>
    </table>
  );
};

ProjectionTable.propTypes = {
  algorithName: PropTypes.string.isRequired,
  totalTime: PropTypes.number.isRequired,
  projection: PropTypes.arrayOf(PropTypes.object).isRequired,
};

module.exports = ProjectionTable;
