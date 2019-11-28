# nbufpool

An experimental project: a Buffer pool for Node.js built on top of `FinalizationGroup` API.

## Running

Run benchmark (requires Node.js v13):

```bash
node --harmony-weak-refs --noincremental-marking benchmark/benchmark.js
```

## Intermediate results

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
