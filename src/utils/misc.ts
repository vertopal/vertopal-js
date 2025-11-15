// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Miscellaneous utility functions for the Vertopal JavaScript library.
//   Provides small, reusable helpers for format normalization, environment
//   detection, and other common tasks.

import pkg from '../../package.json' with { type: 'json' };

/**
 * Normalize a format string to its canonical lowercase form.
 *
 * - Strips leading/trailing whitespace
 * - Removes a leading dot if present
 * - Converts to lowercase
 * - Returns `undefined` for empty or undefined input
 *
 * Examples:
 * ```ts
 * canonicalizeFormat(".PDF")       // "pdf"
 * canonicalizeFormat("  HTML ")    // "html"
 * canonicalizeFormat("SVG:Font")   // "svg:font"
 * canonicalizeFormat(undefined)    // undefined
 * ```
 *
 * @param formatName Format string or undefined
 * @returns Canonical lowercase format string or undefined
 */
export function canonicalizeFormat(formatName?: string): string | undefined {
  if (!formatName) return;
  formatName = formatName.trim().toLowerCase();
  if (formatName.startsWith('.')) {
    formatName = formatName.slice(1);
  }
  return formatName || undefined;
}

/**
 * Detect if the current runtime environment is Node.js.
 *
 * @returns True if the environment is Node.js, otherwise false.
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node === 'string'
  );
}

/**
 * Retrieves the current version of the library.
 *
 * @returns The version string.
 */
export function getLibraryVersion(): string {
  return pkg.version ?? 'unknown';
}
