/**
 * Model for sign up request
 */
export class SignUpRequest {
  public username: string;
  public password: string;

  /**
   * Constructor.
   * @param username The username.
   * @param password The password.
   */
  constructor(username: string, password: string) {
    this.password = password;
    this.username = username;
  }
}
