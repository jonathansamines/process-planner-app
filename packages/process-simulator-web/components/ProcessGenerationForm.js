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
      <form>
        <fieldset>
          <label htmlFor='numberOfProcess'>Número de procesos a simular</label>
          <input id='numberOfProcess' onChange={this.updateNumberOfProcess} />

          <button onClick={this.confirm}>
            Crear tabla de procesos
          </button>
        </fieldset>
      </form>
    );
  }
}

ProcessGenerationForm.propTypes = {
  onChange: PropTypes.func.isRequired,
};

module.exports = ProcessGenerationForm;
