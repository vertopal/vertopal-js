// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Adapters for reading from and writing to file system paths,
//   implementing Vertopal's Readable, Writable, and PathWritable
//   interfaces for binary I/O operations.

import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import { PathLike } from 'fs';
import { basename } from 'path';
import type { Readable, Writable, PathWritable } from '../protocols.ts';

/**
 * FileInput adapter for reading binary data from the file system.
 *
 * Implements the `Readable` interface by wrapping a file system path.
 * Provides metadata such as filename and content type, and exposes
 * a method to open the file as a Node.js `ReadStream`.
 */
export class FileInput implements Readable {
  private _path: PathLike;
  private _filename: string;
  private _contentType: string;

  /**
   * Create a new FileInput adapter.
   *
   * @param path - File system path to read from.
   * @param filename - Optional display name. Defaults to basename of path.
   * @param contentType - Optional MIME type. Defaults to "application/octet-stream".
   */
  constructor(
    path: PathLike,
    filename?: string,
    contentType?: string
  ) {
    this._path = path;
    this._filename = filename || basename(path.toString()) || 'upload.bin';
    this._contentType = contentType || 'application/octet-stream';
  }

  /**
   * Open the file as a readable stream.
   *
   * @returns A `ReadStream` representing the file contents.
   */
  async open(): Promise<ReadStream> {
    return createReadStream(this._path);
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
 * FileOutput adapter for writing binary data to the file system.
 *
 * Implements both the `Writable` and `PathWritable` interfaces by
 * wrapping a file system path. Supports buffering policies and
 * append/write modes, and exposes a method to open the file as a
 * Node.js `WriteStream`.
 */
export class FileOutput implements Writable, PathWritable {
  private _path: PathLike;
  private _buffering: number;
  private _mode: 'a' | 'w';

  /**
   * Create a new FileOutput adapter.
   *
   * @param path - File system path to write to.
   * @param buffering - Buffering policy. -1 = default, 0 = unbuffered, >0 = buffer size.
   * @param append - If true, opens in append mode ("a"); otherwise write mode ("w").
   */
  constructor(path: PathLike, buffering: number = -1, append: boolean = false) {
    this._path = path;
    this._buffering = buffering;
    this._mode = append ? 'a' : 'w';
  }

  /**
   * Open the file as a writable stream.
   *
   * @returns A `WriteStream` for writing binary data to the file.
   */
  async open(): Promise<WriteStream> {
    return createWriteStream(this._path, {
      flags: this._mode,
      highWaterMark: this._buffering > 0 ? this._buffering : undefined,
    });
  }

  /**
   * Get the current file system path for output.
   *
   * @returns The path used for writing.
   */
  get path(): PathLike {
    return this._path;
  }

  /**
   * Set a new file system path for output.
   *
   * @param value - The new path to use for writing.
   */
  set path(value: PathLike) {
    this._path = value;
  }
}
