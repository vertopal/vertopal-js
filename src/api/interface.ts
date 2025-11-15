// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Internal API interface for managing Vertopal service requests,
//   including request construction, authentication, retries,
//   file uploads, and consistent HTTP session handling using native fetch.

import { Credential } from './credential.ts';
import * as settings from '../config/settings.ts';
import { Config } from '../config/config.ts';
import {
  APIError,
  InvalidJSONResponseError,
  NetworkConnectionError,
} from '../common/exceptions.ts';
import { ExceptionHandler } from '../utils/exceptionHandler.ts';
import {
  isNode,
  getLibraryVersion
} from '../utils/misc.ts';
import { StreamChunker } from '../utils/streamChunker.ts'

/**
 * Interface class for Vertopal API communication.
 *
 * Provides methods to send requests, handle retries, manage file uploads,
 * and construct consistent headers for authentication. It abstracts
 * the complexity of request construction and ensures safe, reliable
 * communication with the Vertopal API.
 */
export class Interface {
  protected _credential: Credential;
  protected _version?: number;
  protected _userAgent: string;

  /**
   * Create a new Interface instance for Vertopal API communication.
   *
   * @param credential - Optional `Credential` object. If not provided,
   *                     credentials are loaded from configuration.
   */
  constructor(credential?: Credential) {
    this._userAgent = settings.USER_AGENT_LIB;

    this._credential =
      credential ??
      new Credential(
        Config.get('api', 'app'),
        Config.get('api', 'token'),
      );
  }

  /**
   * Send an API request with retry logic and JSON validation.
   *
   * @param path - API endpoint path (relative to base URL).
   * @param method - HTTP method to use ('GET' or 'POST').
   * @param fields - Key-value map of request fields; values may include
   *                 primitives or file-like objects with stream and metadata.
   * @param timeout - Optional timeout in milliseconds before the request is aborted.
   * @param version - Optional API version string to include in the request path.
   * @returns Parsed JSON response if available, otherwise raw `Response` object.
   * @throws InvalidJSONResponseError - If response body is not valid JSON.
   * @throws NetworkConnectionError - If all retry attempts fail.
   */
  async sendRequest(
    path: string,
    method: 'GET' | 'POST' = 'POST',
    fields: Record<string, any> = {},
    timeout?: number,
    version?: string
  ): Promise<any> {
    const retries = Config.get('connectionSettings', 'retries');

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.request(path, method, fields, timeout, version);

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const jsonResponse = await response.json();
          ExceptionHandler.raiseForResponse(jsonResponse);
          return jsonResponse;
        }

        return response;
      } catch (error: any) {
        if (error instanceof APIError) {
          throw error;
        } else if (error instanceof SyntaxError) {
          throw new InvalidJSONResponseError(error.message);
        } else {
          if (attempt < retries) {
            await new Promise((res) => setTimeout(res, 2 ** attempt * 1000));
          } else {
            throw new NetworkConnectionError(
              `All ${retries} retries failed! Error: ${error.message}`
            );
          }
        }
      }
    }

    throw new NetworkConnectionError('Request failed without exception.');
  }

  /**
   * Send a single API request using native fetch.
   *
   * @param endpoint - API endpoint path (relative to base URL).
   * @param method - HTTP method to use ('GET' or 'POST').
   * @param fields - Key-value map of request fields; values may include
   *                 primitives or file-like objects with stream and metadata.
   * @param timeout - Optional timeout in milliseconds before the request is aborted.
   * @param version - Optional API version string to include in the request path.
   * @returns Raw `Response` object from the fetch call.
   * @throws NetworkConnectionError - If request fails or times out.
   */
  async request(
    endpoint: string,
    method: 'GET' | 'POST',
    fields: Record<string, any>,
    timeout?: number,
    version?: string
  ): Promise<Response> {
    if (!endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`;
    }

    const url = version
      ? `${this.endpoint}/v${version}${endpoint}`
      : `${this.endpoint}${endpoint}`;

    const timeoutMs = timeout ?? ['/upload/file', '/download/url/get'].includes(endpoint)
      ? this.longTimeout
      : this.defaultTimeout

    const field = this.parseFieldParameters(fields, {
      '%app-id%': this._credential.app,
    });

    let response: Response;

    const formData = new FormData();
    for (const [fieldName, value] of Object.entries(field.data || {})) {
      formData.append(fieldName, value);
    }

    if (field.file) {
      for (const [fieldName, file] of Object.entries(field.file)) {
        const stream = file.stream;
        const chunkSize = file.chunkSize;

        // Collect chunks from the stream into memory.
        // This ensures the entire file is buffered before creating a Blob.
        let chunksCollector: Uint8Array[] = [];
        const chunkedStream = new StreamChunker(stream, chunkSize, chunksCollector)
        chunksCollector = await chunkedStream.process() as Uint8Array[]

        // Merge all collected chunks into a single Uint8Array buffer.
        const totalLength = chunksCollector.reduce((sum, arr) => sum + arr.length, 0);
        const finalBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunksCollector) {
          finalBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        const blob = new Blob([finalBuffer], { type: file.contentType });
        formData.append(fieldName, blob, file.filename);
      }
    }

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);
    const headers: Record<string, string> = await this._getHeaders();
    try {
      response = await fetch(url, {
        method: method,
        headers: {
          ...headers,
        },
        signal: controller.signal,
        body: formData
      });

      return response;
    } finally {
      clearTimeout(timeoutTimer);
    }
  }

  /**
   * Build a platform-aware User-Agent string.
   *
   * @returns A formatted User-Agent string.
   */
  protected async _getUserAgent(): Promise<string> {
    let platformInfo = '';

    if (isNode()) {
      const moduleName = 'os'
      const os = await import(moduleName);
      const system = os.platform();
      const rel = os.release();
      const machine = os.arch();

      platformInfo = system === 'darwin' ? 'macOs' : system;

      if (rel) {
        const shortRel = rel.includes('-') ? rel.split('-')[0] : rel;
        platformInfo += ` ${shortRel}`;
      }

      if (machine === 'x64') {
        if (system === 'win32') platformInfo += '; Win64';
        platformInfo += '; x64';
      } else {
        platformInfo += `; ${machine}`;
      }
    } else {
      platformInfo = navigator.userAgent;
    }

    return `${this.userAgent}/${getLibraryVersion()} (${platformInfo})`;
  }

  /**
   * Construct default headers for API requests.
   *
   * @returns A key-value map of HTTP headers.
   */
  protected async _getHeaders(): Promise<Record<string, string>> {
    return {
      Authorization: `Bearer ${this._credential.token}`,
      'User-Agent': await this._getUserAgent(),
    };
  }

  /**
   * Parse field parameters into separate data and file maps.
   *
   * @param params - Key-value map of request parameters.
   * @param replace - Optional replacement map for string substitutions.
   * @returns Object containing `data` (string fields) and `file` (file objects).
   */
  protected parseFieldParameters(
    params?: Record<string, any>,
    replace?: Record<string, string>
  ): { data?: Record<string, string> | undefined; file?: Record<string, any> | undefined } {
    const data: Record<string, string> = {};
    const file: Record<string, any> = {};

    const applyReplace = (text: string): string => {
      if (!replace) return text;
      for (const [from, to] of Object.entries(replace)) {
        if (from && to) {
          return text.replace(from, to);
        }
      }
      return text;
    };

    if (!params) return { data: undefined, file: undefined };

    for (const [key, val] of Object.entries(params)) {
      if (typeof val === 'string') {
        data[key] = applyReplace(val);
      } else {
        file[key] = val
      }
    }

    return {
      data: Object.keys(data).length ? data : undefined,
      file: Object.keys(file).length ? file : undefined,
    };
  }

  /**
   * Construct full API endpoint URL.
   *
   * @returns Full API endpoint URL string.
   */
  get endpoint(): string {
    const base = Config.get('api', 'endpoint');
    const version = this.version ? `v${this.version}` : '';
    return `${base}/${version}`;
  }

  /**
   * Default timeout value for requests (in milliseconds).
   *
   * @returns The default timeout duration in milliseconds.
   */
  get defaultTimeout(): number {
    return Config.get('connectionSettings', 'defaultTimeout');
  }

  /**
   * Extended timeout value for long-running requests (in milliseconds).
   *
   * @returns The long timeout duration in milliseconds.
   */
  get longTimeout(): number {
    return Config.get('connectionSettings', 'longTimeout');
  }

  /**
   * API version number currently in use.
   *
   * @returns The current API version number, or `undefined` if not set.
   */
  get version(): number | undefined {
    return this._version;
  }

  /**
   * Set the API version number.
   *
   * @param value - The API version number to set, or `undefined` to clear.
   */
  set version(value: number | undefined) {
    this._version = value;
  }

  /**
   * Library identifier used in User-Agent string.
   *
   * @returns The current User-Agent string.
   */
  get userAgent(): string {
    return this._userAgent;
  }

  /**
   * Set the User-Agent string.
   *
   * @param value - The User-Agent string to set.
   * @throws Error - If the provided value does not match the expected identifier.
   */
  set userAgent(value: string) {
    if (value !== settings.USER_AGENT_LIB) {
      throw new Error(
        `Invalid User-Agent value. Possible values are: ${value}.`
      );
    }
    this._userAgent = value;
  }
}
