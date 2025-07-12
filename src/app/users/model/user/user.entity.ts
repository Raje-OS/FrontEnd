export class User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  platforms: string[];
  images: string;

  constructor(user: {
    id?: string,
    firstName?: string,
    lastName?: string,
    userName?: string,
    email?: string,
    password?: string,
    platforms?: string[],
    images?: string
  }) {
    this.id = user.id || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.userName = user.userName || '';
    this.email = user.email || '';
    this.password = user.password || '';
    this.platforms = user.platforms || [];
    this.images = user.images || 'https://i.pinimg.com/236x/09/02/86/090286be7ffa5bc199ad0bb34af40d68.jpg';
  }
}
