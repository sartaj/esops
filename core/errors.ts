export class VariableError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Variable Error'
  }
}
