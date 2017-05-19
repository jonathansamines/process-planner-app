'use strict';

const React = require('react');
const TopNavigation = require('./../components/TopNavigation');
const ProcessSchedulingPage = require('./ProcessScheduling');

const Index = () => {
  return (
    <div className='container'>
      <TopNavigation />
      <ProcessSchedulingPage />

      <footer className='footer'>
       <p>&copy; 2017 Proyecto Sistemas Operativos 2</p>
     </footer>
    </div>
  );
};

module.exports = Index;
