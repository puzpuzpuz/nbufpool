'use strict';

const rootSliceSymbol = Symbol('rootSlice');

class Pool {

  _size;
  _fg;
  _sourcePoolRef = new WeakRef([]);

  _rootSlice;
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
      const slice = this._rootSlice.slice(this._offset, this._offset + size);
      // keep strong reference to root slice to ensure
      // that it gets GCed only when the last slice is GCed
      slice[rootSliceSymbol] = this._rootSlice;
      this._offset += size;
      this._alignSource();
      return slice;
    }
    return Buffer.allocUnsafeSlow(size);
  }

  stats = () => ({
    reclaimedCnt: this._reclaimedCnt,
    reusedCnt: this._reusedCnt,
    allocatedCnt: this._allocatedCnt
  })

  _createSource = () => {
    let source = this._takeFromPool();
    if (source) {
      this._reusedCnt++;
    } else {
      source = Buffer.allocUnsafeSlow(this._size);
      this._allocatedCnt++;
    }
    this._rootSlice = source.slice();
    this._fg.register(this._rootSlice, source);
    this._offset = 0;
  }

  _takeFromPool() {
    const sourcePool = this._sourcePoolRef.deref();
    if (sourcePool === undefined) {
      return undefined;
    }
    return sourcePool.pop();
  }

  _reclaim = (iter) => {
    const sourcePool = this._sourcePoolRef.deref() || [];
    this._sourcePoolRef = new WeakRef(sourcePool);
    for (const source of iter) {
      this._reclaimedCnt++;
      sourcePool.push(source);
    }
  }

  _alignSource = () => {
    // ensure aligned slices
    if ((this._offset & 0x7) !== 0) {
      this._offset |= 0x7;
      this._offset++;
    }
  }

}

module.exports = Pool;
