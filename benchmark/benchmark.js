'use strict';

const Pool = require('../');

const size = 2 * 1024 * 1024;
const allocSizes = [64, 1024, 100 * 1024];
const allocsPerIteration = 1024;
const iterations = 10000;

let pool;
let allocFn;

const args = process.argv.slice(2);
const type = args[0] || 'pool-2mb';
switch (type) {
  case 'no-pool-def':
    allocFn = (size) => Buffer.allocUnsafe(size);
    break;
  default:
    pool = new Pool(size);
    allocFn = (size) => pool.allocUnsafe(size);
}

class Benchmark {

  _allocSize;
  _allocFn;

  _startTime;
  _interval;
  _iteration = 0;

  constructor(allocFn, allocSize) {
    this._allocFn = allocFn;
    this._allocSize = allocSize;
  }

  run() {
    this._startTime = process.hrtime();
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < allocsPerIteration; j++) {
        this._allocFn(this._allocSize);
      }
    }
    const elapsed = process.hrtime(this._startTime);
    const time = elapsed[0] + elapsed[1] / 1e9;
    return {
      time,
      rate: (allocsPerIteration * iterations) / time
    };
  }

}

function runAll() {
  for (let allocSize of allocSizes) {
    const benchmark = new Benchmark(allocFn, allocSize);
    const result = benchmark.run();
    console.log(`Benchmark run finished: size=${allocSize}, time=${result.time}, rate=${result.rate}`);
  }
}

console.log(`Starting benchmark: type=${type}, iterations=${iterations}, ops per iteration=${allocsPerIteration}`);
runAll();
console.log('Benchmark finished');
