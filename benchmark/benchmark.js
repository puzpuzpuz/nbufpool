'use strict';

const Pool = require('../src/pool');

const poolSize = 2 * 1024 * 1024;
const allocSize = 128 * 1024;
const allocsPerIteration = 100;
const iterations = 10000;

let iteration = 0;
let slices = [];
let pool;

let runIteration;
const args = process.argv.slice(2);
switch (args[0]) {
  case 'with-pool':
    runIteration = runIterationWithPool;
    pool = new Pool(poolSize);
    break;
  case 'no-pool':
    runIteration = runIterationNoPool;
    break;
  default:
    runIteration = runIterationWithPool;
    pool = new Pool(poolSize);
}

setInterval(() => {
  const done = runIteration();
  if (done) {
    process.exit();
  }
}, 0);

function runIterationWithPool() {
  if (iteration === iterations) {
    return true;
  }
  slices = [];
  for (let i = 0; i < allocsPerIteration; i++) {
    const buf = pool.allocUnsafe(allocSize);
    buf.write('hello benchmark ' + i);
    slices.push(buf);
  }
  iteration++;
  return false;
}

function runIterationNoPool() {
  if (iteration === iterations) {
    return true;
  }
  slices = [];
  for (let i = 0; i < allocsPerIteration; i++) {
    const buf = Buffer.allocUnsafe(allocSize);
    buf.write('hello benchmark ' + i);
    slices.push(buf);
  }
  iteration++;
  return false;
}
