'use strict';

const React = require('react');
const ProcessGenerationForm = require('./../components/ProcessGenerationForm');
const ProcessTable = require('./../components/ProcessTable');

class ProcessScheduling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfProcess: 0,
    };

    this.generateProcessTable = this.generateProcessTable.bind(this);
  }

  generateProcessTable(numberOfProcess) {
    this.setState({ numberOfProcess });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-4'>
            <ProcessGenerationForm onChange={this.generateProcessTable} />
          </div>
          <div className='col-xs-8'>
            <ProcessTable
              projection={false}
              averageWaitingtime={0}
              averageServiceTime={0}
              averageCPUUsage={0} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ProcessScheduling;
