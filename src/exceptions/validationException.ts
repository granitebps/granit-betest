export interface ValidationField {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  public code: number;
  public message: string;
  public fields: ValidationField[];

  constructor(code: number, message: string, fields: ValidationField[]) {
    super(message);
    this.code = code;
    this.message = message;
    this.fields = fields;
  }
}
