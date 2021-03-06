'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const ProcessTableRow = require('./ProcessTableRow');

const NON_COMPUTED_SYMBOL = '-';

const byProcessName = (newProcess) => {
  return (projectionUnit) => {
    if (projectionUnit.process.name === newProcess.name) {
      return Object.assign({}, projectionUnit, {
        process: newProcess,
      });
    }

    return projectionUnit;
  };
};

class ProcessTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projection: props.projection,
      isProcessInfoConfirmed: false,
    };

    this.onProcessUnitChange = this.onProcessUnitChange.bind(this);
    this.confirmProcessInfo = this.confirmProcessInfo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.projection !== nextProps.projection) {
      this.setState({
        projection: nextProps.projection,
      });
    }
  }

  onProcessUnitChange(processUnit) {
    const newProjection = this.state.projection.map(byProcessName(processUnit));

    this.setState({
      projection: newProjection,
    });
  }

  confirmProcessInfo(event) {
    event.preventDefault();

    this.setState({
      isProcessInfoConfirmed: true,
    });

    this.props.onChange(this.state.projection);
  }

  render() {
    const {
      averageServiceTime,
      averageWaitingTime,
      averageCPUUsage,
    } = this.props;

    const { isProcessInfoConfirmed, projection } = this.state;

    return (
      <table className='table table-striped table-condensed'>
        <caption>
          <strong>Resumen de Procesos</strong>
          <br />
          <small>Ingrese la información requerida para cada proceso</small>
        </caption>
        <thead>
          <tr>
            <td>Procesos</td>
            <td>Tiempo inicio</td>
            <td>Tiempo de ejecución</td>
            <td>Tiempo final</td>
            <td>Tiempo de servicio</td>
            <td>Tiempo de espera</td>
            <td>Uso del CPU</td>
          </tr>
        </thead>

        <tbody>
          {projection.map(projectionUnit => (
            <ProcessTableRow
              key={projectionUnit.process.name}
              isEnabled={!isProcessInfoConfirmed}
              processUnit={projectionUnit.process}
              schedule={projectionUnit.schedule}
              onChange={this.onProcessUnitChange} />
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4} />
            <td>{averageServiceTime || NON_COMPUTED_SYMBOL}</td>
            <td>{averageWaitingTime || NON_COMPUTED_SYMBOL}</td>
            <td>{averageCPUUsage || NON_COMPUTED_SYMBOL}</td>
          </tr>
          <tr>
            <td colSpan={6} />
            <td className='text-right'>
              <button
                className='btn btn-success'
                onClick={this.confirmProcessInfo}>
                Planificar y Guardar
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

ProcessTable.propTypes = {
  onChange: PropTypes.func.isRequired,
  projection: PropTypes.arrayOf(PropTypes.object).isRequired,
  averageServiceTime: PropTypes.number,
  averageWaitingTime: PropTypes.number,
  averageCPUUsage: PropTypes.number,
};

module.exports = ProcessTable;
