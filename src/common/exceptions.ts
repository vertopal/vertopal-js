// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
//   Custom exception classes for the Vertopal JavaScript library.
//   These classes provide a structured way to represent and handle
//   errors that occur during API operations or internal processes.

/**
 * Base exception for Vertopal library errors.
 * Catching `APIException` handles any custom exception raised by this package.
 */
export class APIException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'APIException';
  }
}

/**
 * An unknown error occurred.
 */
export class OtherError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'OtherError';
  }
}

/**
 * Input file not found on the disk.
 */
export class InputNotFoundError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'InputNotFoundError';
  }
}

/**
 * There is a problem in connecting to the network.
 */
export class NetworkConnectionError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'NetworkConnectionError';
  }
}

/**
 * The parent class of the HTTP response of the API.
 */
export class APIResponseError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'APIResponseError';
  }
}

/**
 * The HTTP response is invalid and cannot be decoded to JSON.
 */
export class InvalidJSONResponseError extends APIResponseError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidJSONResponseError';
  }
}

/**
 * The parent class of the different API-level errors.
 */
export class APIError extends APIResponseError {
  constructor(message?: string) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * The server returned an HTTP 500 error. This is a server error.
 * Please contact us at vertopal.com if the problem persists.
 */
export class InternalServerError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InternalServerError';
  }
}

/**
 * The API Endpoint is not found.
 */
export class NotFoundError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Only the HTTP POST method is allowed.
 */
export class PostMethodAllowedError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'PostMethodAllowedError';
  }
}

/**
 * The Authorization header is required.
 */
export class MissingAuthorizationHeaderError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MissingAuthorizationHeaderError';
  }
}

/**
 * The Authorization header is invalid.
 */
export class InvalidAuthorizationHeaderError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidAuthorizationHeaderError';
  }
}

/**
 * The `[NAME]` field is invalid.
 */
export class InvalidFieldError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidFieldError';
  }
}

/**
 * The `[NAME]` field is required.
 */
export class MissingRequiredFieldError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MissingRequiredFieldError';
  }
}

/**
 * The `[NAME]` field has the wrong type.
 */
export class WrongTypeFieldError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongTypeFieldError';
  }
}

/**
 * The `[NAME]` key in the data is invalid.
 */
export class InvalidDataKeyError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidDataKeyError';
  }
}

/**
 * The `[NAME]` key in the data is required.
 */
export class MissingRequiredDataKeyError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MissingRequiredDataKeyError';
  }
}

/**
 * The `[NAME]` key in the data has the wrong type.
 */
export class WrongTypeDataKeyError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongTypeDataKeyError';
  }
}

/**
 * The `[NAME]` key in the data has the wrong value.
 */
export class WrongValueDataKeyError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongValueDataKeyError';
  }
}

/**
 * The access credential is invalid.
 */
export class InvalidCredentialError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidCredentialError';
  }
}

/**
 * To use Vertopal API, activating a premium plan is required.
 */
export class FreePlanDisallwedError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'FreePlanDisallwedError';
  }
}

/**
 * You do not have enough vCredits to run this task.
 */
export class InsufficentVCreditsError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InsufficentVCreditsError';
  }
}

/**
 * The callback is invalid.
 */
export class InvalidCallbackError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidCallbackError';
  }
}

/**
 * The domain of callback is not verified.
 */
export class UnverifiedDomainCallbackError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'UnverifiedDomainCallbackError';
  }
}

/**
 * The Connector is not dependent on any other Task.
 */
export class NoConnectorDependentTaskError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NoConnectorDependentTaskError';
  }
}

/**
 * The dependent task has not been completed correctly.
 */
export class NotReadyDependentTaskError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NotReadyDependentTaskError';
  }
}

/**
 * The dependent task API version is mismatched
 * with the current task API version.
 */
export class MismatchVersionDependentTaskError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MismatchVersionDependentTaskError';
  }
}

/**
 * The dependent task is mismatched with the current task.
 */
export class MismatchDependentTaskError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MismatchDependentTaskError';
  }
}

/**
 * The `[STATE]` file not exists.
 */
export class FileNotExistsError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'FileNotExistsError';
  }
}

/**
 * The download of this converted file has expired.
 */
export class DownloadExpiredError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'DownloadExpiredError';
  }
}

/**
 * Only request of files with the registered hash
 * is allowed in the development mode.
 */
export class OnlyDevelopmentRequestError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'OnlyDevelopmentRequestError';
  }
}

/**
 * The `[NAME]` parameter is invalid.
 */
export class InvalidParameterError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidParameterError';
  }
}

/**
 * The `[NAME]` parameter is required.
 */
export class MissingRequiredParameterError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'MissingRequiredParameterError';
  }
}

/**
 * The `[NAME]` parameter has the wrong type.
 */
export class WrongTypeParameterError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongTypeParameterError';
  }
}

/**
 * The `[NAME]` parameter has the wrong value.
 */
export class WrongValueParameterError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongValueParameterError';
  }
}

/**
 * Only file with the registered hash
 * is allowed in the development mode.
 */
export class OnlyDevelopmentFileError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'OnlyDevelopmentFileError';
  }
}

/**
 * File extension `[EXTENSION]` is not valid.
 */
export class NotValidExtensionError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NotValidExtensionError';
  }
}

/**
 * The max size of the file is `[MAXSIZE]` KB;
 * the current is `[FILESIZE]` KB.
 */
export class LimitUploadSizeError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'LimitUploadSizeError';
  }
}

/**
 * The submitted file is empty.
 */
export class EmptyFileError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'EmptyFileError';
  }
}

/**
 * The output format has the wrong structure.
 */
export class WrongOutputFormatStructureError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongOutputFormatStructureError';
  }
}

/**
 * The `[OUTPUT]` format is not found in the valid output formats.
 */
export class InvalidOutputFormatError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidOutputFormatError';
  }
}

/**
 * The input format has the wrong structure.
 */
export class WrongInputFormatStructureError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongInputFormatStructureError';
  }
}

/**
 * The `[INPUT]` format is not found in the valid input formats.
 */
export class InvalidInputFormatError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidInputFormatError';
  }
}

/**
 * There is no converter for `[INPUT]` format to `[OUTPUT]` format.
 */
export class NoConverterInputToOutputError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NoConverterInputToOutputError';
  }
}

/**
 * The file extension (`[FILE_EXTENSION]`) does not match
 * the input extension (`[INPUT_EXTENSION]`).
 */
export class NotMatchExtensionAndInputError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'NotMatchExtensionAndInputError';
  }
}

/**
 * Too Many Requests. Retry after `[DELAY]` seconds.
 */
export class TooManyRequestsError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'TooManyRequestsError';
  }
}

/**
 * The free app has a daily limit.
 * Please try again in the next `[DELAY]` hours.
 */
export class FreeAppLimitedError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'FreeAppLimitedError';
  }
}

/**
 * The task is disabled for the free app.
 */
export class DisabledForFreeAppError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'DisabledForFreeAppError';
  }
}

/**
 * The format has the wrong structure.
 */
export class WrongFormatStructureError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'WrongFormatStructureError';
  }
}

/**
 * The `[FORMAT]` format is not found in the valid formats.
 */
export class InvalidFormatError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidFormatError';
  }
}

/**
 * The conversion has failed.
 */
export class FailedConvertError extends APIError {
  constructor(message?: string) {
    super(message);
    this.name = 'FailedConvertError';
  }
}

/**
 * The server returned an HTTP response status of 4xx or 5xx.
 */
export class HTTPResponseError extends APIResponseError {
  constructor(message?: string) {
    super(message);
    this.name = 'HTTPResponseError';
  }
}

/**
 * The parent class of the API-task-level errors.
 */
export class APITaskError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'APITaskError';
  }
}

/**
 * Entity status is not running.
 */
export class EntityStatusNotRunningError extends APITaskError {
  constructor(message?: string) {
    super(message);
    this.name = 'EntityStatusNotRunningError';
  }
}

/**
 * Writing the output file to the disk failed.
 */
export class OutputWriteError extends APIException {
  constructor(message?: string) {
    super(message);
    this.name = 'OutputWriteError';
  }
}

/**
 * API Warning.
 */
export class APIWarning extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'APIWarning';
  }
}
