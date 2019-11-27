'use strict';

const Pool = require('../src/pool');

const pool = new Pool(1024 * 1024);

let bufs = [];
for (let i = 0; i < 20; i++) {
  const buf = pool.allocUnsafe(100 * 1024);
  buf.write('hello benchmark ' + i);
  bufs.push(buf);
}
console.log(bufs.length);
console.log(bufs[0]);

setInterval(() => {
  bufs = [];
  const buf = Buffer.allocUnsafe(10 * 1024 * 1024);
  buf.write('hello benchmark');
}, 100);
