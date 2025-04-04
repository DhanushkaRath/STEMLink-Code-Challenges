class ValidationError extends Error {
  public details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export default ValidationError;