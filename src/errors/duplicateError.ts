export class DuplicateError extends Error {
  constructor(public id: number) {
    super();
  }

  toString() {
    return `Duplicsate: movement ${this.id}`;
  }
}
