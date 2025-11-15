// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Adapters for reading from and writing to browser file inputs,
//   implementing Vertopal's Readable and Writable interfaces adapted
//   for browser environments.

import type {
  Readable,
  Writable,
  BrowserReadableStream,
  BrowserWritableStream
} from '../protocols.ts';

/**
 * Readable adapter for binary input from a browser File object.
 *
 * Wraps a native `File` instance to implement the `Readable` interface.
 * Provides metadata such as filename and content type, and exposes
 * a method to open the file as a browser-native `ReadableStream`.
 */
export class BrowserFileInput implements Readable {
  private _file: File;
  private _filename: string;
  private _contentType: string;

  /**
   * Create a new BrowserFileInput adapter.
   *
   * @param file - The browser `File` object selected via an `<input type="file">`.
   * @param filename - Optional display name. Defaults to original file name.
   * @param contentType - Optional MIME type. Defaults to original file type.
   */
  constructor(
    file: File,
    filename?: string,
    contentType?: string
  ) {
    this._file = file;
    this._filename = filename || file.name || 'upload.bin';
    this._contentType = contentType || file.type || 'application/octet-stream';
  }

  /**
   * Open the file as a browser-readable stream.
   *
   * @returns A `BrowserReadableStream` representing the file contents.
   */
  async open(): Promise<BrowserReadableStream> {
    const stream = this._file.stream();
    return stream as BrowserReadableStream;
  }

  /**
   * Get the filename associated with the file input.
   *
   * @returns The filename string.
   */
  get filename(): string {
    return this._filename;
  }

  /**
   * Get the MIME type associated with the file input.
   *
   * @returns The content type string.
   */
  get contentType(): string {
    return this._contentType;
  }
}

/**
 * Writable adapter for binary output to a browser-triggered download.
 *
 * Collects written chunks into memory and implements the `Writable` interface
 * using browser-native types. Intended for use in web applications where
 * converted or processed data is prepared for download via an anchor element.
 */
export class BrowserFileOutput implements Writable {
  private _chunks: Uint8Array[] = [];

  /**
   * Create a new BrowserFileOutput adapter.
   */
  constructor() {
    this._chunks = [];
  }

  /**
   * Open a writable stream interface for collecting output chunks.
   *
   * @returns A `BrowserWritableStream` object with a `write()` method
   *          that appends chunks to the internal buffer.
   */
  async open(): Promise<BrowserWritableStream> {
    return {
      write: (chunk: Uint8Array) => {
        this._chunks.push(chunk);
      },
    };
  }
}
