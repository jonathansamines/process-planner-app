'use strict';

const Joi = require('joi');
const orderBy = require('lodash/orderBy');
const firstInFirstOutScheduler = require('./first-in-first-out');
const roundRobinScheduler = require('./round-robin');

const processSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    startTime: Joi.number().integer().min(0).required(),
    executionTime: Joi.number().integer().greater(0).required(),
  });

const schema = Joi.object().keys({
  processList: Joi.array()
    .items(processSchema)
    .min(1)
    .required(),
});

function schedulerBuilder(options) {
  const opts = Joi.attempt(options, schema);

  const firstComeFirstServed = firstInFirstOutScheduler.schedule(
    Object.assign({}, opts, {
      processList: orderBy(opts.processList, ['startTime'], ['asc']),
    })
  );

  const shortestJob = firstInFirstOutScheduler.schedule(
    Object.assign({}, opts, {
      processList: orderBy(opts.processList, ['startTime', 'executionTime'], ['asc', 'asc']),
    })
  );

  return {
    firstComeFirstServed,
    shortestJob,
    roundRobin: roundRobinScheduler.schedule(opts),
  };
}

module.exports = {
  create: schedulerBuilder,
};
