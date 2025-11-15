// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Manage application credentials (App ID and security token)
//   for authenticating with the Vertopal API.

/**
 * Vertopal API credential management.
 *
 * This module defines the `Credential` class, which encapsulates
 * the Application ID and Security Token required for authenticating
 * requests to the Vertopal API. It enforces immutability and provides
 * secure, read-only accessors.
 */
export class Credential {
  private readonly _app: string;
  private readonly _token: string;

  /**
   * Immutable container for Vertopal API credentials.
   *
   * @param app - Application ID string used for API authentication.
   * @param token - Security token string used for API authentication.
   * @throws Error - If `app` or `token` is empty or not a string.
   */
  constructor(app: string, token: string) {
    if (typeof app !== 'string' || !app.trim()) {
      throw new Error('Application ID must be a non-empty string');
    }
    if (typeof token !== 'string' || !token.trim()) {
      throw new Error('Security token must be a non-empty string');
    }

    this._app = app;
    this._token = token;
  }

  /**
   * Get the Application ID string.
   *
   * @returns The Application ID provided during construction.
   */
  get app(): string {
    return this._app;
  }

  /**
   * Get the Security Token string.
   *
   * @returns The Security Token provided during construction.
   */
  get token(): string {
    return this._token;
  }

  /**
   * Check whether the credential object contains valid values.
   *
   * @returns `true` if both Application ID and Security Token are set
   *          and non-empty; otherwise `false`.
   */
  isValid(): boolean {
    return Boolean(this._app && this._token);
  }
}
