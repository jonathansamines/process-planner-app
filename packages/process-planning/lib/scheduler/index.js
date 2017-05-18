'use strict';

const Joi = require('joi');
const firstComeFirstServed = require('./first-come-first-served');
const roundRobin = require('./round-robin');

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

  return {
    firstComeFirstServed: firstComeFirstServed.schedule(opts),
    roundRobin: roundRobin.schedule(opts),
  };
}

module.exports = {
  create: schedulerBuilder,
};
