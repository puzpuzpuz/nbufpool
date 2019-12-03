'use strict';

class Pool {

  _size;
  _offset;
  _source;

  constructor(size) {
    // TODO validate size
    this._size = size;
    this._createSource();
  }

  allocUnsafe = (size) => {
    // TODO validate size
    if (size < (this._size >>> 1)) {
      if (size > (this._size - this._offset)) {
        this._createSource();
      }
      const slice = this._source.slice(this._offset, this._offset + size);
      this._offset += size;
      this._alignSource();
      return slice;
    }
    return Buffer.allocUnsafeSlow(size);
  }

  _createSource = () => {
    this._source = Buffer.allocUnsafeSlow(this._size);
    this._offset = 0;
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
