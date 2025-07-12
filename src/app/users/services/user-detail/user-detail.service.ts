import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { UserDetail } from '../../model/user-detail/user-detail.entity';
import { catchError, Observable } from 'rxjs';

const userDetailEndpoint = environment.userDetailEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class UserDetailService extends BaseService<UserDetail> {
  constructor() {
    super();
    this.resourceEndpoint = userDetailEndpoint;
  }

  getByUserId(userId: string): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.resourcePath()}/user/${userId}`, this.httpOptions);
  }



  updateUserDetails(userDetail: UserDetail): Observable<UserDetail> {
    return this.http.put<UserDetail>(`${this.resourcePath()}/${userDetail.id}`, userDetail, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
