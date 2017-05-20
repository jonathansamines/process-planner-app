'use strict';

const React = require('react');
const PropTypes = require('prop-types');

function createProcessRow(projectionUnit) {
  return (
    <tr key={projectionUnit.process.name}>
      <td>{projectionUnit.process.name}</td>
      <td>
        <input
          type='number'
          className='form-control'
          defaultValue={projectionUnit.process.startTime} />
      </td>
      <td>
        <input
          type='number'
          className='form-control'
          defaultValue={projectionUnit.process.executionTime} />
      </td>
      <td>{projectionUnit.schedule.completionTime}</td>
      <td>{projectionUnit.schedule.serviceTime}</td>
      <td>{projectionUnit.schedule.waitingUnits.length}</td>
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
      <caption>
        <strong>Resumen de Procesos</strong>
        <br />
        <small>Ingrese la información requerida para cada proceso</small>
      </caption>
      <thead>
        <tr>
          <td>Procesos</td>
          <td>Tiempo Inicial (ti)</td>
          <td>Tiempo de Ejecución (t)</td>
          <td>Tiempo Final (tf)</td>
          <td>Tiempo de Servicio (T)</td>
          <td>Tiempo de Espera (E)</td>
          <td>Uso del CPU (I)</td>
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
