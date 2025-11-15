// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Stream chunking utility for the Vertopal JavaScript library.
//   Splits incoming data from Node.js or browser-readable streams into
//   fixed-size chunks and forwards them to a collector. The collector
//   can be either a writable stream (Node.js or browser) or an in-memory
//   array of Uint8Array buffers. This ensures consistent handling of
//   binary data across environments and simplifies downstream processing.

import type { BrowserWritableStream } from "../io/protocols.ts";

/**
 * Utility class for splitting readable streams into fixed-size chunks.
 * Supports both Node.js streams and browser-native streams, and can
 * deliver chunks either to a writable stream or to an in-memory array.
 *
 * Designed for internal use within Vertopal to normalize stream handling
 * across environments.
 */
export class StreamChunker {
  private stream: any;
  private chunkSize: number;
  private collector: (BrowserWritableStream | NodeJS.WritableStream) | Uint8Array[];
  private isNodeReadable: boolean;
  private isWritable: boolean;

  /**
   * Create a new StreamChunker.
   *
   * @param stream - The input stream (Node.js ReadableStream or browser ReadableStream).
   * @param chunkSize - The size of each chunk to emit, in bytes.
   * @param collector - Destination for emitted chunks. Can be a writable stream
   *                    (Node.js or browser) or an array of Uint8Array buffers.
   */
  constructor(
    stream: any,
    chunkSize: number,
    collector: (BrowserWritableStream | NodeJS.WritableStream) | Uint8Array[]
  ) {
    this.stream = stream;
    this.chunkSize = chunkSize;
    this.collector = collector;
    this.isNodeReadable = typeof stream.getReader !== 'function';
    this.isWritable = 'write' in collector && typeof collector.write === 'function';
  }

  /**
   * Process the input stream and emit fixed-size chunks.
   *
   * Automatically detects whether the stream is Node.js or browser-based
   * and delegates to the appropriate handler.
   *
   * @returns The collector containing written chunks or accumulated buffers.
   */
  async process(): Promise<(BrowserWritableStream | NodeJS.WritableStream) | Uint8Array[]> {
    if (this.isNodeReadable) {
      await this.processNodeStream();
    } else {
      await this.processBrowserStream();
    }

    return this.collector;
  }

  /**
   * Process a Node.js readable stream.
   *
   * Buffers incoming data until the chunk size is reached, then emits
   * slices to the collector. Remaining data is emitted at the end.
   * 
   * @returns A promise that resolves when stream processing completes
   *          in a Node.js environment.
   */
  private async processNodeStream(): Promise<void> {
    let buffer: Buffer = Buffer.alloc(0);

    for await (const chunk of this.stream) {
      const incoming = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
      buffer = Buffer.concat([buffer, incoming]);

      while (buffer.length >= this.chunkSize) {
        const slice = buffer.subarray(0, this.chunkSize);
        this.emit(slice);
        buffer = buffer.subarray(this.chunkSize);
      }
    }

    if (buffer.length > 0) {
      this.emit(buffer);
    }
  }

  /**
   * Process a browser-native readable stream.
   *
   * Uses a stream reader to consume chunks, merges them into a buffer,
   * and emits slices of the specified chunk size. Remaining data is
   * emitted at the end.
   * 
   * @returns A promise that resolves when stream processing completes
   *          in a browser environment.
   */
  private async processBrowserStream(): Promise<void> {
    let buffer: Uint8Array = new Uint8Array(0);
    const reader = this.stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const incoming =
        typeof value === 'string'
          ? new TextEncoder().encode(value)
          : value instanceof Uint8Array
            ? value
            : new Uint8Array(value as ArrayBuffer);

      const merged = new Uint8Array(buffer.length + incoming.length);
      merged.set(buffer);
      merged.set(incoming, buffer.length);
      buffer = merged;

      while (buffer.length >= this.chunkSize) {
        const slice = buffer.slice(0, this.chunkSize);
        this.emit(slice);
        buffer = buffer.slice(this.chunkSize);
      }
    }

    if (buffer.length > 0) {
      this.emit(buffer);
    }
  }

  /**
   * Emit a chunk of data to the collector.
   *
   * If the collector is a writable stream, writes the chunk directly.
   * Otherwise, appends the chunk to the collector array.
   *
   * @param data - The chunk of data to emit (Uint8Array or Buffer).
   * @returns Void.
   */
  private emit(data: Uint8Array | Buffer): void {
    if (this.isWritable) {
      (this.collector as BrowserWritableStream | NodeJS.WritableStream).write(data);
    } else {
      (this.collector as Uint8Array[]).push(data);
    }
  }
}
