export class IdentityException extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'IdentityException';
  }
}

export class IdentityNotFoundException extends IdentityException {
  constructor(message = 'Identity not found') {
    super(message, 'IDENTITY_NOT_FOUND', 404);
    this.name = 'IdentityNotFoundException';
  }
}

export class InvalidCredentialsException extends IdentityException {
  constructor(message = 'Invalid credentials') {
    super(message, 'INVALID_CREDENTIALS', 401);
    this.name = 'InvalidCredentialsException';
  }
}

export class EmailAlreadyExistsException extends IdentityException {
  constructor(message = 'Email already registered') {
    super(message, 'EMAIL_ALREADY_EXISTS', 409);
    this.name = 'EmailAlreadyExistsException';
  }
}

export class EmailNotVerifiedException extends IdentityException {
  constructor(message = 'Email not verified') {
    super(message, 'EMAIL_NOT_VERIFIED', 403);
    this.name = 'EmailNotVerifiedException';
  }
}

export class AccountLockedException extends IdentityException {
  constructor(message = 'Account is locked due to too many failed login attempts') {
    super(message, 'ACCOUNT_LOCKED', 423);
    this.name = 'AccountLockedException';
  }
}

export class InvalidTokenException extends IdentityException {
  constructor(message = 'Invalid or expired token') {
    super(message, 'INVALID_TOKEN', 400);
    this.name = 'InvalidTokenException';
  }
}

export class SessionExpiredException extends IdentityException {
  constructor(message = 'Session has expired') {
    super(message, 'SESSION_EXPIRED', 401);
    this.name = 'SessionExpiredException';
  }
}

export class WeakPasswordException extends IdentityException {
  constructor(message = 'Password does not meet strength requirements') {
    super(message, 'WEAK_PASSWORD', 400);
    this.name = 'WeakPasswordException';
  }
}

export class ProviderAlreadyLinkedException extends IdentityException {
  constructor(message = 'Provider is already linked to another account') {
    super(message, 'PROVIDER_ALREADY_LINKED', 409);
    this.name = 'ProviderAlreadyLinkedException';
  }
}
