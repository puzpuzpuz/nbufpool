/**
 * An unsafe Buffer pool.
 */
export class Pool {
    
    /**
     * Constructs new pool instance.
     *
     * @param size  pool size (size of internal source buffer)
     */
    constructor(size: number);
  
    /**
     * Allocates a new buffer with the given size.
     * Behavior of this method is the same as for `Buffer.allocUnsafe`.
     * 
     * @param size  buffer size
     * @returns     allocated buffer
     */
    allocUnsafe: (size: number) => Buffer;

}
