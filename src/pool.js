'use strict';

const fgSymbol = Symbol('finalizationGroup');
const sliceCountSymbol = Symbol('sliceCount');

class Pool {

  #reclaim = (sourceBuf) => {
    console.log('reclaimed: ' + sourceBuf);
    sourceBuf[sliceCountSymbol] -= 1;
    if (sourceBuf[sliceCountSymbol] > 0 || sourceBuf === this.#sourceBuf)
      return;
    sourceBuf[fgSymbol].unregister(sourceBuf);
    this.#sourceBufPool.push(sourceBuf);
  }

  #size;
  #offset;
  #sourceBuf;
  #sourceBufPool = [];

  constructor(size) {
    this.#size = size;
    this.#createPool();
  }

  allocUnsafe = (size) => {
    if (size < (this.#size >>> 1)) {
      if (size > (this.#size - this.#offset))
        this.#createPool();
      const slice = this.#sourceBuf.slice(this.#offset, this.#offset + size);
      this.#sourceBuf[fgSymbol].register(slice, this.#sourceBuf, this.#sourceBuf);
      this.#sourceBuf[sliceCountSymbol] += 1;
      this.#offset += size;
      this.#alignPool();
      return slice;
    }
    return Buffer.allocUnsafe(size);
  }

  #createPool = () => {
    this.#offset = 0;
    this.#sourceBuf = Buffer.allocUnsafeSlow(this.#size);
    this.#sourceBuf[fgSymbol] = new FinalizationGroup(this.#reclaim.bind(this));
    this.#sourceBuf[sliceCountSymbol] = 0;
  }

  #alignPool = () => {
    // ensure aligned slices
    if (this.#offset & 0x7) {
      this.#offset |= 0x7;
      this.#offset++;
    }
  }

}

module.exports = Pool;
