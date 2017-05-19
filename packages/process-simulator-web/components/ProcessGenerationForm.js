'use strict';

const React = require('react');
const PropTypes = require('prop-types');

class ProcessGenerationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfProcess: 0,
    };

    this.updateNumberOfProcess = this.updateNumberOfProcess.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  updateNumberOfProcess(event) {
    this.setState({ numberOfProcess: event.value });
  }

  confirm() {
    this.props.onChange(this.state.numberOfProcess);
  }

  render() {
    return (
      <form className='form-horizontal'>
        <div className='form-group'>
          <label htmlFor='numberOfProcess'>Número de procesos a simular</label>
          <input
            id='numberOfProcess'
            type='number'
            min={0}
            step={1}
            className='form-control'
            onChange={this.updateNumberOfProcess} />
        </div>
        <div className='form-group'>
          <button
            className='btn btn-success'
            type='submit'
            onClick={this.confirm}>
            Generar Procesos
          </button>
        </div>
      </form>
    );
  }
}

ProcessGenerationForm.propTypes = {
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessGenerationForm;
