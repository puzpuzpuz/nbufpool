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
     * 
     * @param size  buffer size
     * @returns     allocated buffer
     */
    allocUnsafe: (size: number) => Buffer;

}
