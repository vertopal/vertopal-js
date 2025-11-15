// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Configuration manager for the Vertopal JavaScript library.
//   Provides centralized access to runtime settings, allowing values
//   to be retrieved, overridden, and reset. Configuration values are
//   resolved in priority order: user overrides, default settings, and
//   finally an optional fallback. This ensures flexible customization
//   while maintaining safe defaults for API and connection behavior.

import { DEFAULT_CONFIG } from './settings.ts';

/**
 * Global configuration manager for the Vertopal library.
 *
 * Provides static methods to retrieve, update, and clear configuration values.
 * Configuration values are resolved in the following order:
 *   1. Overrides set via `update()`
 *   2. Defaults defined in `DEFAULT_CONFIG`
 *   3. Fallback value provided to `get()`
 *
 * This allows flexible customization of runtime behavior while maintaining
 * safe defaults.
 */
export class Config {
  private static _overrides: Record<string, Record<string, any>> = {};

  /**
   * Retrieves a configuration value.
   *
   * @param section - The configuration section name.
   * @param key - The specific configuration key within the section.
   * @param fallback - Optional fallback value if the key is not found.
   * @returns The resolved configuration value.
   */
  public static get(section: string, key: string, fallback: any = null): any {
    if (
      section in this._overrides &&
      this._overrides[section] &&
      key in this._overrides[section]
    ) {
      return this._overrides[section][key];
    }

    if (
      section in DEFAULT_CONFIG &&
      DEFAULT_CONFIG[section] &&
      key in DEFAULT_CONFIG[section]
    ) {
      return DEFAULT_CONFIG[section][key];
    }

    return fallback;
  }

  /**
   * Merges new overrides into the current override set.
   *
   * @param overrides - A nested record of configuration values keyed by section and key.
   * @returns Void.
   */
  public static update(overrides: Record<string, Record<string, any>>): void {
    for (const section in overrides) {
      if (!this._overrides[section]) {
        this._overrides[section] = {};
      }
      Object.assign(this._overrides[section], overrides[section]);
    }
  }

  /**
   * Clears all overrides.
   *
   * @returns Void.
   */
  public static clear_overrides(): void {
    this._overrides = {};
  }
}
