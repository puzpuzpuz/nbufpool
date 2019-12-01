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

```
$ node --harmony-weak-refs benchmark/benchmark.js no-pool-2mb
Starting benchmark: type=no-pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.627691246, rate=644210.6281377642
Benchmark run finished: size=16384, time=1.824021953, rate=574870.2740531106
Benchmark run finished: size=32768, time=2.029613017, rate=516638.3892974411
Benchmark run finished: size=65536, time=1.438423182, rate=728976.0156270897
Benchmark run finished: size=131072, time=1.937984933, rate=541065.0940287779
Benchmark run finished: size=262144, time=3.819943513, rate=274500.3941632893
Benchmark run finished: size=524288, time=7.852204501, rate=133539.05898228465
Benchmark finished

$ node --harmony-weak-refs benchmark/benchmark.js
Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.639885886, rate=639420.1016984666
Pool stats:  { reclaimedCnt: 3724, reusedCnt: 3584, allocatedCnt: 512 }
Benchmark run finished: size=16384, time=1.717398857, rate=610560.5554155787
Pool stats:  { reclaimedCnt: 7712, reusedCnt: 7431, allocatedCnt: 761 }
Benchmark run finished: size=32768, time=1.695830385, rate=618325.9890109823
Pool stats:  { reclaimedCnt: 15536, reusedCnt: 15280, allocatedCnt: 1104 }
Benchmark run finished: size=65536, time=1.725541465, rate=607679.398767737
Pool stats:  { reclaimedCnt: 31936, reusedCnt: 31136, allocatedCnt: 1632 }
Benchmark run finished: size=131072, time=1.852775423, rate=565948.7852565281
Pool stats:  { reclaimedCnt: 63424, reusedCnt: 62656, allocatedCnt: 2880 }
Benchmark run finished: size=262144, time=2.221213859, rate=472073.40965902014
Pool stats:  { reclaimedCnt: 130560, reusedCnt: 125312, allocatedCnt: 5760 }
Benchmark run finished: size=524288, time=2.875696729, rate=364633.72143022664
Pool stats:  { reclaimedCnt: 259840, reusedCnt: 251648, allocatedCnt: 10496 }
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
