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

class ProcessScheduling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfProcess: 1,
      projection: [],
    };

    this.generateProcessTable = this.generateProcessTable.bind(this);
  }

  generateProcessTable(numberOfProcess) {
    this.setState({ numberOfProcess });
  }

  render() {
    const processList = generateProcessList(this.state.numberOfProcess);
    const scheduler = planner.create({
      processList,
    });

    const schedulingPlan = scheduler.firstComeFirstServed();

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-3'>
            <ProcessGenerationForm onChange={this.generateProcessTable} />
          </div>
          <div className='col-xs-9'>
            <ProcessTable
              projection={schedulingPlan.projection}
              averageWaitingTime={0}
              averageServiceTime={0}
              averageCPUUsage={0} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ProcessScheduling;
