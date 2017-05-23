'use strict';

const React = require('react');
const PropTypes = require('prop-types');

const AlgorithmSelector = (props) => {
  const {
    value,
    onChange,
    isEnabled,
  } = props;

  return (
    <form className='form-horizontal'>
      <fieldset className='form-group' disabled={!isEnabled}>
        <label htmlFor='algorithm-selector'>
          Algoritmo de planificación
        </label>

        <select
          id='algorithm-selector'
          className='form-control'
          value={value}
          onChange={onChange}>
          <option value='FCFS'>Primero en Entrar, primero en ser servido</option>
          <option value='SJF'>Trabajo más corto primero</option>
          <option value='RR'>Round Robin</option>
        </select>
      </fieldset>
    </form>
  );
};

AlgorithmSelector.defaultProps = {
  isEnabled: true,
};

AlgorithmSelector.propTypes = {
  isEnabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

module.exports = AlgorithmSelector;
