'use strict';

const builder = require('./lib/scheduler');

const scheduler = builder.create({
  processList: [
    {
      name: 'Process F',
      startTime: 14,
      executionTime: 3,
    },
    {
      name: 'Process A',
      startTime: 0,
      executionTime: 5,
    },
    {
      name: 'Process D',
      startTime: 8,
      executionTime: 2,
    },
    {
      name: 'Process B',
      startTime: 3,
      executionTime: 3,
    },
    {
      name: 'Process E',
      startTime: 13,
      executionTime: 6,
    },
    {
      name: 'Process C',
      startTime: 5,
      executionTime: 4,
    },
  ],
});

// eslint-disable-next-line no-console
console.log(JSON.stringify(scheduler.firstComeFirstServed()));
console.log('---');
console.log(JSON.stringify(scheduler.shortestJob()));

module.exports = builder;
