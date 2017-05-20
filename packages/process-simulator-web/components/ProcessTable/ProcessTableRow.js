'use strict';

const React = require('react');
const PropTypes = require('prop-types');

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
            className='form-control'
            min={0}
            defaultValue={processUnit.startTime} />
        </td>
        <td>
          <input
            type='number'
            className='form-control'
            min={0}
            defaultValue={processUnit.executionTime} />
        </td>
        <td>{schedule.completionTime}</td>
        <td>{schedule.serviceTime}</td>
        <td>{schedule.waitingUnits.length}</td>
        <td>{schedule.cpuUsage}</td>
      </tr>
    );
  }
}

ProcessTableRow.propTypes = {
  processUnit: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessTableRow;
