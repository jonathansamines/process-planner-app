'use strict';

const React = require('react');
const TopNavigation = require('./../components/TopNavigation');
const ProcessSchedulingPage = require('./ProcessScheduling');

const Index = () => {
  return (
    <div className='container'>
      <TopNavigation />
      <div className='jumbotron'>
        {/* <ProcessSchedulingPage /> */}
      </div>
    </div>
  );
};

module.exports = Index;
