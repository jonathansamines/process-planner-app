'use strict';

const React = require('react');
const createRange = require('lodash/range');
const planner = require('@jonathansamines/process-planning');
const ProcessGenerationForm = require('./../components/ProcessGenerationForm');
const ProcessTable = require('./../components/ProcessTable');
const ProjectionTable = require('./../components/ProjectionTable');
const AlgorithmSelector = require('./../components/AlgorithmSelector');

const algorithmNameMap = {
  FCFS: 'First Come, First Served',
  SJF: 'Shortest Job First',
  RR: 'Round Robin',
};

const algorithmImplMap = {
  FCFS: 'firstComeFirstServed',
  SJF: 'shortestJob',
  RR: 'roundRobin',
};

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
      numberOfProcess: 0,
      projection: [],
      selectedAlgorithm: 'FCFS',
      step: 0,
    };

    this.confirmProcessNumber = this.confirmProcessNumber.bind(this);
    this.scheduleProcessList = this.scheduleProcessList.bind(this);
    this.onAlgorithmChange = this.onAlgorithmChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // If the algorithm, changes then just pass the current projection
    // to compute again with a different algorithm
    if (this.state.selectedAlgorithm !== prevState.selectedAlgorithm) {
      this.scheduleProcessList(this.state.projection);
    }
  }

  wizardStep(steps, getComponent) {
    if (steps.indexOf(this.state.step) === -1) return null;

    return getComponent();
  }

  onAlgorithmChange(event) {
    this.setState({
      selectedAlgorithm: event.target.value,
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
    const processList = projection.map(projectionUnit => projectionUnit.process);
    const scheduler = planner.create({
      processList,
    });

    const algorithmMethod = algorithmImplMap[this.state.selectedAlgorithm];
    const algorithm = scheduler[algorithmMethod];

    if (!algorithm) {
      throw new Error(`The selected algorithm ${algorithmMethod} is not supported`);
    }

    const schedulingPlan = algorithm();

    console.info('Scheduling plan: ', schedulingPlan);

    this.setState({
      projection: schedulingPlan.projection,
      averageWaitingTime: schedulingPlan.averageWaitingTime,
      averageServiceTime: schedulingPlan.averageServiceTime,
      averageCPUUsage: schedulingPlan.averageCPUUsage,
      totalTime: schedulingPlan.totalTime,
      step: 2,
    });
  }

  render() {
    const {
      step,
      projection,
      totalTime,
      selectedAlgorithm,
      averageWaitingTime,
      averageServiceTime,
      averageCPUUsage,
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
              isEnabled={step === 2}
              value={selectedAlgorithm}
              onChange={this.onAlgorithmChange} />
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
                <ProjectionTable
                  algorithName={algorithmNameMap[selectedAlgorithm]}
                  projection={projection}
                  totalTime={totalTime} />
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ProcessScheduling;
