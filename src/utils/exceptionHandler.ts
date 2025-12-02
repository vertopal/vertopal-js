// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Exception handling utilities for Vertopal API responses.
//   Provides a mapping between API error codes and custom exception classes,
//   and the ExceptionHandler class for inspecting JSON responses.

import * as vex from '../common/exceptions.ts';
import { ErrorWrapper } from './dataWrappers.ts';

/**
 * A mapping of API error codes to custom exception classes.
 */
export const ERROR_CODE_MAP: Record<string, new (message: string) => Error> = {
  INTERNAL_SERVER_ERROR: vex.InternalServerError,
  NOT_FOUND: vex.NotFoundError,
  POST_METHOD_ALLOWED: vex.PostMethodAllowedError,
  MISSING_AUTHORIZATION_HEADER: vex.MissingAuthorizationHeaderError,
  INVALID_AUTHORIZATION_HEADER: vex.InvalidAuthorizationHeaderError,
  INVALID_FIELD: vex.InvalidFieldError,
  MISSING_REQUIRED_FIELD: vex.MissingRequiredFieldError,
  WRONG_TYPE_FIELD: vex.WrongTypeFieldError,
  INVALID_DATA_KEY: vex.InvalidDataKeyError,
  MISSING_REQUIRED_DATA_KEY: vex.MissingRequiredDataKeyError,
  WRONG_TYPE_DATA_KEY: vex.WrongTypeDataKeyError,
  WRONG_VALUE_DATA_KEY: vex.WrongValueDataKeyError,
  INVALID_CREDENTIAL: vex.InvalidCredentialError,
  FREE_PLAN_DISALLOWED: vex.FreePlanDisallwedError,
  INSUFFICIENT_VCREDITS: vex.InsufficentVCreditsError,
  INVALID_CALLBACK: vex.InvalidCallbackError,
  UNVERIFIED_DOMAIN_CALLBACK: vex.UnverifiedDomainCallbackError,
  NO_CONNECTOR_DEPENDENT_TASK: vex.NoConnectorDependentTaskError,
  NOT_READY_DEPENDENT_TASK: vex.NotReadyDependentTaskError,
  MISMATCH_VERSION_DEPENDENT_TASK: vex.MismatchVersionDependentTaskError,
  MISMATCH_DEPENDENT_TASK: vex.MismatchDependentTaskError,
  FILE_NOT_EXISTS: vex.FileNotExistsError,
  DOWNLOAD_EXPIRED: vex.DownloadExpiredError,
  ONLY_DEVELOPMENT_REQUEST: vex.OnlyDevelopmentRequestError,
  INVALID_PARAMETER: vex.InvalidParameterError,
  MISSING_REQUIRED_PARAMETER: vex.MissingRequiredParameterError,
  WRONG_TYPE_PARAMETER: vex.WrongTypeParameterError,
  WRONG_VALUE_PARAMETER: vex.WrongValueParameterError,
  ONLY_DEVELOPMENT_FILE: vex.OnlyDevelopmentFileError,
  NOT_VALID_EXTENSION: vex.NotValidExtensionError,
  LIMIT_UPLOAD_SIZE: vex.LimitUploadSizeError,
  EMPTY_FILE: vex.EmptyFileError,
  WRONG_OUTPUT_FORMAT_STRUCTURE: vex.WrongOutputFormatStructureError,
  INVALID_OUTPUT_FORMAT: vex.InvalidOutputFormatError,
  WRONG_INPUT_FORMAT_STRUCTURE: vex.WrongInputFormatStructureError,
  INVALID_INPUT_FORMAT: vex.InvalidInputFormatError,
  NO_CONVERTER_INPUT_TO_OUTPUT: vex.NoConverterInputToOutputError,
  NOT_MATCH_EXTENSION_AND_INPUT: vex.NotMatchExtensionAndInputError,
  TOO_MANY_REQUESTS: vex.TooManyRequestsError,
  FREE_APP_LIMITED: vex.FreeAppLimitedError,
  DISABLED_FOR_FREE_APP: vex.DisabledForFreeAppError,
  WRONG_FORMAT_STRUCTURE: vex.WrongFormatStructureError,
  INVALID_FORMAT: vex.InvalidFormatError,
  FAILED_CONVERT: vex.FailedConvertError,
};

/**
 * A utility class that inspects Vertopal API responses and raises
 * appropriate custom exceptions based on detected error codes.
 * Warnings are logged to the console but do not interrupt execution.
 *
 * This class ensures consistent error handling across Vertopal modules
 * by converting API error responses into strongly typed exceptions.
 */
export class ExceptionHandler {

  /**
   * Analyze an API response and raise an exception if an error is present.
   * If warnings are found, they are logged to the console.
   *
   * @param response - The JSON response object returned by the Vertopal API.
   * @returns Void.
   * @throws APIException or a subclass defined in ERROR_CODE_MAP
   *         when an error code is detected in the response.
   */
  static raiseForResponse(response: Record<string, any>): void {
    const wrapper = new ErrorWrapper(response);

    if (wrapper.hasError()) {
      const code = wrapper.getErrorCode();
      const message = wrapper.getErrorMessage();
      const ExceptionClass = ERROR_CODE_MAP[code] ?? vex.APIException;
      throw new ExceptionClass(`[${code}] ${message}`);
    }

    if (wrapper.hasWarning()) {
      const warnings = wrapper.getWarnings();
      console.warn('Warning(s) encountered:', warnings);
    }
  }
}
