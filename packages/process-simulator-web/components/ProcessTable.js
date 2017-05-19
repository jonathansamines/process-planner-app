'use strict';

const React = require('react');
const PropTypes = require('prop-types');

function createProcessRow(projectionUnit) {
  return (
    <tr>
      <td>{projectionUnit.process.name}</td>
      <td>{projectionUnit.process.startTime}</td>
      <td>{projectionUnit.process.executionTime}</td>
      <td>{projectionUnit.schedule.completionTime}</td>
      <td>{projectionUnit.schedule.serviceTime}</td>
      <td>{projectionUnit.schedule.waitingTime.length}</td>
      <td>{projectionUnit.schedule.cpuUsage}</td>
    </tr>
  );
}

const ProcessTable = (props) => {
  const {
    averageServiceTime,
    averageWaitingTime,
    averageCPUUsage,
    projection,
  } = props;

  return (
    <table className='table table-striped'>
      <thead>
        <tr>
          <td>Procesos</td>
          <td>Tiempo Inicial</td>
          <td>Tiempo de Ejecución</td>
          <td>Tiempo Final</td>
          <td>Tiempo de Servicio</td>
          <td>Tiempo de Espera</td>
          <td>Uso del CPU</td>
        </tr>
      </thead>

      <tbody>
        {projection.map(createProcessRow)}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={4}></td>
          <td>{averageServiceTime}</td>
          <td>{averageWaitingTime}</td>
          <td>{averageCPUUsage}</td>
        </tr>
      </tfoot>
    </table>
  );
};

ProcessTable.propTypes = {
  projection: PropTypes.arrayOf(PropTypes.object).isRequired,
  averageServiceTime: PropTypes.number.isRequired,
  averageWaitingTime: PropTypes.number.isRequired,
  averageCPUUsage: PropTypes.number.isRequired,
};

module.exports = ProcessTable;
