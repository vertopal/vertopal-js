// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
// Enumerations for the Vertopal JavaScript library.
// Defines public enums for interface strategy modes
// and format sublist selections.

/**
 * Enumeration of strategy modes for Vertopal API operations.
 *
 * Determines whether tasks are executed asynchronously or synchronously.
 * Used when initiating conversions or other API requests to control
 * execution behavior.
 */
export enum InterfaceStrategyMode {
  /**
   * Execute operations asynchronously.
   */
  ASYNC = 'async',

  /**
   * Execute operations synchronously.
   */
  SYNC = 'sync',
}

/**
 * Enumeration of format sublist modes for Vertopal API operations.
 *
 * Specifies whether to target input or output formats when querying
 * available conversions. Used in API calls such as `convertFormats`.
 */
export enum InterfaceSublistMode {
  /**
   * Target input formats.
   */
  INPUTS = 'inputs',

  /**
   * Target output formats.
   */
  OUTPUTS = 'outputs',
}
