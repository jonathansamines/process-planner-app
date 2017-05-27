'use strict';

const createRange = require('lodash/range');
const orderBy = require('lodash/orderBy');
const cloneDeep = require('lodash/cloneDeep');
const getLastItem = require('lodash/last');

function createScheduleForProcess(previousSchedule, processToSchedule, timeToSchedule) {
  const lastExecutionTime = getLastItem(previousSchedule.executionUnits);

  const executionUnits = createRange(
    lastExecutionTime + 1,
    lastExecutionTime + 1 + timeToSchedule
  );

  const waitingUnits = createRange(
    previousSchedule.executionUnits[0],
    lastExecutionTime
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

    let timeToSchedule;

    if (processToSchedule.executionTime >= quantum) {
      timeToSchedule = quantum;
    } else {
      timeToSchedule = processToSchedule.executionTime;
    }

    console.info(
      'Executing current process [%s] with remaining [%s] by [%s seconds]',
      processToSchedule.name,
      processToSchedule.executionTime,
      timeToSchedule
    );

    processToSchedule.executionTime -= timeToSchedule;

    let previousProjection = getLastItem(projection);

    if (previousProjection === undefined) {
      previousProjection = {
        schedule: {
          executionUnits: [-1],
          waitingUnits: [],
        },
      };
    }

    const currentProcessProjection = {
      process: processToSchedule,
      schedule: createScheduleForProcess(previousProjection.schedule, processToSchedule, quantum),
    };

    projection.push(currentProcessProjection);

    // has the next process in the queue
    // wait for a long time?
    const pendingProjections = prioritizedProcessList.map((p) => {
      const pending = projection.filter(pr => pr.process.name === p.name);

      return getLastItem(pending);
    })
    .filter(p => p !== undefined)
    .map(p => ({ process: p.process, totalWaitingTime: getLastItem(p.schedule.waitingUnits) }));

    const priorityProcess = getLastItem(orderBy(pendingProjections, 'totalWaitingTime'));

    console.log('priorities: ', priorityProcess);

    if (priorityProcess && priorityProcess.process.executionTime > 0) {
      console.info('Scheduling priority process [%s] by waiting time [%s]', priorityProcess.process.name, priorityProcess.totalWaitingTime);
      const index = prioritizedProcessList.findIndex(p => p.name === priorityProcess.process.name);
      prioritizedProcessList.splice(index, 1);
      prioritizedProcessList.unshift(processToSchedule);
    }

    // is the next process in the queue
    // ready to be executed right now?
    const nextProcess = prioritizedProcessList[0];
    const lastExecutionTime = currentProcessProjection.schedule.executionUnits[
      currentProcessProjection.schedule.executionUnits.length - 1
    ];

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
