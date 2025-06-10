export interface AuthService {
  sign(payload: object): string;
  verify(token: string): object;
}
