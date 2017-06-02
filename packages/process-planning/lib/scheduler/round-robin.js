'use strict';

const createRange = require('lodash/range');
const orderBy = require('lodash/orderBy');
const cloneDeep = require('lodash/cloneDeep');
const getLastItem = require('lodash/last');

function getAllowedTimeToSchedule(executionTime, quantum) {
  if (executionTime >= quantum) {
    return quantum;
  }

  return executionTime;
}

function createScheduleForProcess(previousProcessSchedule, timeToSchedule) {
  const currentExecutionTime = getLastItem(previousProcessSchedule.executionUnits) + 1;

  const executionUnits = createRange(
    currentExecutionTime,
    currentExecutionTime + timeToSchedule
  );

  const waitingUnits = createRange(
    previousProcessSchedule.executionUnits[0],
    currentExecutionTime
  );

  return {
    waitingUnits,
    executionUnits,
  };
}

function createProjection(prioritizedProcessList, quantum) {
  const projection = [];

  // while the process list is not empty
  // keep processing the process queue
  // taking the process which is sooner to start
  while (prioritizedProcessList.length > 0) {
    // the first item in the prioritized process list, is the one which has a higher priority
    const processToSchedule = prioritizedProcessList.shift();

    const timeToSchedule = getAllowedTimeToSchedule(processToSchedule.executionTime, quantum);

    console.info(
      'Executing process [%s] with [%s seconds] remaining by [%s seconds]',
      processToSchedule.name,
      processToSchedule.executionTime,
      timeToSchedule
    );

    processToSchedule.executionTime -= timeToSchedule;

    let previousProjection = getLastItem(projection);

    if (previousProjection === undefined) {
      previousProjection = {
        process: {},
        schedule: {
          executionUnits: [-1],
          waitingUnits: [],
        },
      };
    }

    const currentProcessProjection = {
      process: processToSchedule,
      schedule: createScheduleForProcess(
        previousProjection.schedule,
        timeToSchedule
      ),
    };

    projection.push(currentProcessProjection);

    // has the next process in the queue
    // wait for a long time?
    const pendingProjections = prioritizedProcessList.map((p) => {
      const projectionsForProcess = projection.filter(pr => pr.process.name === p.name);

      const totalWaitingTime = projectionsForProcess.reduce((total, pr) => (
        total + pr.schedule.waitingUnits.length
      ), 0);

      return {
        process: p,
        totalWaitingTime,
      };
    });

    const priorityProcess = getLastItem(orderBy(pendingProjections, 'totalWaitingTime'));

    const isPrioritizedProcessAvailable = (
      priorityProcess &&
      priorityProcess.waitingTime > 0 &&
      priorityProcess.process.executionTime > 0
    );

    if (isPrioritizedProcessAvailable) {
      console.info('Scheduling priority process [%s] by waiting time [%s]', priorityProcess.process.name, priorityProcess.totalWaitingTime);

      const index = prioritizedProcessList.findIndex(p => p.name === priorityProcess.process.name);
      prioritizedProcessList.splice(index, 1);
      prioritizedProcessList.unshift(processToSchedule);

      continue;
    }

    // is the next process in the queue
    // ready to be executed right now?
    const nextProcess = prioritizedProcessList[0];
    const lastExecutionTime = getLastItem(currentProcessProjection.schedule.executionUnits);

    if (nextProcess) {
      console.info(
        '    Next process (%s) start time is [%s seconds] compared to current time [%s seconds]',
        nextProcess.name,
        nextProcess.startTime,
        lastExecutionTime
      );

      if (nextProcess.startTime <= lastExecutionTime && nextProcess.executionTime > 0) {
        // push the current process to the end of the queue
        // if there is still work to be done
        if (processToSchedule.executionTime > 0) {
          console.info('    Scheduling next process. Current process de-prioritized.');
          prioritizedProcessList.push(processToSchedule);
        } else {
          console.info('    Current process completed');
        }

        // eslint-disable-next-line no-continue
        continue;
      }
    }

    // no process are ready yet
    // reschedule the current one for another quantum,
    // if there is work still to be done
    if (processToSchedule.executionTime > 0) {
      console.info('    Re-scheduling current process with priority');
      prioritizedProcessList.unshift(processToSchedule);
    } else {
      console.info('    Current process completed');
    }
  }

  return projection;
}

function buildRoundRobin(options) {
  const prioritizedProcessList = orderBy(options.processList, ['startTime'], ['asc']);

  return (quantum) => {
    const processProjection = createProjection(cloneDeep(prioritizedProcessList), quantum);

    return {
      totalTime: 0,
      projection: processProjection,
    };
  };
}

module.exports = {
  schedule: buildRoundRobin,
};
