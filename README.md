# nbufpool

Note: for experimental implementation based on FinalizationGroup API see [this branch](https://github.com/puzpuzpuz/nbufpool/tree/experiment/fg-api-based-pool).

An unsafe Buffer pool for Node.js: a port of `Buffer.allocUnsafe`. See [this issue](https://github.com/nodejs/node/issues/30611) to understand why and when it might be helpful.

## Benchmark results

Results of running a (really-really unfare) benchmark on node 13.2.0:

```bash
$ node benchmark/benchmark.js no-pool-def
Starting benchmark: type=no-pool-def, iterations=10000, ops per iteration=1024
Benchmark run finished: size=64, time=0.476678138, rate=21482000.502401896
Benchmark run finished: size=1024, time=1.906225462, rate=5371872.427543935
Benchmark run finished: size=102400, time=26.776787035, rate=382420.7880734635
Benchmark finished

$ node benchmark/benchmark.js
Starting benchmark: type=pool-2mb, iterations=10000, ops per iteration=1024
Benchmark run finished: size=64, time=0.435040738, rate=23538025.535438478
Benchmark run finished: size=1024, time=0.420123883, rate=24373763.10739278
Benchmark run finished: size=102400, time=13.388494122, rate=764835.8289356539
Benchmark finished
```

## Credits

The design is inspired by standard `Buffer.allocUnsafe` from [Node.js](https://github.com/nodejs/node).
