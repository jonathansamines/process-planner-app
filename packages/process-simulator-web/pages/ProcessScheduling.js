'use strict';

const React = require('react');
const createRange = require('lodash/range');
const last = require('lodash/last');
const planner = require('@jonathansamines/process-planning');
const ProcessGenerationForm = require('./../components/ProcessGenerationForm');
const ProcessTable = require('./../components/ProcessTable');
const ProjectionTable = require('./../components/ProjectionTable');
const AlgorithmSelector = require('./../components/AlgorithmSelector');

const DEFAULT_SELECTED_ALGORITH = 'FCFS';

const algorithmNameMap = {
  FCFS: 'Primero en Entrar, primero en ser servido',
  SJF: 'Trabajo más corto primero',
  RR: 'Round Robin',
};

const algorithmImplMap = {
  FCFS: 'firstComeFirstServed',
  SJF: 'shortestJob',
  RR: 'roundRobin',
};

function createSimulation(quantumValue, selectedAlgorithm, schedulingPlan) {
  const resource = {
    fecha_simulacion: (new Date()).toISOString(),
    quantum: quantumValue,
    algoritmo: selectedAlgorithm,
    tiempo_total: schedulingPlan.totalTime,
    lista_procesos: schedulingPlan.projection.map((prj) => {
      return {
        nombre_proceso: prj.process.name,
        tiempo_inicial: prj.process.startTime,
        tiempo_ejecucion: prj.process.executionTime,
        tiempo_finalizacion: prj.schedule.completionTime,
        tiempo_servicio: prj.schedule.serviceTime,
        tiempo_espera: last(prj.schedule.waitingUnits),
        uso_cpu_compartido: prj.schedule.cpuUsage,
        planificacion: {
          unidades_ejecucion: prj.schedule.executionUnits.toString(),
          unidades_espera: prj.schedule.waitingUnits.toString(),
          tiempo_finalizacion: prj.schedule.completionTime,
        },
      };
    }),
  };

  return fetch('/process-planner-web/planificar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(resource),
  });
}

function generateProcessList(numberOfProcess) {
  const processList = createRange(numberOfProcess);

  return processList.map((unit, index) => {
    return {
      name: `Proceso #${index}`,
      startTime: 0,
      executionTime: 1,
    };
  });
}

class ProcessScheduling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      numberOfProcess: 1,
      projection: [],
      quantumValue: 3,
      selectedAlgorithm: DEFAULT_SELECTED_ALGORITH,
      unconfirmedAlgorithm: DEFAULT_SELECTED_ALGORITH,
    };

    this.confirmProcessNumber = this.confirmProcessNumber.bind(this);
    this.scheduleProcessList = this.scheduleProcessList.bind(this);
    this.onAlgorithmChange = this.onAlgorithmChange.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
  }

  updateQuantum(event) {
    this.setState({
      quantumValue: +event.target.value,
    });
  }

  wizardStep(steps, getComponent) {
    if (steps.indexOf(this.state.step) === -1) return null;

    return getComponent();
  }

  onAlgorithmChange(event) {
    this.setState({
      unconfirmedAlgorithm: event.target.value,
    });
  }

  confirmProcessNumber(numberOfProcess) {
    const processList = generateProcessList(numberOfProcess);

    this.setState({
      numberOfProcess,
      step: 1,
      projection: processList.map(processUnit => ({ process: processUnit })),
    });
  }

  scheduleProcessList(projection) {
    const { unconfirmedAlgorithm, quantumValue } = this.state;
    const processList = projection.map(projectionUnit => projectionUnit.process);
    const scheduler = planner.create({
      processList,
    });

    const algorithmMethod = algorithmImplMap[unconfirmedAlgorithm];
    const algorithm = scheduler[algorithmMethod];

    if (!algorithm) {
      throw new Error(`The selected algorithm ${algorithmMethod} is not supported`);
    }

    const args = [];

    // The round robin algorithm expects a quantum value
    if (unconfirmedAlgorithm === 'RR') {
      args.push(quantumValue);
    }

    const schedulingPlan = algorithm.apply(algorithm, args);

    console.info('Scheduling plan: ', schedulingPlan);

    this.setState((prevState) => {
      return {
        selectedAlgorithm: prevState.unconfirmedAlgorithm,
        projection: schedulingPlan.projection,
        averageWaitingTime: schedulingPlan.averageWaitingTime,
        averageServiceTime: schedulingPlan.averageServiceTime,
        averageCPUUsage: schedulingPlan.averageCPUUsage,
        totalTime: schedulingPlan.totalTime,
        step: 2,
      };
    }, () => {
      createSimulation(quantumValue, this.state.selectedAlgorithm, schedulingPlan);
    });
  }

  render() {
    const {
      step,
      projection,
      totalTime,
      unconfirmedAlgorithm,
      selectedAlgorithm,
      averageWaitingTime,
      averageServiceTime,
      averageCPUUsage,
      quantumValue,
    } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-2'>
            <ProcessGenerationForm
              isEnabled={step === 0}
              onChange={this.confirmProcessNumber} />

            <br />
            <hr />
            <br />

            <AlgorithmSelector
              value={unconfirmedAlgorithm}
              onChange={this.onAlgorithmChange} />

            <br />
            <hr />
            <br />

            {/* A quantum value is just valid for round robin  */}
            <form className='form-horizontal'>
              <div className='form-group'>
                <label htmlFor='quantumValue'>Valor del Quantum</label>
                <input
                  id='quantumValue'
                  className='form-control'
                  value={quantumValue}
                  placeholder='Ingresa un valor de quantum'
                  onChange={this.updateQuantum}
                  disabled={unconfirmedAlgorithm !== 'RR'} />
              </div>
            </form>
          </div>
          <div className='col-xs-9 col-xs-offset-1'>
            {
              this.wizardStep([0], () => (
                <div className='row'>
                  <div className='col-xs-11'>
                    <div className='well'>
                      Por favor, ingrese un número de procesos a simular
                    </div>
                  </div>
                </div>
              ))
            }

            {
              this.wizardStep([1, 2], () => (
                <ProcessTable
                  projection={projection}
                  averageWaitingTime={averageWaitingTime}
                  averageServiceTime={averageServiceTime}
                  averageCPUUsage={averageCPUUsage}
                  onChange={this.scheduleProcessList} />
              ))
            }
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            {
              this.wizardStep([2], () => (
                <div>
                  <br />
                  <hr />
                  <br />

                  <ProjectionTable
                    algorithName={algorithmNameMap[selectedAlgorithm]}
                    projection={projection}
                    totalTime={totalTime} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ProcessScheduling;
