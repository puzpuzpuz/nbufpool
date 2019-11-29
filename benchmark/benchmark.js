'use strict';

const Pool = require('../src/pool');

const poolSize = 2 * 1024 * 1024;
const allocSizes = [8 * 1024, 32 * 1024, 128 * 1024, 512 * 1024];
const allocsPerIteration = 1024;
const iterations = 1024;

let pool;
let allocFn;

const args = process.argv.slice(2);
const type = args[0] || 'pool-2mb';
switch (type) {
  case 'no-pool-2mb':
    Buffer.poolSize = poolSize;
    allocFn = (size) => Buffer.allocUnsafe(size);
    break;
  case 'no-pool-def':
    allocFn = (size) => Buffer.allocUnsafe(size);
    break;
  default:
    pool = new Pool(poolSize);
    allocFn = (size) => pool.allocUnsafe(size);
}

class Benchmark {

  _allocSize;
  _allocFn;

  _startTime;
  _interval;
  _iteration = 0;
  _slices = [];

  constructor(allocFn, allocSize) {
    this._allocFn = allocFn;
    this._allocSize = allocSize;
  }

  async run() {
    this._startTime = process.hrtime();
    return new Promise((resolve) => {
      this._interval = setInterval(() => {
        const done = this._runIteration();
        if (done) {
          const elapsed = process.hrtime(this._startTime);
          const time = elapsed[0] + elapsed[1] / 1e9;
          resolve({
            time,
            rate: (allocsPerIteration * iterations) / time
          });
          clearInterval(this._interval);
        }
      }, 0);
    });
  }

  _runIteration() {
    if (this._iteration === iterations) {
      return true;
    }
    this._slices = [];
    for (let i = 0; i < allocsPerIteration; i++) {
      const buf = this._allocFn(this._allocSize);
      this._slices.push(buf);
    }
    this._iteration++;
    return false;
  }

}

async function runAll() {
  for (let allocSize of allocSizes) {
    const benchmark = new Benchmark(allocFn, allocSize);
    const result = await benchmark.run();
    console.log(`Benchmark run finished: size=${allocSize}, time=${result.time}, rate=${result.rate}`);
    if (pool) {
      console.log('Pool stats: ', pool.stats());
      pool = new Pool(poolSize);
    }
  }
}

console.log(`Starting benchmark: type=${type}, iterations=${iterations}, ops per iteration=${allocsPerIteration}`);
runAll()
  .then(() => console.log('Benchmark finished'))
  .catch(console.error);
