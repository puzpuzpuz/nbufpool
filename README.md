# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `FinalizationGroup` API. See [this issue](https://github.com/nodejs/node/issues/30683) for more details.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js
```

Note: `--noincremental-marking` flag can be removed once [this PR](https://github.com/nodejs/node/pull/30616) in node core is merged. If you use nightly builds of Node.js 13 or 14, this bug is already fixed there.

## Intermediate results

Results with v14 nightly:

```
Starting benchmark: type=no-pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.6304374080000001, rate=643125.5777468029
Benchmark run finished: size=16384, time=1.723873866, rate=608267.2408237553
Benchmark run finished: size=32768, time=1.750619311, rate=598974.3134965338
Benchmark run finished: size=65536, time=1.145353899, rate=915503.9336885341
Benchmark run finished: size=131072, time=1.9197706079999999, rate=546198.5904099226
Benchmark run finished: size=262144, time=3.887365281, rate=269739.508433913
Benchmark run finished: size=524288, time=7.738465996, rate=135501.7907350122
Benchmark finished

Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.6481132569999999, rate=636228.1205775168
Pool stats:  {
  reclaimedCnt: 3736,
  reusedCnt: 3584,
  allocatedCnt: 512,
  sourcePoolSize: 152
}
Benchmark run finished: size=16384, time=1.677368811, rate=625131.4517854118
Pool stats:  {
  reclaimedCnt: 7792,
  reusedCnt: 7424,
  allocatedCnt: 768,
  sourcePoolSize: 368
}
Benchmark run finished: size=32768, time=1.674900904, rate=626052.5607788436
Pool stats:  {
  reclaimedCnt: 15584,
  reusedCnt: 15280,
  allocatedCnt: 1104,
  sourcePoolSize: 304
}
Benchmark run finished: size=65536, time=1.66275752, rate=630624.7227196422
Pool stats:  {
  reclaimedCnt: 31840,
  reusedCnt: 31136,
  allocatedCnt: 1632,
  sourcePoolSize: 704
}
Benchmark run finished: size=131072, time=1.874655374, rate=559343.3409377141
Pool stats:  {
  reclaimedCnt: 63488,
  reusedCnt: 62656,
  allocatedCnt: 2880,
  sourcePoolSize: 832
}
Benchmark run finished: size=262144, time=2.197768472, rate=477109.40135827014
Pool stats:  {
  reclaimedCnt: 128256,
  reusedCnt: 125440,
  allocatedCnt: 5632,
  sourcePoolSize: 2816
}
Benchmark run finished: size=524288, time=2.751443021, rate=381100.38695945794
Pool stats:  {
  reclaimedCnt: 252416,
  reusedCnt: 251648,
  allocatedCnt: 10496,
  sourcePoolSize: 768
}
Benchmark finished
```

## TODO

* Compare GC stats, allocation rate and execution time with `Buffer.allocUnsafe` => Partially done (see results section; GC stats and allocation rate comparison is TBD)
* Implement shrinking on idle for source pool => Partially implemented via weak refs, yet the pool may hold an array of empty refs
* Expose metrics (source pool size, total allocated cnt, reclaimed cnt) => Done
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary => Done. No need for that with current implementation, as FG tracks source buffers now
