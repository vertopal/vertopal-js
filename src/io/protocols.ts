// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Core I/O protocol definitions for Vertopal, including abstract
//   base interfaces and type hints for readable, writable, and
//   seekable binary data sources and sinks.

import type { PathLike } from 'fs';

/**
 * A readable stream of `Uint8Array` chunks, typically used for binary data
 * in browser environments. Extends the standard `ReadableStream` interface
 * with a fixed chunk type to ensure consistent handling of binary payloads.
 */
export type BrowserReadableStream = globalThis.ReadableStream<Uint8Array>;

/**
 * A minimal writable stream interface for writing `Uint8Array` chunks
 * in browser environments. Provides a simplified abstraction with a
 * single `write()` method, suitable for collecting binary data into
 * memory or preparing it for download.
 */
export type BrowserWritableStream = {
  write(chunk: Uint8Array): void;
}

/**
 * Represents a readable binary resource.
 *
 * Defines the contract for objects that can be opened for reading
 * as a stream of binary data. Provides optional metadata such as
 * filename and content type to describe the resource.
 */
export interface Readable {
  /**
   * Returns a context manager that opens the resource
   * for binary reading.
   */
  open(): Promise<NodeJS.ReadableStream | BrowserReadableStream>;

  /**
   * The name of the file, if available.
   */
  filename?: string;

  /**
   * The MIME type of the content, if known.
   */
  contentType?: string;
}

/**
 * Represents a writable binary resource.
 *
 * Defines the contract for objects that can be opened for writing
 * as a stream of binary data. Used for sinks such as files, browser
 * downloads, or in-memory buffers.
 */
export interface Writable {
  /**
   * Returns a context manager that opens the resource
   * for binary writing.
   */
  open(): Promise<NodeJS.WritableStream | BrowserWritableStream>;
}

/**
 * Represents a writable resource with a file system path.
 *
 * Extends the writable concept by requiring a `path` property
 * that can be read and updated. Useful for file-based sinks
 * where the output path must be explicitly managed.
 */
export interface PathWritable {
  /**
   * The writable file system path.
   */
  path: PathLike;
}
