'use strict';

const sliceCountSymbol = Symbol('sliceCount');

class Pool {

  _size;
  _fg;
  _useFG;
  _sourcePool = [];

  _source;
  _offset;

  _reclaimedCnt = 0;
  _reusedCnt = 0;
  _allocatedCnt = 0;

  constructor(size) {
    this._size = size;
    this._fg = new FinalizationGroup(this._reclaim.bind(this));
    this._createSource();
  }

  allocUnsafe = (size) => {
    if (size < (this._size >>> 1)) {
      if (size > (this._size - this._offset)) {
        this._createSource();
      }
      const slice = this._source.slice(this._offset, this._offset + size);
      this._source[sliceCountSymbol] += 1;
      this._offset += size;
      this._alignSource();
      if (this._useFG) {
        this._fg.register(slice, this._source);
      }
      return slice;
    }
    return Buffer.allocUnsafe(size);
  }

  stats = () => ({
    reclaimedCnt: this._reclaimedCnt,
    reusedCnt: this._reusedCnt,
    allocatedCnt: this._allocatedCnt,
    sourcePoolSize: this._sourcePool.length
  })

  _createSource = () => {
    // all slices may be already GCed
    if (this._source && this._source[sliceCountSymbol] === 0) {
      this._reclaimedCnt++;
      this._sourcePool.push(this._source);
    }
    const pooled = this._sourcePool.pop();
    if (pooled) {
      this._source = pooled;
      this._reusedCnt++;
      // simplest feedback to avoid too many registrations
      // TODO: need to improve
      this._useFG = this._sourcePool.length === 0;
    } else {
      this._source = Buffer.allocUnsafeSlow(this._size);
      this._allocatedCnt++;
      this._useFG = true;
    }
    this._source[sliceCountSymbol] = 0;
    this._offset = 0;
  }

  _reclaim = (iter) => {
    for (const source of iter) {
      source[sliceCountSymbol] -= 1;
      if (source[sliceCountSymbol] > 0 || source === this._source) {
        continue;
      }
      this._reclaimedCnt++;
      this._sourcePool.push(source);
    }
  }

  _alignSource = () => {
    // ensure aligned slices
    if (this._offset & 0x7) {
      this._offset |= 0x7;
      this._offset++;
    }
  }

}

module.exports = Pool;
