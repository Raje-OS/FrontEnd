export class SignUpResponse {
  public id: string;
  public firstName: string;
  public lastName: string;
  public userName: string;
  public email: string;
  public platforms: string[];
  public images: string;
  public token: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    platforms: string[],
    images: string,
    token: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    this.platforms = platforms;
    this.images = images;
    this.token = token;
  }
}
