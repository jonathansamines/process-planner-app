'use strict';

const builder = require('./lib/scheduler');

const scheduler = builder.create({
  processList: [
    {
      name: 'Process A',
      startTime: 5,
      executionTime: 4,
    },
    {
      name: 'Process B',
      startTime: 6,
      executionTime: 5,
    },
    {
      name: 'Process C',
      startTime: 7,
      executionTime: 4,
    },
    {
      name: 'Process D',
      startTime: 0,
      executionTime: 6,
    },
    {
      name: 'Process E',
      startTime: 12,
      executionTime: 3,
    },
    {
      name: 'Process C',
      startTime: 15,
      executionTime: 2,
    },
  ],
});

console.log(
  JSON.stringify(scheduler.roundRobin(3))
);

module.exports = builder;
