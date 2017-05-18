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

function createPlanForProcess(previousPlan, currentProcess, quantum) {
  const lastExecutionUnit = previousPlan.executionUnits[previousPlan.executionUnits.length - 1];
  const totalExecutionUnits = previousPlan.executionUnits.length;
  const remainingExecutionTime = currentProcess.executionTime - totalExecutionUnits;

  const newPlan = {
    waitingUnits: createRange(
      currentProcess.startTime,
      totalExecutionUnits - currentProcess.startTime
    ),
    executionUnits: createRange(
      lastExecutionUnit + 1,

      // schedule the quantum or the remaining time,
      // dependening on which one is larger
      quantum > remainingExecutionTime ? quantum : remainingExecutionTime
    ),
  };

  // if we already have a plan created,
  // the new plan is appended to the end of the last plan we had
  if (currentProcess.name === previousPlan.process.name) {
    return {
      waitingUnits: previousPlan.waitingUnits.concat(newPlan.waitingUnits),
      executionUnits: previousPlan.executionUnits.concat(newPlan.executionUnits),
    };
  }

  // if not, we just create a new plan
  return newPlan;
}

function createSchedule(quantum) {
  return (schedule, currentProcess, index, processList) => {
    // the first time, no previous process are yet scheduled
    // we can schedule this process right away
    if (index === 0) {
      const emptyPlan = { executionUnits: [0], waitingUnits: [], process: currentProcess };

      return schedule.concat({
        process: currentProcess,
        plan: createPlanForProcess(emptyPlan, currentProcess, quantum),
      });
    }

    // is there a process ready to be scheduled?
    const previousScheduledPlan = schedule[index - 1];

    if (currentProcess.startTime >= previousScheduledPlan.completionTime) {
      return schedule.concat({
        process: currentProcess,
        plan: createPlanForProcess(previousScheduledPlan, currentProcess, quantum),
      });
    }

    // is there a process which have been waiting for a long time?
    // which one?


    // if not, we can prioritize the last scheduled process again
    // only if the execution time is not yet exhausted
    const previousScheduledProcess = processList[index - 1];

    return schedule.concat({
      process: previousScheduledProcess,
      plan: createPlanForProcess(previousScheduledProcess, previousScheduledProcess, quantum),
    });
  };
}

function buildRoundRobin(options) {
  const sortedProcessList = orderByStartTime(options.processList);

  return () => {
    // a "first plan" with completion time equal to the process startTime is simulated
    // in order to schedule the first process as soon as possible
    const processListSchedule = sortedProcessList.reduce(createSchedule(options.quantum), []);

    return {
      totalTime: 0,
      schedule: processListSchedule,
    };
  };
}

module.exports = {
  schedule: buildRoundRobin,
};
