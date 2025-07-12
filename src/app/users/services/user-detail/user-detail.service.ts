import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { UserDetail } from '../../model/user-detail/user-detail.entity';
import {catchError, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const userDetailEndpoint = environment.userDetailEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class UserDetailService extends BaseService<UserDetail> {
  constructor() {
    super();
    this.resourceEndpoint = userDetailEndpoint;
  }
  // user-detail.service.ts
  getByUserId(userId: string | number): Observable<UserDetail> {
    return this.http.get<UserDetail[]>(`${this.resourcePath()}?userId=${userId}`, this.httpOptions)
      .pipe(
        map(details => details[0]),
        catchError(this.handleError)
      );
  }

  updateUserDetails(userDetail: UserDetail): Observable<UserDetail> {
    // Se asume que el backend espera la URL con el id del libro
    return this.http.put<UserDetail>(`${this.resourcePath()}/${userDetail.id}`, userDetail);
  }
}
