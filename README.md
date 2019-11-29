# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `FinalizationGroup` API. See [this issue](https://github.com/nodejs/node/issues/30683) for more details.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js
```

Note: `--noincremental-marking` flag can be removed once [this PR](https://github.com/nodejs/node/pull/30616) in node core is merged. If you use nightly builds of Node.js 13 or 14, this bug is already fixed there.

## Intermediate results

TODO: include GC stats and allocation rate

Results with v14 nightly:

```
Starting benchmark: type=no-pool-def, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.963529372, rate=353826.7613971197
Benchmark run finished: size=32768, time=2.007140891, rate=522422.71815685905
Benchmark run finished: size=131072, time=3.713380086, rate=282377.77327273577
Benchmark run finished: size=524288, time=10.219404426, rate=102606.37081083065
Benchmark finished

Starting benchmark: type=no-pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.6367654310000002, rate=640639.1411623111
Benchmark run finished: size=32768, time=1.99131455, rate=526574.76941551
Benchmark run finished: size=131072, time=1.871116091, rate=560401.3588700414
Benchmark run finished: size=524288, time=7.72250122, rate=135781.9144507691
Benchmark finished

Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.1272403300000002, rate=492927.84891869733
Pool stats:  { reclaimedCnt: 4084, sourcePoolSize: 452 }
Benchmark run finished: size=32768, time=2.085717801, rate=502741.0704829095
Pool stats:  { reclaimedCnt: 16272, sourcePoolSize: 880 }
Benchmark run finished: size=131072, time=2.368386165, rate=442738.6105762022
Pool stats:  { reclaimedCnt: 63744, sourcePoolSize: 768 }
Benchmark run finished: size=524288, time=3.689377827, rate=284214.85929855134
Pool stats:  { reclaimedCnt: 261888, sourcePoolSize: 11008 }
Benchmark finished

```

## TODO

* Compare allocation rate and execution time with `Buffer.allocUnsafe`
* Implement shrinking on idle for source pool
* Expose metrics (source pool size, total allocated cnt/size, reclaimed cnt/size)
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary
