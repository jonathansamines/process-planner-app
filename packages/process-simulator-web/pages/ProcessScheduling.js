'use strict';

const React = require('react');
const ProcessGenerationForm = require('./../components/ProcessGenerationForm');
const ProcessTable = require('./../components/ProcessTable');
const createRange = require('lodash/range');
const planner = require('@jonathansamines/process-planning');

function generateProcessList(numberOfProcess) {
  const processList = createRange(numberOfProcess);

  return processList.map((unit, index) => {
    return {
      name: `Proceso #${index}`,
      startTime: 0,
      executionTime: 100,
    };
  });
}

function getProcessTable(numberOfProcess) {
  const processList = generateProcessList(numberOfProcess);
  const scheduler = planner.create({
    processList,
  });

  const schedulingPlan = scheduler.firstComeFirstServed();

  return (
    <ProcessTable
      projection={schedulingPlan.projection}
      averageWaitingTime={0}
      averageServiceTime={0}
      averageCPUUsage={0} />
  );
}

class ProcessScheduling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfProcess: 0,
      projection: [],
      isProcessNumberConfirmed: false,
    };

    this.confirmProcessNumber = this.confirmProcessNumber.bind(this);
  }

  confirmProcessNumber(numberOfProcess) {
    this.setState({
      numberOfProcess,
      isProcessNumberConfirmed: true,
    });
  }

  render() {
    const { isProcessNumberConfirmed, numberOfProcess } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-3'>
            <ProcessGenerationForm
              isEnabled={!isProcessNumberConfirmed}
              onChange={this.confirmProcessNumber} />
          </div>
          <div className='col-xs-9'>
            {
              isProcessNumberConfirmed &&
              getProcessTable(numberOfProcess)
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ProcessScheduling;
