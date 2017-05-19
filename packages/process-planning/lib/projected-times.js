'use strict';

const last = require('lodash/last');
const meanBy = require('lodash/meanBy');

function computeProjectedTimes(projection) {
  const lastProjectedProcess = last(projection);

  // the last scheduled process completion time
  // is the totalTime used to compute a set of process with this algorithm
  const totalTime = lastProjectedProcess.schedule.completionTime;

  return {
    totalTime,
    averageServiceTime: meanBy(projection, 'schedule.serviceTime'),
    averageWaitingTime: meanBy(projection, 'schedule.waitingUnits.length'),
    averageCPUUsage: meanBy(projection, 'schedule.cpuUsage'),
  };
}

module.exports = {
  compute: computeProjectedTimes,
};
