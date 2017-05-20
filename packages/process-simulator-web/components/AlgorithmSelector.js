'use strict';

const React = require('react');
const PropTypes = require('prop-types');

const AlgorithmSelector = (props) => {
  const {
    value,
    onChange,
  } = props;

  return (
    <form className='form-horizontal'>
      <fieldset className='form-group'>
        <label htmlFor='algorithm-selector'>
          Algoritmo de planificación
        </label>

        <select
          id='algorithm-selector'
          className='form-control'
          value={value}
          onChange={onChange}>
          <option value='FCFS'>First Come First Served</option>
          <option value='SJF'>Shortest Job First</option>
          <option value='RR'>Round Robin</option>
        </select>
      </fieldset>
    </form>
  );
};

AlgorithmSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

module.exports = AlgorithmSelector;
