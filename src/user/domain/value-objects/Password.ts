export class Password {
  private readonly hashed: string;

  private constructor(hashed: string) {
    this.hashed = hashed;
  }

  static fromHashed(hashed: string): Password {
    return new Password(hashed);
  }

  getValue(): string {
    return this.hashed;
  }
}
