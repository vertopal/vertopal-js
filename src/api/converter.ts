// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Helpers for file conversion using the Vertopal API.
//   This module provides the `Converter` class and internal `Conversion`
//   controller to manage upload, convert, poll, and download workflows.

import { API } from './v1.ts';
import { Credential } from './credential.ts';
import { InterfaceStrategyMode } from '../common/enums.ts';
import type { Readable, Writable, PathWritable } from '../io/protocols.ts';
import { canonicalizeFormat } from '../utils/misc.ts';
import { SLEEP_PATTERN } from '../config/settings.ts';
import { EntityStatusNotRunningError } from '../common/exceptions.ts';

/**
 * Input specification for a conversion workflow.
 *
 * @property source - A `Readable` object providing access to the input file stream.
 * @property format - Optional string specifying the input file format. If omitted,
 *                    the format may be inferred automatically.
 */
interface InputSpec {
  source: Readable;
  format?: string;
}

/**
 * Output specification for a conversion workflow.
 *
 * @property sink - A `Writable` object representing the output destination
 *                  for the converted file.
 * @property format - String specifying the desired output file format.
 */
interface OutputSpec {
  sink: Writable;
  format: string;
}

/**
 * Conversion workflow controller.
 *
 * Manages the lifecycle of a file conversion using the Vertopal API.
 * Handles upload, conversion initiation, polling for status, and download.
 */
class Conversion {
  private input: InputSpec;
  private output: OutputSpec;
  private client: API;
  private convertConnector?: string;
  private convertStatus?: string;
  private credits?: number;

  /**
   * Create a new Conversion workflow.
   *
   * @param client - API client instance for communication.
   * @param readable - Input stream providing source file data.
   * @param writable - Output stream for converted file data.
   * @param outputFormat - Desired output format[-type] string.
   * @param inputFormat - Optional input format[-type] string.
   */
  constructor(
    client: API,
    readable: Readable,
    writable: Writable,
    outputFormat: string,
    inputFormat?: string
  ) {
    this.input = {
      source: readable,
      format: canonicalizeFormat(inputFormat),
    };
    this.output = {
      sink: writable,
      format: canonicalizeFormat(outputFormat) as string,
    };
    this.client = client;
  }

  /**
   * Initialize the conversion process.
   *
   * @returns A promise that resolves when conversion has been started.
   */
  async init(): Promise<void> {
    await this.startConversion();
  }

  /**
   * Wait until the conversion task is completed.
   *
   * @param pollIntervals - Array of polling intervals in seconds.
   * @param sleepFn - Function to pause execution for a given duration.
   * @returns A promise that resolves when conversion is completed.
   * @throws Error - If pollIntervals contains invalid values.
   */
  async wait(
    pollIntervals: number[] = SLEEP_PATTERN,
    sleepFn: (ms: number) => Promise<void> = ms => new Promise(res => setTimeout(res, ms))
  ): Promise<void> {
    let step = 0;
    while (!(await this.done())) {
      const interval = pollIntervals[step];

      if (typeof interval === 'number') {
        await sleepFn(interval * 1000);
      } else {
        throw new Error(`pollIntervals[${step}] is not a valid number: ${interval}`);
      }

      if (step < pollIntervals.length - 1) {
        step++;
      }
    }
  }

  /**
   * Check if the conversion task is done.
   *
   * @returns `true` if the task status is 'completed', otherwise `false`.
   */
  async done(): Promise<boolean> {
    const status = await this.getConvertTaskStatus();
    return status.task === 'completed';
  }

  /**
   * Check if the conversion was successful.
   *
   * @returns `true` if the conversion status is 'successful', otherwise `false`.
   */
  successful(): boolean {
    return this.convertStatus === 'successful';
  }

  /**
   * Start the conversion process.
   *
   * @returns A promise that resolves when the conversion process has started.
   * @throws EntityStatusNotRunningError - If the conversion task is not running.
   */
  private async startConversion(): Promise<void> {
    const uploadResp = await this.client.uploadFile(this.input.source);
    const uploadConnector = uploadResp.result.output.connector;

    const convertResp = await this.client.convertFile(
      uploadConnector,
      this.output.format,
      this.input.format,
      InterfaceStrategyMode.ASYNC
    );

    if (convertResp.entity.status !== 'running') {
      throw new EntityStatusNotRunningError();
    }

    this.convertConnector = convertResp.entity.id;
  }

  /**
   * Download the converted file.
   *
   * @param useServerFilename - If `true`, use the filename provided by the server.
   * @returns A promise that resolves when download is complete.
   */
  async download(useServerFilename: boolean = false): Promise<void> {
    const { connector, filename } = await this.getDownloadUrl();

    if (useServerFilename && 'path' in this.output.sink) {
      (this.output.sink as PathWritable).path = filename;
    }

    await this.client.downloadUrlGet(this.output.sink, connector);
  }

  /**
   * Retrieve the download URL for the converted file.
   *
   * @returns Object containing connector ID and filename.
   */
  private async getDownloadUrl(): Promise<{ connector: string; filename: string }> {
    const response = await this.client.downloadUrl(this.convertConnector!);
    return {
      connector: response.result.output.connector,
      filename: response.result.output.name,
    };
  }

  /**
   * Retrieve the current status of the conversion task.
   *
   * @returns Object containing task status, credits used, and conversion status.
   */
  private async getConvertTaskStatus(): Promise<{
    task: string;
    credits?: number;
    convert?: string;
  }> {
    const response = await this.client.taskResponse(this.convertConnector!);
    const resultOutput = response.result.output;

    if (resultOutput.result) {
      this.convertStatus = resultOutput.result.output.status;
      this.credits = resultOutput.entity.vcredits;
    } else {
      this.convertStatus = undefined;
    }

    return {
      task: resultOutput.entity.status,
      credits: this.credits,
      convert: this.convertStatus,
    };
  }

  /**
   * Get the number of credits used for the conversion.
   *
   * @returns Number of credits consumed, or undefined if not available.
   */
  get creditsUsed(): number | undefined {
    return this.credits;
  }
}

/**
 * Converter helper class.
 *
 * Provides a simplified interface for performing conversions
 * by managing an internal API client and returning `Conversion` instances.
 */
export class Converter {
  private client: API;

  /**
   * Create a new Converter instance.
   *
   * @param credential - Optional `Credential` instance for authentication.
   */
  constructor(credential?: Credential) {
    this.client = new API(credential);
  }

  /**
   * Perform a file conversion.
   *
   * @param readable - Input stream providing source file data.
   * @param writable - Output stream for converted file data.
   * @param outputFormat - Desired output format[-type] string.
   * @param inputFormat - Optional input format[-type] string.
   * @returns A `Conversion` instance representing the workflow.
   */
  async convert(
    readable: Readable,
    writable: Writable,
    outputFormat: string,
    inputFormat?: string
  ): Promise<Conversion> {
    const conversion = new Conversion(
      this.client,
      readable,
      writable,
      outputFormat,
      inputFormat
    );

    await conversion.init()
    return conversion;
  }
}
