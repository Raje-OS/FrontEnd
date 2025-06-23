
export class UserDetail {
  id: string;
  userId: string;
  favorites: string[];
  viewed: string[];

  constructor(detail: {
    id?: string;
    userId?: string;
    favorites?: string[];
    viewed?: string[];
  }) {
    this.id = detail.id || '';
    this.userId = detail.userId || '';
    this.favorites = detail.favorites || [];
    this.viewed = detail.viewed || [];
  }
}
