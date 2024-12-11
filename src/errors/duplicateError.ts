export class DuplicateError extends Error {
  constructor(public id: number) {
    super();
  }

  toString() {
    return `Duplicate: movement ${this.id}`;
  }
}
