import * as functions from "firebase-functions";

export class ArgumentError extends functions.https.HttpsError {
  constructor(message: string) {
    super("invalid-argument", message);
    this.name = "ArgumentError";
  }
}

export class NotFoundError extends functions.https.HttpsError {
  constructor(message: string) {
    super("not-found", message);
    this.name = "NotFoundError";
  }
}

export class PermissionDeniedError extends functions.https.HttpsError {
  constructor(message?: string) {
    super("permission-denied", message || "Access to resource is forbidden");
    this.name = "PermissionDeniedError";
  }
}

export class FailedPreconditionError extends functions.https.HttpsError {
  constructor(message: string) {
    super("failed-precondition", message);
    this.name = "FailedPreconditionError";
  }
}

export class AlreadyExistsError extends functions.https.HttpsError {
  constructor(message: string) {
    super("already-exists", message);
    this.name = "AlreadyExistsError";
  }
}

export class NotImplementedError extends functions.https.HttpsError {
  constructor(message?: string) {
    super("unimplemented", message || "Not implemented yet");
    this.name = "NotImplementedError";
  }
}
