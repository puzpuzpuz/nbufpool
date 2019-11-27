'use strict';

class Pool {

  // static #reclaim(holdings) {
  //   for (const file of holdings) {
  //     console.error(`File leaked: ${file}!`);
  //   }
  // }

  // static #finalizationGroup = new FinalizationGroup(this.#cleanUp);

  #size;
  #offset;
  #sourceBuf;

  constructor(size) {
    this.#size = size;
    this.#createPool();
    
    // FileStream.#finalizationGroup.register(this, this.#file, this);
  }

  allocUnsafe = (size) => {
    if (size < (this.#size >>> 1)) {
      if (size > (this.#size - this.#offset))
        this.#createPool();
      const slice = this.#sourceBuf.slice(this.#offset, this.#offset + size);
      this.#offset += size;
      this.#alignPool();
      return slice;
    }
    return Buffer.allocUnsafe(size);
  }

  #createPool = () => {
    this.#sourceBuf = Buffer.allocUnsafeSlow(this.#size);
    this.#offset = 0;
  }

  #alignPool = () => {
    // Ensure aligned slices
    if (this.#offset & 0x7) {
      this.#offset |= 0x7;
      this.#offset++;
    }
  }

}

module.exports = Pool;
