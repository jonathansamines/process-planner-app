'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const ProjectionTableHeaders = require('./ProjectionTableHeaders');
const ProcessScheduleRow = require('./ProcessScheduleRow');

const ProjectionTable = (props) => {
  const { totalTime, projection } = props;

  return (
    <table className='table table-striped'>
      <ProjectionTableHeaders timeUnits={totalTime} />

      <tbody>
        {projection.map(projectionUnit => (
          <ProcessScheduleRow
            key={projectionUnit.process.name}
            processName={projectionUnit.process.name}
            schedule={projectionUnit.schedule} />
        ))}
      </tbody>
    </table>
  );
};

ProjectionTable.propTypes = {
  totalTime: PropTypes.number.isRequired,
  projection: PropTypes.arrayOf(PropTypes.object).isRequired,
};

module.exports = ProjectionTable;
