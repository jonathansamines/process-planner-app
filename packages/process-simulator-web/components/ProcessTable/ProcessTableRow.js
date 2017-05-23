'use strict';

const React = require('react');
const PropTypes = require('prop-types');

const NON_COMPUTED_SYMBOL = '-';

class ProcessTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.onEdition = this.onEdition.bind(this);
  }

  onEdition(propertyName) {
    const { processUnit } = this.props;

    return (event) => {
      this.props.onChange(
        Object.assign({}, processUnit, {
          [propertyName]: +event.target.value,
        })
      );
    };
  }

  render() {
    const { processUnit, schedule } = this.props;

    return (
      <tr>
        <td>{processUnit.name}</td>
        <td>
          <input
            type='number'
            className='form-control input-sm'
            min={0}
            onChange={this.onEdition('startTime')}
            value={processUnit.startTime} />
        </td>
        <td>
          <input
            type='number'
            className='form-control input-sm'
            min={0}
            onChange={this.onEdition('executionTime')}
            value={processUnit.executionTime} />
        </td>
        <td>{schedule.completionTime || NON_COMPUTED_SYMBOL}</td>
        <td>{schedule.serviceTime || NON_COMPUTED_SYMBOL}</td>
        <td>{schedule.waitingUnits ? schedule.waitingUnits.length : NON_COMPUTED_SYMBOL}</td>
        <td>{schedule.cpuUsage || NON_COMPUTED_SYMBOL}</td>
      </tr>
    );
  }
}

ProcessTableRow.defaultProps = {
  schedule: {},
};

ProcessTableRow.propTypes = {
  processUnit: PropTypes.object.isRequired,
  schedule: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessTableRow;
