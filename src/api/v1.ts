// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Implementing the high-level operations supported by the Vertopal
//   public API surface (v1). Methods are deliberately small and
//   primarily compose request payloads then delegate to the
//   `Interface.sendRequest` implementation for HTTP transport and
//   response handling.

import { Credential } from './credential.ts';
import { Interface } from './interface.ts';
import { InterfaceStrategyMode, InterfaceSublistMode } from '../common/enums.ts';
import type { Readable, Writable, BrowserWritableStream } from '../io/protocols.ts';
import { StreamChunker } from '../utils/streamChunker.ts'
import { Config } from '../config/config.ts';

/**
 * High-level API client for Vertopal public API (v1).
 *
 * Extends the `Interface` class to provide simplified methods for
 * common Vertopal operations such as file upload, conversion,
 * status checks, task responses, downloads, and format queries.
 *
 * Each method composes the appropriate request payload and delegates
 * transport and response handling to `Interface.sendRequest`.
 */
export class API extends Interface {

  /**
   * Create a new API client for Vertopal version 1.
   *
   * @param credential - Optional `Credential` instance. If not provided,
   *                     credentials are loaded from configuration.
   */
  constructor(credential?: Credential) {
    super(credential);
    this.version = 1;
  }

  /**
   * Upload a file to Vertopal for processing.
   *
   * @param readable - A `Readable` object providing file stream access.
   * @param chunkSize - Optional size of chunks in bytes; defaults to configuration.
   * @returns Response object containing upload details.
   */
  async uploadFile(readable: Readable, chunkSize?: number): Promise<any> {
    const streamChunkSize =
      chunkSize ?? Config.get('connectionSettings', 'streamChunkSize');

    const filename = readable.filename || 'upload.bin';
    const contentType = readable.contentType || 'application/octet-stream';

    const stream = await readable.open();

    const response = await this.sendRequest('/upload/file', 'POST', {
      data: JSON.stringify({
        app: this._credential.app
      }),
      file: {
        stream: stream,
        filename: filename,
        contentType: contentType,
        chunkSize: streamChunkSize
      },
    }, this.longTimeout);

    return response;
  }

  /**
   * Request a file conversion.
   *
   * @param connector - Connector ID referencing the uploaded file.
   * @param outputFormat - Desired output format[-type] string.
   * @param inputFormat - Optional input format[-type] string.
   * @param mode - Conversion strategy mode (default: ASYNC).
   * @returns Response object containing conversion task details.
   */
  async convertFile(
    connector: string,
    outputFormat: string,
    inputFormat?: string,
    mode: InterfaceStrategyMode = InterfaceStrategyMode.ASYNC
  ): Promise<any> {
    const parameters = inputFormat
      ? { input: inputFormat, output: outputFormat }
      : { output: outputFormat };

    const response = await this.sendRequest('/convert/file', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        connector,
        include: ['result', 'entity'],
        mode: mode,
        parameters,
      }),
    }, this.defaultTimeout);

    return response;
  }

  /**
   * Check the status of a conversion.
   *
   * @param connector - Connector ID referencing the conversion task.
   * @returns Response object containing conversion status.
   */
  async convertStatus(connector: string): Promise<any> {
    const response = await this.sendRequest('/convert/status', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        connector,
      }),
    }, this.defaultTimeout);

    return response;
  }

  /**
   * Retrieve the response of a task.
   *
   * @param connector - Connector ID referencing the task.
   * @returns Response object containing task results.
   */
  async taskResponse(connector: string): Promise<any> {
    const response = await this.sendRequest('/task/response', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        connector,
        include: ['result'],
      }),
    }, this.defaultTimeout);

    return response;
  }

  /**
   * Request a download URL for a converted file.
   *
   * @param connector - Connector ID referencing the conversion task.
   * @returns Response object containing download URL.
   */
  async downloadUrl(connector: string): Promise<any> {
    const response = await this.sendRequest('/download/url', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        connector,
      }),
    }, this.defaultTimeout);


    return response;
  }

  /**
   * Download a file from Vertopal using a writable stream.
   *
   * @param writable - A `Writable` object providing output stream access.
   * @param connector - Connector ID referencing the download URL task.
   * @param chunkSize - Optional size of chunks in bytes; defaults to configuration.
   * @returns A promise that resolves when the file is downloaded
   *          and written to the stream.
   */
  async downloadUrlGet(
    writable: Writable,
    connector: string,
    chunkSize?: number
  ): Promise<void> {
    const streamChunkSize =
      chunkSize ?? Config.get('connectionSettings', 'streamChunkSize');

    const response = await this.sendRequest('/download/url/get', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        connector,
      }),
    }, this.longTimeout);

    const stream = response.body;
    if (!stream) return;

    const output = await writable.open();
    const chunkedStream = new StreamChunker(stream, streamChunkSize, output)
    await chunkedStream.process() as (NodeJS.WritableStream | BrowserWritableStream)
  }

  /**
   * Retrieve metadata for a specific format.
   *
   * @param formatName - Format[-type] identifier to query.
   * @returns Response object containing format details.
   */
  async formatGet(formatName: string): Promise<any> {
    const response = await this.sendRequest('/format/get', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        parameters: {
          format: formatName,
        }
      }),
    }, this.defaultTimeout);

    return response;
  }

  /**
   * Retrieve conversion graph between two formats.
   *
   * @param inputFormat - Source format[-type] string.
   * @param outputFormat - Target format[-type] string.
   * @returns Response object containing conversion graph details.
   */
  async convertGraph(
    inputFormat: string,
    outputFormat: string
  ): Promise<any> {
    const response = await this.sendRequest('/convert/graph', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        parameters: {
          input: inputFormat,
          output: outputFormat,
        },
      }),
    }, this.defaultTimeout);

    return response;
  }

  /**
   * Retrieve available conversion formats.
   *
   * @param sublist - Mode specifying whether to list inputs or outputs.
   * @param formatName - Optional format[-type] to filter results.
   * @returns Response object containing available formats.
   * @throws Error - If `sublist` is not a valid `InterfaceSublistMode`.
   */
  async convertFormats(
    sublist: InterfaceSublistMode,
    formatName?: string
  ): Promise<any> {
    if (!Object.values(InterfaceSublistMode).includes(sublist)) {
      throw new Error(
        '`sublist` must be either InterfaceSublistMode.INPUTS or InterfaceSublistMode.OUTPUTS.'
      );
    }

    const parameters: Record<string, string> = {
      sublist: sublist,
    };
    if (formatName) {
      parameters.format = formatName;
    }

    const response = await this.sendRequest('/convert/formats', 'POST', {
      data: JSON.stringify({
        app: this._credential.app,
        parameters,
      }),
    }, this.defaultTimeout);

    return response;
  }
}
