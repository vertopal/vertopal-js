// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
// Provides a unified entry point for input and output operations in the
// Vertopal JavaScript Library, combining browser-specific I/O utilities
// with general file adapters to streamline file interactions across
// different environments.

export * from './io.browser.ts';
export {
  FileInput,
  FileOutput
} from '../io/adapters/file.ts';
