'use strict';

const React = require('react');
const createRange = require('lodash/range');
const planner = require('@jonathansamines/process-planning');
const ProcessGenerationForm = require('./../components/ProcessGenerationForm');
const ProcessTable = require('./../components/ProcessTable');
const ProjectionTable = require('./../components/ProjectionTable');

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
      step: 0,
    };

    this.confirmProcessNumber = this.confirmProcessNumber.bind(this);
    this.scheduleProcessList = this.scheduleProcessList.bind(this);
  }

  wizardStep(steps, getComponent) {
    if (steps.indexOf(this.state.step) === -1) return null;

    return getComponent();
  }

  confirmProcessNumber(numberOfProcess) {
    const processList = generateProcessList(numberOfProcess);
    const scheduler = planner.create({
      processList,
    });

    const schedulingPlan = scheduler.firstComeFirstServed();

    this.setState({
      numberOfProcess,
      step: 1,
      projection: schedulingPlan.projection,
    });
  }

  scheduleProcessList(projection) {
    const processList = projection.map(projectionUnit => projectionUnit.process);
    const scheduler = planner.create({
      processList,
    });

    const schedulingPlan = scheduler.firstComeFirstServed();

    console.info('Scheduling plan: ', schedulingPlan);

    this.setState({
      projection: schedulingPlan.projection,
      totalTime: schedulingPlan.totalTime,
      step: 2,
    });
  }

  render() {
    const {
      step,
      projection,
      totalTime,
    } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-2'>
            <ProcessGenerationForm
              isEnabled={step === 0}
              onChange={this.confirmProcessNumber} />
          </div>
          <div className='col-xs-10'>
            {
              this.wizardStep([1, 2], () => (
                <ProcessTable
                  projection={projection}
                  averageWaitingTime={0}
                  averageServiceTime={0}
                  averageCPUUsage={0}
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
                  algorithName='firstComeFirstServed'
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
