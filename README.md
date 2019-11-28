# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `FinalizationGroup` API. See [this issue](https://github.com/nodejs/node/issues/30683) for more details.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js
```

Note: `--noincremental-marking` flag can be removed once [this PR](https://github.com/nodejs/node/pull/30616) in node core is merged.

## Intermediate results

TODO: include GC stats and allocation rate

```
$ time node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js with-pool

real    0m15.260s
user    0m3.835s
sys     0m0.382s

$ time node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js no-pool

real    0m17.834s
user    0m24.639s
sys     0m1.678s
```

## TODO

* Compare allocation rate and execution time with `Buffer.allocUnsafe`
* Implement shrinking on idle for source pool
* Expose metrics (source pool size, total allocated cnt/size, reclaimed cnt/size)
* Experiment with different allocation sizes and implement a threshold for fallback to `Buffer.allocUnsafe` for small buffers, if necessary
