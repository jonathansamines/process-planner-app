'use strict';

const React = require('react');
const PropTypes = require('prop-types');

class ProcessGenerationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfProcess: 0,
    };

    this.confirm = this.confirm.bind(this);
    this.updateNumberOfProcess = this.updateNumberOfProcess.bind(this);
  }

  updateNumberOfProcess(event) {
    this.setState({ numberOfProcess: event.target.value });
  }

  confirm(event) {
    event.preventDefault();
    this.props.onChange(this.state.numberOfProcess);
  }

  render() {
    const { isEnabled } = this.props;
    const { numberOfProcess } = this.state;

    return (
      <form className='form-horizontal'>
        <fieldset
          className='form-group'
          disabled={!isEnabled}>
          <label htmlFor='numberOfProcess'>Número de procesos</label>
          <input
            id='numberOfProcess'
            type='number'
            min={0}
            step={1}
            className='form-control'
            value={numberOfProcess}
            onChange={this.updateNumberOfProcess} />
        </fieldset>

        <fieldset
          className='form-group'
          disabled={!isEnabled}>
          <button
            className='btn btn-success'
            type='submit'
            onClick={this.confirm}>
            Generar Procesos
          </button>
        </fieldset>
      </form>
    );
  }
}

ProcessGenerationForm.defaultProps = {
  isEnabled: true,
};

ProcessGenerationForm.propTypes = {
  isEnabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessGenerationForm;
