'use strict';

const createRange = require('lodash/range');

function createScheduleForProcess(previousSchedule, currentProcess) {
  const completionTime = previousSchedule.completionTime + currentProcess.executionTime;
  const serviceTime = completionTime - currentProcess.startTime;

  return {
    completionTime,
    serviceTime,
    cpuUsage: currentProcess.executionTime / serviceTime,
    waitingUnits: createRange(
      currentProcess.startTime,
      previousSchedule.completionTime
    ),
    executionUnits: createRange(
      previousSchedule.completionTime,
      completionTime
    ),
  };
}

function createProjection(projection, currentProcess, index) {
  // the first item, has no previous process, and thus there is no projection for it yet
  if (index === 0) {
    const fakeSchedule = { completionTime: currentProcess.startTime };

    return projection.concat({
      process: currentProcess,
      schedule: createScheduleForProcess(fakeSchedule, currentProcess),
    });
  }

  // it is safe to access the previous process projection
  // at least one is guarateed to exist
  const previousProjection = projection[index - 1];

  return projection.concat({
    process: currentProcess,
    schedule: createScheduleForProcess(previousProjection.schedule, currentProcess),
  });
}

function buildFirstInFirstOut(options) {
  return () => {
    const processExecutionProjection = options.processList.reduce(createProjection, []);
    const lastProjectedProcess = processExecutionProjection[processExecutionProjection.length - 1];

    return {
      // the last scheduled process completion time
      // is the totalTime used to compute a set of process with this algorithm
      totalTime: lastProjectedProcess.schedule.completionTime,
      projection: processExecutionProjection,
    };
  };
}

module.exports = {
  schedule: buildFirstInFirstOut,
};
