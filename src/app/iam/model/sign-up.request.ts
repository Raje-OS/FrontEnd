/**
 * Model for sign up request
 */
export class SignUpRequest {
  public id: string;
  public firstName: string;
  public lastName: string;
  public userName: string;
  public email: string;
  public password: string;
  public platforms: string[]; // puedes ajustar el tipo si usas objetos
  public images: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    platforms: string[] = [],
    images: string = ''
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.platforms = platforms;
    this.images = images;
  }
}
