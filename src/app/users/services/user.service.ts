import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {User} from '../model/user/user.entity';
import {environment} from '../../../environments/environment';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

const userResourceEndpoint=environment.userEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User>{

  constructor() {
    super();
    this.resourceEndpoint=userResourceEndpoint;
  }
  registerUser(user: User): Observable<User> {
    return this.create(user);
  }

  getUserById(userId: string): Observable<User> {
    const url = `${environment.serverBaseUrl}${environment.userEndpointPath}?id=${userId}`;
    console.log("User URL:", url);

    return this.http.get<User[]>(url).pipe(
      map((users: User[]) => {
        if (users && users.length > 0) {
          console.log("User found:", users[0]);
          return users[0];
        }
        console.warn("No user found for ID:", userId);
        return {} as User;
      })
    );
  }



}
