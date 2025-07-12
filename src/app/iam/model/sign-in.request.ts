/**
 * Model class for SignInRequest
 */
export class SignInRequest {
  public identifier: string;
  public password: string;

  constructor(identifier: string, password: string) {
    this.identifier = identifier;
    this.password = password;
  }
}
