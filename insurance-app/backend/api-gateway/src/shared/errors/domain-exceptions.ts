import { ProblemFieldErrorItem } from './problem-details';

export class DomainException extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors: ProblemFieldErrorItem[] = [],
    readonly type?: string,
    readonly title?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationDomainException extends DomainException {
  constructor(detail = 'Validation failed', errors: ProblemFieldErrorItem[] = []) {
    super(400, detail, errors);
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(detail = 'Missing or invalid bearer token') {
    super(401, detail);
  }
}

export class BadGatewayDomainException extends DomainException {
  constructor(detail = 'Upstream service unavailable') {
    super(502, detail);
  }
}

export class UpstreamProblemDomainException extends DomainException {
  constructor(args: {
    status: number;
    detail: string;
    errors?: ProblemFieldErrorItem[];
    type?: string;
    title?: string;
  }) {
    super(args.status, args.detail, args.errors ?? [], args.type, args.title);
  }
}
