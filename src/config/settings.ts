// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Default configuration settings and constants for the Vertopal
//   JavaScript library. Provides baseline values for API credentials,
//   connection behavior, user-agent identification, versioning, and
//   polling intervals.

/**
 * DEFAULT_CONFIG holds the default configuration settings for the package.
 * This object is structured with nested keys, where each top-level key
 * represents a section (e.g., "api"), and its values contain
 * specific configuration options such as the application ID, token,
 * endpoint URL, timeout, and retry count.
 * These defaults can be overridden at runtime through the `Config` manager
 * to customize library behavior.
 */
export const DEFAULT_CONFIG: Record<string, Record<string, any>> = {
 /**
  * API credentials and endpoint configuration
  * ------------------------------------------
  * This section contains the application ID, security token,
  * and base endpoint URL used for communicating with the Vertopal API.
  * You can use the default free credentials provided or replace them
  * with your own credentials obtained from:
  * https://www.vertopal.com/en/account/api/app/new
  */
  api: {
    // The application ID used for authentication with the Vertopal API.
    app: 'free',

    // The security token used for API authentication.
    token: 'FREE-TOKEN',

    // The base endpoint URL for all API requests.
    // Note: Do not include a version number
    // or a trailing slash in this URL.
    endpoint: 'https://api.vertopal.com',
  },

  /**
   * Connection settings for API requests
   * ------------------------------------
   * This section configures various connection parameters,
   * such as retry attempts, timeout durations for API requests,
   * and chunk size for streaming large responses.
   */
  connectionSettings: {
    // The number of retry attempts for failed requests.
    retries: 5,

    // The default timeout (in milliseconds) for API requests.
    defaultTimeout: 30 * 1000,

    // The timeout (in milliseconds) for long-running API requests,
    // such as uploads or downloads.
    longTimeout: 300 * 1000,

    // Default chunk size for streaming in bytes.
    // This value is used for both uploads and downloads.
    streamChunkSize: 4096,
  },
};

/**
 * USER_AGENT_LIB specifies the library identifier used in requests
 * to uniquely identify the Vertopal JavaScript Library.
 */
export const USER_AGENT_LIB = 'VertopalJavaScriptLib';

/**
 * SLEEP_PATTERN defines the default sleep durations (in seconds)
 * used for polling the status of long-running tasks. This pattern specifies
 * a sequence of intervals that increase progressively to reduce server
 * load while maintaining timely updates on the task's status.
 *
 * Example:
 * - `(10, 20, 30, 60)` means:
 *     - Wait 10 seconds after the first attempt,
 *     - Wait 20 seconds after the second attempt,
 *     - Wait 30 seconds after the third attempt,
 *     - Wait 60 seconds after all subsequent attempts.
 * This design allows polling with exponential backoff to balance efficiency
 * and server resource usage.
 */
export const SLEEP_PATTERN: number[] = [10, 10, 15];
