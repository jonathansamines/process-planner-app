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
      <div>
        <ProcessGenerationForm onChange={this.generateProcessTable} />
        <ProcessTable
          projection={false}
          averageWaitingtime={false}
          averageServiceTime={false}
          averageCPUUsage={false} />
      </div>
    );
  }
}

module.exports = ProcessScheduling;
