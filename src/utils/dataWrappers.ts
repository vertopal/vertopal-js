// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Internal utility classes that provide safe access to nested objects
//   and robust parsing of structured API errors and warnings.
//   These classes are not part of the public API and are intended for
//   internal use by other Vertopal modules.

/**
 * Internal utility class for parsing structured API responses to extract
 * error and warning information. Provides helper methods to detect and
 * retrieve error codes, messages, and warnings from nested response objects.
 */
export class ErrorWrapper {
  private readonly response: Record<string, any>;

  /**
   * Create a new ErrorWrapper.
   *
   * @param response - The API response object to be inspected for
   *                   errors and warnings.
   */
  constructor(response: Record<string, any>) {
    this.response = response;
  }

  /**
   * Safely traverse a nested object using a path of keys.
   *
   * @param data - The object to traverse.
   * @param path - Array of keys representing the path to follow.
   * @returns The value at the given path, or null if not found.
   */
  private getByPath(data: any, path: string[]): any {
    for (const key of path) {
      if (typeof data === 'object' && data !== null) {
        data = data[key];
        if (data === undefined) return null;
      } else {
        return null;
      }
    }
    return data;
  }

  /**
   * Predefined paths where error objects may appear in API responses.
   */
  private readonly errorPaths: string[][] = [
    [],
    ['error'],
    ['result', 'error'],
    ['result', 'output', 'result', 'error'],
  ];

  /**
   * Predefined paths where warning objects may appear in API responses.
   */
  private readonly warningPaths: string[][] = [
    ['warning'],
    ['result', 'warning'],
    ['result', 'output', 'warning'],
    ['result', 'output', 'result', 'warning'],
  ];

  /**
   * Check if the response contains an error.
   *
   * @returns True if an error object with a code or message is found.
   */
  hasError(): boolean {
    return this.errorPaths.some(path => {
      const err = this.getByPath(this.response, path);
      return typeof err === 'object' && (err?.code || err?.message);
    });
  }

  /**
   * Retrieve the error object from the response.
   *
   * @returns A object containing error details (code, message),
   *          or an empty object if none found.
   */
  getError(): Record<string, string> {
    for (const path of this.errorPaths) {
      const err = this.getByPath(this.response, path);
      if (typeof err === 'object' && (err?.code || err?.message)) {
        return err;
      }
    }
    return {};
  }

  /**
   * Get the error message from the response.
   *
   * @returns The error message string.
   */
  getErrorMessage(): string {
    return this.getError().message ?? 'No error message available.';
  }

  /**
   * Get the error code from the response.
   *
   * @returns The error code string.
   */
  getErrorCode(): string {
    return this.getError().code ?? 'UNKNOWN_ERROR';
  }

  /**
   * Check if the response contains warnings.
   *
   * @returns True if one or more warning objects are found.
   */
  hasWarning(): boolean {
    return this.warningPaths.some(path => {
      const warn = this.getByPath(this.response, path);
      return typeof warn === 'object' && (warn?.code || warn?.message);
    });
  }

  /**
   * Retrieve all warnings from the response.
   *
   * @returns An array of objects containing warning details (code, message).
   */
  getWarnings(): Record<string, string>[] {
    const warnings: Record<string, string>[] = [];
    for (const path of this.warningPaths) {
      const warn = this.getByPath(this.response, path);
      if (typeof warn === 'object' && (warn?.code || warn?.message)) {
        warnings.push(warn);
      }
    }
    return warnings;
  }
}
