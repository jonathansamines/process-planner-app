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
    const { processUnit, schedule, isEnabled } = this.props;

    return (
      <tr>
        <td>{processUnit.name}</td>
        <td>
          <input
            type='number'
            className='form-control input-sm'
            min={0}
            disabled={!isEnabled}
            onChange={this.onEdition('startTime')}
            value={processUnit.startTime} />
        </td>
        <td>
          <input
            type='number'
            className='form-control input-sm'
            min={1}
            disabled={!isEnabled}
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
  isEnabled: true,
};

ProcessTableRow.propTypes = {
  isEnabled: PropTypes.bool,
  processUnit: PropTypes.object.isRequired,
  schedule: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessTableRow;
