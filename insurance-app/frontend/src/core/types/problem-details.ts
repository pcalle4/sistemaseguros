export interface ProblemFieldError {
  field: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: ProblemFieldError[];
  traceId?: string;
}

export interface MappedProblemDetails {
  status?: number;
  globalMessage: string;
  fieldErrors: Record<string, string>;
  traceId?: string;
  detail?: string;
}

export class AppApiError extends Error {
  status?: number;
  fieldErrors: Record<string, string>;
  traceId?: string;
  detail?: string;

  constructor(input: MappedProblemDetails) {
    super(input.globalMessage);
    this.name = 'AppApiError';
    this.status = input.status;
    this.fieldErrors = input.fieldErrors;
    this.traceId = input.traceId;
    this.detail = input.detail;
  }
}
