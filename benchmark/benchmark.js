'use strict';

const Pool = require('../src/pool');

const pool = new Pool(1024 * 1024);

let buf = pool.allocUnsafe(512 * 1024);
buf.write('hello benchmark');
console.log(buf);

setInterval(() => {
  buf = pool.allocUnsafe(100 * 1024);
  buf.write('hello benchmark');
}, 10);
