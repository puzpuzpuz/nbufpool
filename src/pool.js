'use strict';

const fgSymbol = Symbol('finalizationGroup');
const sliceCountSymbol = Symbol('sliceCount');

class Pool {

  #size;
  #sourcePool = [];

  #source;
  #offset;

  constructor(size) {
    this.#size = size;
    this.#createSource();
  }

  allocUnsafe = (size) => {
    if (size < (this.#size >>> 1)) {
      if (size > (this.#size - this.#offset))
      this.#createSource();
      const slice = this.#source.slice(this.#offset, this.#offset + size);
      this.#source[fgSymbol].register(slice, this.#source, this.#source);
      this.#source[sliceCountSymbol] += 1;
      this.#offset += size;
      this.#alignSource();
      return slice;
    }
    return Buffer.allocUnsafe(size);
  }

  #createSource = () => {
    // TODO: is this brach reachable???
    if (this.#source && this.#source[sliceCountSymbol] === 0) {
      this.#source[fgSymbol].unregister(this.#source);
      delete this.#source[fgSymbol];
      this.#sourcePool.push(this.#source);
    }
    this.#offset = 0;
    this.#source = this.#sourcePool.pop() || Buffer.allocUnsafeSlow(this.#size);
    this.#source[fgSymbol] = new FinalizationGroup(this.#reclaim.bind(this));
    this.#source[sliceCountSymbol] = 0;
  }

  #reclaim = (sourceBuf) => {
    console.log('reclaimed: ' + sourceBuf);
    sourceBuf[sliceCountSymbol] -= 1;
    if (sourceBuf[sliceCountSymbol] > 0 || sourceBuf === this.#source)
      return;
    sourceBuf[fgSymbol].unregister(sourceBuf);
    delete sourceBuf[fgSymbol];
    this.#sourcePool.push(sourceBuf);
  }

  #alignSource = () => {
    // ensure aligned slices
    if (this.#offset & 0x7) {
      this.#offset |= 0x7;
      this.#offset++;
    }
  }

}

module.exports = Pool;
