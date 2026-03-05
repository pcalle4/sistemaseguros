import { ProblemFieldError } from './problem-details';

export class DomainException extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors: ProblemFieldError[] = [],
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationDomainException extends DomainException {
  constructor(detail = 'Validation failed', errors: ProblemFieldError[] = []) {
    super(400, detail, errors);
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(detail = 'Resource not found') {
    super(404, detail);
  }
}
