# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `WeakRef` and `FinalizationGroup` APIs. See [this issue](https://github.com/nodejs/node/issues/30683) for more details.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js
```

Note: `--noincremental-marking` flag can be removed once [this PR](https://github.com/nodejs/node/pull/30616) in node core is merged. If you use nightly builds of Node.js 13 or 14, this bug is already fixed there.

## Intermediate results

Results with v14 nightly:

```bash
$ node --harmony-weak-refs benchmark/benchmark.js no-pool-2mb
Starting benchmark: type=no-pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.409041662, rate=435266.8600714304
Benchmark run finished: size=16384, time=2.785510972, rate=376439.371641434
Benchmark run finished: size=32768, time=3.404762281, rate=307973.3365972401
Benchmark run finished: size=65536, time=6.752141163, rate=155295.3314640291
Benchmark run finished: size=131072, time=17.371312289, rate=60362.50932314352
Benchmark run finished: size=262144, time=30.570405875, rate=34300.362392555246
Benchmark run finished: size=524288, time=49.877348032, rate=21023.090468387796
Benchmark finished

$ node --harmony-weak-refs benchmark/benchmark.js
Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.770950225, rate=378417.4795128267
Pool stats:  { reclaimedCnt: 3588, reusedCnt: 3588, allocatedCnt: 508 }
Benchmark run finished: size=16384, time=3.12835608, rate=335184.3502418689
Pool stats:  { reclaimedCnt: 7544, reusedCnt: 7472, allocatedCnt: 720 }
Benchmark run finished: size=32768, time=3.76158312, rate=278759.22624833556
Pool stats:  { reclaimedCnt: 15920, reusedCnt: 15296, allocatedCnt: 1088 }
Benchmark run finished: size=65536, time=5.883032266, rate=178237.3362220142
Pool stats:  { reclaimedCnt: 32736, reusedCnt: 31200, allocatedCnt: 1568 }
Benchmark run finished: size=131072, time=10.397053491, rate=100853.18892585085
Pool stats:  { reclaimedCnt: 63424, reusedCnt: 62656, allocatedCnt: 2880 }
Benchmark run finished: size=262144, time=19.336539885, rate=54227.69565993632
Pool stats:  { reclaimedCnt: 130688, reusedCnt: 125568, allocatedCnt: 5504 }
Benchmark run finished: size=524288, time=37.138518921, rate=28234.190012544685
Pool stats:  { reclaimedCnt: 261376, reusedCnt: 250880, allocatedCnt: 11264 }
Benchmark finished
```

## TODO

* Compare GC stats, allocation rate and execution time with `Buffer.allocUnsafe`
  - Partially done (see results section; GC stats and allocation rate comparison is TBD)
* Implement shrinking on idle for source pool
  - Done. Implemented via single weak ref for the array of reclaimed buffers
* Expose metrics (total allocated cnt, reclaimed, cnt reused cnt)
  - Done
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary
  - Done. No need for that with current implementation, as FG tracks source buffers now
