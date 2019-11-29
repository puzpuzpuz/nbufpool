# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `FinalizationGroup` API. See [this issue](https://github.com/nodejs/node/issues/30683) for more details.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js with-pool
```

Note: `--noincremental-marking` flag can be removed once [this PR](https://github.com/nodejs/node/pull/30616) in node core is merged. If you use nightly builds of Node.js 13 or 14, this bug is already fixed there.

## Intermediate results

TODO: include GC stats and allocation rate

```
Starting benchmark: type=with-pool, pool size=2097152, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.075979151, rate=505099.4849803287
Benchmark run finished: size=32768, time=2.115390171, rate=495689.1709033094
Benchmark run finished: size=131072, time=2.456131378, rate=426921.78822040197
Benchmark run finished: size=524288, time=3.219062982, rate=325739.51049212494
Benchmark finished

Starting benchmark: type=no-pool, pool size=2097152, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.641783013, rate=638681.2335717594
Benchmark run finished: size=32768, time=2.101379434, rate=498994.1288251896
Benchmark run finished: size=131072, time=1.845930029, rate=568047.5335070244
Benchmark run finished: size=524288, time=7.756890636, rate=135179.93861271194
Benchmark finished
```

## TODO

* Compare allocation rate and execution time with `Buffer.allocUnsafe`
* Implement shrinking on idle for source pool
* Expose metrics (source pool size, total allocated cnt/size, reclaimed cnt/size)
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary
