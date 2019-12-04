/* global describe, test, expect, beforeEach, afterEach */
'use strict'

const Pool = require('../index')

describe('advanced pool behavior', () => {
  const originalAllocFn = Buffer.allocUnsafeSlow

  beforeEach(() => {
    Buffer.allocUnsafeSlow = (size) => originalAllocFn(size).fill(0)
  })

  afterEach(() => {
    Buffer.allocUnsafeSlow = originalAllocFn
  })

  for (let s = 0; s < 33; s++) {
    test(`returns slice from new section of source each time: size=${s}`, () => {
      const pool = new Pool(32)
      for (let i = 0; i < 33; i++) {
        const buf = pool.allocUnsafe(s)
        expect(buf.length).toBe(s)
        for (const val of buf.values()) {
          expect(val).toBe(0)
        }
        // fill this section with non-zeros to validate
        // possible intersections between this and next slice
        buf.fill(1)
      }
    })
  }
})
