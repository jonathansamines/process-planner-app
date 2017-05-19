# Process Planning
A set of modules, which allows to build a web application which graphically can demonstrate how some of the most used process-planning algorithms work.

## Builder interface

### Creating a scheduler
Even when multiple algorithms are supported, a single builder interface is used, which can schedule the given set of processes with the specified algorithm.

#### `builder.create(options) => Scheduler`

  + `options`
    - **processList[]** - The list of process to schedule, each one with the following information:
      - **name** Name of the process. **Required**
      - **startTime** A number which indicates the time at which the process is planned to start. It should be an integer number. **Required** (ti)
      - **executionTime** A time expressed in milliseconds, which represents the total time a the process needs to be completed. **Required** (t)

##### Usage

```js
  const builder = require('@jonathansamines/process-planning');

  const scheduler = builder.create({
    processList: [
      {
        name: 'Process A',
        startTime: 0,
        executionTime: 1000,
      },
      {
        name: 'Process B',
        startTime: 20,
        executionTime: 4000,
      },
      {
        name: 'Process C',
        startTime: 10,
        executionTime: 6000,
      },
    ],
  });
```

Once we have a working scheduler, the following algorithms can be applied:

## Scheduler
### Supported Algorithms
The following process planning algorithms are supported to be planned by the scheduler instance.

#### FCFS (First Come, First Served)
##### `scheduler.firstComeFirstServed() => SchedulingPlan`
This algorithm plan a set of processes by the time they arrived to the scheduler. First in come (startTime), is the first one to be served. Also is important to note that processes are computed from start to finish without time restrictions (quantum).

#### Round Robin
##### `scheduler.roundRobin(quantum) => SchedulingPlan`
This algorithm plan a set of processed prioritized by the total waiting time for a given process. Is important to note that a quantum should be stablished here, which represents the total amount of time can use the CPU before giving up, time in which another process is scheduled.

A quantum, represented by a number of milliseconds should be specified.

#### SJF (Shortest Job)
##### `scheduler.shortestJob() => SchedulingPlan`
This algorithm plan a set of processes prioritized by total expected execution time. Shortest jobs (the ones which have a shorter execution time), are scheduled first. Process are completed from start to finish.

## SchedulingPlan
A scheduling plan represents, a data-table like structure which have the process allocation for each second, from start to finish.

### Structure
A schedule plan has the following structure:

+ **totalTime** - The total amount of time the list of processes need in order to be completed
+ **averageServiceTime** - The average of service time for all process in the process list
+ **averageWaitingTime** - The average waiting time for all process in the process list
+ **averageCPUUsage** - The average CPU usage for all process in the process list
+ **projection[]**
  - **process** Any of the processed originally specified at the scheduler builder
  - **schedule**
    - **executionUnits[]** An ordered array of moments (seconds) in which this process was active. The length of this array indicates the *execution time* (t).
    - **waitingUnits[]** An ordered array of moments in which this process was waiting. The length of this array indicates the *waiting time* (E)
    - **completionTime** Indicates the time at which the process was completely computed. (tf)
    - **serviceTime** Indicates total amount of time the process took to complete. (T = tf - ti)
    - **cpuUsage** A percent number indicating the % of time the process used the CPU (t/T)
