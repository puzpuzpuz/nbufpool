[![travis](https://travis-ci.org/puzpuzpuz/nbufpool.svg?branch=master)](https://travis-ci.org/puzpuzpuz/nbufpool.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/puzpuzpuz/nbufpool/badge.svg?branch=master)](https://coveralls.io/github/puzpuzpuz/nbufpool?branch=master)
[![npm](https://img.shields.io/npm/v/nbufpool.svg)](https://www.npmjs.com/package/nbufpool)

# nbufpool

Note: for experimental implementation based on FinalizationGroup API see [this branch](https://github.com/puzpuzpuz/nbufpool/tree/experiment/fg-api-based-pool).

An unsafe Buffer pool for Node.js: a port of `Buffer.allocUnsafe`. See [this issue](https://github.com/nodejs/node/issues/30611) to understand why and when it might be helpful.

## Usage

Using this library as easy as the following two steps.

Step 1. Install it:
```bash
npm install --save nbufpool
```

Step 2. Write some code:
```javascript
const Pool = require('nbufpool');
// create pool
const pool = new Pool(2048); // 2MB
// allocate buffers, where necessary
const buf = pool.allocUnsafe(128); // 128B
```

## Benchmark results

Results of running a (really-really unfare) benchmark on node 12.13.1:

```bash
$ node benchmark/benchmark.js no-pool-def
Starting benchmark: type=no-pool-def, iterations=10000, ops per iteration=1024
Benchmark run finished: size=64, time=0.431686369, rate=23720925.040373467
Benchmark run finished: size=1024, time=1.241307049, rate=8249369.089017394
Benchmark run finished: size=102400, time=17.648105453, rate=580232.2536699997
Benchmark finished

$ node benchmark/benchmark.js
Starting benchmark: type=pool-2mb, iterations=10000, ops per iteration=1024
Benchmark run finished: size=64, time=0.364428314, rate=28098804.63898313
Benchmark run finished: size=1024, time=0.328781967, rate=31145260.469835926
Benchmark run finished: size=102400, time=12.503404789, rate=818976.924510094
Benchmark finished
```

## Credits

The design is inspired by standard `Buffer.allocUnsafe` from [Node.js](https://github.com/nodejs/node).
