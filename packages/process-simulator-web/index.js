'use strict';

const React = require('react');
const ProcessScheduling = require('./pages/ProcessScheduling');
const ReactDOM = require('react-dom');

const rootNode = 'application-root';

ReactDOM.render(
  <ProcessScheduling />,
  document.getElementById(rootNode)
);
