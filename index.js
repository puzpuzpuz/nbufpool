'use strict';

const validateSize = (size) => {
  if (typeof size !== 'number') {
    throw new TypeError(`Size is supposed to be number: ${size}`);
  }
  if (size < 0) {
    throw new RangeError(`Invalid size: ${size}`);
  }
}

class Pool {

  _size;
  _offset;
  _source;

  constructor(size) {
    validateSize(size);
    this._size = size;
    this._createSource();
  }

  allocUnsafe = (size) => {
    validateSize(size);
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
