export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("Email inválido");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}
