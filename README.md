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
Benchmark run finished: size=8192, time=3.020359439, rate=347169.276100188
Benchmark run finished: size=16384, time=2.847347805, rate=368264.1081495838
Benchmark run finished: size=32768, time=2.061044753, rate=508759.4524445535
Benchmark run finished: size=65536, time=2.5931634199999998, rate=404361.7119973103
Benchmark run finished: size=131072, time=3.712330137, rate=282457.6374684642
Benchmark run finished: size=262144, time=6.616578315, rate=158477.07834468517
Benchmark run finished: size=524288, time=11.344149619, rate=92433.195542817
Benchmark finished

Starting benchmark: type=no-pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=1.6633010910000001, rate=630418.6329665553
Benchmark run finished: size=16384, time=1.796971164, rate=583524.1104625762
Benchmark run finished: size=32768, time=2.04675067, rate=512312.5231467494
Benchmark run finished: size=65536, time=1.504311737, rate=697047.0110744074
Benchmark run finished: size=131072, time=2.06939198, rate=506707.28896900435
Benchmark run finished: size=262144, time=4.269595161, rate=245591.4344240564
Benchmark run finished: size=524288, time=9.601368324, rate=109211.10039898519
Benchmark finished

// no throttling
Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.145832006, rate=488657.07896427007
Pool stats:  reclaimedCnt: 3880, reusedCnt: 3648, allocatedCnt: 448, sourcePoolSize: 232
Benchmark run finished: size=16384, time=2.160708108, rate=485292.75940496445
Pool stats:  reclaimedCnt: 7679, reusedCnt: 7480, allocatedCnt: 712, sourcePoolSize: 199
Benchmark run finished: size=32768, time=2.203816723, rate=475800.00145048357
Pool stats:  reclaimedCnt: 15680, reusedCnt: 15440, allocatedCnt: 944, sourcePoolSize: 240
Benchmark run finished: size=65536, time=2.249286621, rate=466181.5840676714
Pool stats:  reclaimedCnt: 32064, reusedCnt: 31200, allocatedCnt: 1568, sourcePoolSize: 864
Benchmark run finished: size=131072, time=2.496499574, rate=420018.4974676066
Pool stats:  reclaimedCnt: 64320, reusedCnt: 63040, allocatedCnt: 2496, sourcePoolSize: 1280
Benchmark run finished: size=262144, time=2.773130518, rate=378119.95980493556
Pool stats:  reclaimedCnt: 126464, reusedCnt: 125696, allocatedCnt: 5376, sourcePoolSize: 768
Benchmark run finished: size=524288, time=3.580863628, rate=292827.68318816304
Pool stats:  reclaimedCnt: 261888, reusedCnt: 251648, allocatedCnt: 10496, sourcePoolSize: 10240
Benchmark finished

// with throttling
$ node --harmony-weak-refs benchmark/benchmark.js
Starting benchmark: type=pool-2mb, iterations=1024, ops per iteration=1024
Benchmark run finished: size=8192, time=2.029559136, rate=516652.1050806178
Pool stats:  reclaimedCnt: 2212, reusedCnt: 2212, allocatedCnt: 1884, sourcePoolSize: 0
Benchmark run finished: size=16384, time=2.023711071, rate=518145.11222783144
Pool stats:  reclaimedCnt: 4653, reusedCnt: 4653, allocatedCnt: 3539, sourcePoolSize: 0
Benchmark run finished: size=32768, time=2.054507821, rate=510378.1982633786
Pool stats:  reclaimedCnt: 9846, reusedCnt: 9789, allocatedCnt: 6595, sourcePoolSize: 57
Benchmark run finished: size=65536, time=2.021202645, rate=518788.1594128827
Pool stats:  reclaimedCnt: 21231, reusedCnt: 21231, allocatedCnt: 11537, sourcePoolSize: 0
Benchmark run finished: size=131072, time=3.030073153, rate=346056.3316637524
Pool stats:  reclaimedCnt: 43480, reusedCnt: 43416, allocatedCnt: 22120, sourcePoolSize: 64
Benchmark run finished: size=262144, time=4.226640938, rate=248087.3145794529
Pool stats:  reclaimedCnt: 87424, reusedCnt: 87297, allocatedCnt: 43775, sourcePoolSize: 127
Benchmark run finished: size=524288, time=5.644503512, rate=185769.39455715942
Pool stats:  reclaimedCnt: 174848, reusedCnt: 174336, allocatedCnt: 87808, sourcePoolSize: 512
Benchmark finished
```

## TODO

* Compare allocation rate and execution time with `Buffer.allocUnsafe`
* Implement shrinking on idle for source pool
* Expose metrics (source pool size, total allocated cnt/size, reclaimed cnt/size)
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary
