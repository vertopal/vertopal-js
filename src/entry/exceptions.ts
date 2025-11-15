// SPDX-License-Identifier: MIT
//
// Copyright (c) 2025 Vertopal - https://www.vertopal.com
// Repository: https://github.com/vertopal/vertopal-js
// Issues: https://github.com/vertopal/vertopal-js/issues
//
// Description:
// Provides exception classes used across the Vertopal JavaScript Library,
// centralizing access to error definitions so that API, validation, and
// conversion failures can be handled in a consistent and predictable way.

export {
  APIError,
  InternalServerError,
  NotFoundError,
  PostMethodAllowedError,
  MissingAuthorizationHeaderError,
  InvalidAuthorizationHeaderError,
  InvalidFieldError,
  MissingRequiredFieldError,
  WrongTypeFieldError,
  InvalidDataKeyError,
  MissingRequiredDataKeyError,
  WrongTypeDataKeyError,
  WrongValueDataKeyError,
  InvalidCredentialError,
  FreePlanDisallwedError,
  InsufficentVCreditsError,
  InvalidCallbackError,
  UnverifiedDomainCallbackError,
  NoConnectorDependentTaskError,
  NotReadyDependentTaskError,
  MismatchVersionDependentTaskError,
  MismatchDependentTaskError,
  FileNotExistsError,
  DownloadExpiredError,
  OnlyDevelopmentRequestError,
  InvalidParameterError,
  MissingRequiredParameterError,
  WrongTypeParameterError,
  WrongValueParameterError,
  OnlyDevelopmentFileError,
  NotValidExtensionError,
  LimitUploadSizeError,
  EmptyFileError,
  WrongOutputFormatStructureError,
  InvalidOutputFormatError,
  WrongInputFormatStructureError,
  InvalidInputFormatError,
  NoConverterInputToOutputError,
  NotMatchExtensionAndInputError,
  FailedConvertError,
} from '../common/exceptions.ts';
