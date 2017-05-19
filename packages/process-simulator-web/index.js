'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Index = require('./pages/Index');

const rootNode = 'application-root';

ReactDOM.render(
  <Index />,
  document.getElementById(rootNode)
);
