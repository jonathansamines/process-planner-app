'use strict';

const orderBy = require('lodash/orderBy');
const cloneDeep = require('lodash/cloneDeep');
const getLastItem = require('lodash/last');
const projectedTimes = require('./../projected-times');

function getAllowedTimeToSchedule(executionTime, quantum) {
  if (executionTime >= quantum) {
    return quantum;
  }

  return executionTime;
}

function findProcessWithHigherWaitingTime(prioritizedProcessList, projection) {
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

  return getLastItem(orderBy(pendingProjections, 'totalWaitingTime'));
}

function createProjection(prioritizedProcessList, quantum) {
  let currentTime = 0;
  const projection = [];

  // while the process list is not empty
  // keep processing the process queue
  // taking the process which is sooner to start
  while (prioritizedProcessList.length > 0) {
    // the first item in the prioritized process list, is the one which has a higher priority
    const processToSchedule = prioritizedProcessList.shift();

    console.info(
      'Evaluating process (%s) with (%s seconds) remaining',
      processToSchedule.name,
      processToSchedule.executionTime
    );

    // is there other process with a longer waiting time
    const priorityProcess = findProcessWithHigherWaitingTime(prioritizedProcessList, projection);

    const isPrioritizedProcessAvailable = (
      priorityProcess &&
      priorityProcess.totalWaitingTime > 0 &&
      priorityProcess.process.executionTime > 0
    );

    if (isPrioritizedProcessAvailable) {
      console.info(
        '    Scheduling priority process (%s) due long waiting time (%s)',
        priorityProcess.process.name,
        priorityProcess.totalWaitingTime
      );

      const index = prioritizedProcessList.findIndex(p => p.name === priorityProcess.process.name);
      prioritizedProcessList.splice(index, 1);
      prioritizedProcessList.unshift(processToSchedule);
      prioritizedProcessList.unshift(priorityProcess.process);

      // eslint-disable-next-line no-continue
      continue;
    }

    // there are not priority process, proceed with the current one
    const timeToSchedule = getAllowedTimeToSchedule(processToSchedule.executionTime, quantum);

    console.log(
      '    Scheduling process (%s) by (%s seconds)',
      processToSchedule.name,
      timeToSchedule
    );

    processToSchedule.executionTime -= timeToSchedule;

    let currentProcessProjection = projection.find(p => p.process.name === processToSchedule.name);

    if (!currentProcessProjection) {
      currentProcessProjection = {
        process: processToSchedule,
        schedule: {
          executionUnits: [],
          waitingUnits: [],
        },
      };

      projection.push(currentProcessProjection);
    }

    for (let timeUnit = 0; timeUnit < timeToSchedule; timeUnit += 1) {
      const hasProcessToScheduleStarted = processToSchedule.startTime <= currentTime;

      if (hasProcessToScheduleStarted) {
        currentProcessProjection.schedule.executionUnits.push(currentTime);

        projection.forEach(item => {
          // ignore the current projection
          if (item.process.name === processToSchedule.name) return;

          const test = getLastItem(currentProcessProjection.schedule.executionUnits);

          // if the start time for the current process already started, then create a waiting entry for the current time
          if (item.process.startTime <= currentTime && currentTime < test && item.process.executionTime > 0) {
            item.schedule.waitingUnits.push(currentTime);
          }
        });

        currentTime += 1;

        continue;
      }

      currentProcessProjection.schedule.waitignUnits.push(currentTime);
    }

    // is the next process in the queue
    // ready to be executed right now?
    const nextProcess = prioritizedProcessList[0];
    const lastExecutionTime = getLastItem(currentProcessProjection.schedule.executionUnits);

    if (nextProcess) {
      if (nextProcess.startTime <= lastExecutionTime && nextProcess.executionTime > 0) {
        // push the current process to the end of the queue
        // if there is still work to be done
        if (processToSchedule.executionTime > 0) {
          console.info('    Scheduling next process. Current process de-prioritized');
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
      console.info(
        '    Next process not yet ready (%s seconds remaining). Re-scheduling current process with priority',
        nextProcess.startTime - lastExecutionTime
      );

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
    const processList = cloneDeep(prioritizedProcessList);
    const processProjection = createProjection(processList, quantum);
    let completeProjection = prioritizedProcessList.map((proc, index) => {
      return {
        process: proc,
        schedule: processProjection[index].schedule,
      };
    });

    // complete projection
    completeProjection = completeProjection.map((pro) => {
      const completionTime = getLastItem(pro.schedule.executionUnits) + 1;
      const startTime = pro.schedule.executionUnits[0];
      const serviceTime = completionTime - startTime;

      return Object.assign({}, pro, {
        schedule: Object.assign({}, pro.schedule, {
          completionTime,
          serviceTime,
          cpuUsage: pro.process.executionTime / serviceTime,
        }),
      });
    });

    const computedProjectedTimes = projectedTimes.compute(completeProjection);

    return Object.assign({}, computedProjectedTimes, {
      // projection: orderBy(completeProjection, ['process.name'], ['asc']),
      projection: completeProjection,
    });
  };
}

module.exports = {
  schedule: buildRoundRobin,
};
