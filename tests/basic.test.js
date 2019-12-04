/* global describe, test, expect */
/* eslint-disable no-new */
'use strict'

const Pool = require('../index')

describe('basic pool behavior', () => {
  describe('constructor', () => {
    test('throws on empty args', () => {
      expect(() => {
        new Pool()
      }).toThrow()
    })

    test('throws on non-number size', () => {
      expect(() => {
        new Pool('foo')
      }).toThrow()
    })

    test('throws on negative size', () => {
      expect(() => {
        new Pool(-42)
      }).toThrow()
    })
  })

  describe('allocUnsafe', () => {
    test('throws on empty args', () => {
      const pool = new Pool(128)
      expect(() => {
        pool.allocUnsafe()
      }).toThrow()
    })

    test('throws on non-number size', () => {
      const pool = new Pool(128)
      expect(() => {
        pool.allocUnsafe('bar')
      }).toThrow()
    })

    test('throws on negative size', () => {
      const pool = new Pool(128)
      expect(() => {
        pool.allocUnsafe(-24)
      }).toThrow()
    })

    test('allocates object of type Buffer', () => {
      const pool = new Pool(64)
      const buf = pool.allocUnsafe(8)
      expect(buf).toBeInstanceOf(Buffer)
    })

    test('allocates new buffer each time', () => {
      const pool = new Pool(64)
      const buf1 = pool.allocUnsafe(3)
      const buf2 = pool.allocUnsafe(3)
      expect(buf1).not.toBe(buf2)
    })

    test('allocates buffer of smaller size', () => {
      const pool = new Pool(128)
      const buf = pool.allocUnsafe(32)
      expect(buf.length).toBe(32)
    })

    test('allocates buffer of larger size', () => {
      const pool = new Pool(128)
      const buf = pool.allocUnsafe(256)
      expect(buf.length).toBe(256)
    })

    test('keeps allocating buffers of larger total size', () => {
      const pool = new Pool(64)
      for (let i = 0; i < 10; i++) {
        const buf = pool.allocUnsafe(16)
        expect(buf.length).toBe(16)
      }
    })
  })
})
