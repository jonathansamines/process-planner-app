'use strict';

const createRange = require('lodash/range');

function orderByStartTime(processList) {
  return processList
    .splice(0)
    .sort((previous, current) => (
      previous &&
      previous.startTime > current.startTime
    ));
}

function createPlanForProcess(previousPlan, currentProcess) {
  const completionTime = previousPlan.completionTime + currentProcess.executionTime;
  const serviceTime = completionTime - currentProcess.startTime;

  return {
    completionTime,
    serviceTime,
    cpuUsage: currentProcess.executionTime / serviceTime,
    waitingUnits: createRange(
      currentProcess.startTime,
      previousPlan.completionTime
    ),
    executionUnits: createRange(
      previousPlan.completionTime,
      completionTime
    ),
  };
}

function createSchedule(schedule, currentProcess, index) {
  // the first item, has no previous process, and thus there is no scheduled plan yet
  if (index === 0) {
    return schedule.concat({
      process: currentProcess,
      plan: createPlanForProcess({ completionTime: currentProcess.startTime }, currentProcess),
    });
  }

  // it is safe to access the previous plan here
  // since it is guarateed there is at least one plan
  const previousScheduledPlan = schedule[index - 1];

  return schedule.concat({
    process: currentProcess,
    plan: createPlanForProcess(previousScheduledPlan.plan, currentProcess),
  });
}

function buildFirstComeFirstServed(options) {
  const sortedProcessList = orderByStartTime(options.processList);

  return () => {
    // a "first plan" with completion time equal to the process startTime is simulated
    // in order to schedule the first process as soon as possible
    const processListSchedule = sortedProcessList.reduce(createSchedule, []);
    const lastSchedule = processListSchedule[processListSchedule.length - 1];

    return {
      // last scheduled process completion time
      // is the totalTime used to compute a set of process with this algorithm
      totalTime: lastSchedule.plan.completionTime,
      schedule: processListSchedule,
    };
  };
}

module.exports = {
  schedule: buildFirstComeFirstServed,
};
