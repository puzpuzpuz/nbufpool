'use strict';

const Pool = require('../src/pool');

const pool = new Pool(1024 * 1024);

let buf = pool.allocUnsafe(1024);
buf.write('hello benchmark');
console.log(buf);
